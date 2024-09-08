import Quiz from "../model/Quiz.js";
import Submission from "../model/Submission.js";
import axios from 'axios';
import { QuizGenerator } from "../utils/QuizGenerator.js";
import asyncHandler from "express-async-handler";
import Question from "../model/Question.js";
import { suggestionsGenerator } from "../utils/SuggestionAI.js";
import { sendEmail } from "../utils/Sendmail.js";

// {
//     "grade": 5,
//     "Subject": "Maths",
//     "TotalQuestions": 10,
//     "MaxScore": 10,
//     "Difficulty": "EASY|MEDIUM|HARD"
//   }

const AUTH_SERVICE_URL = process.env.URL;
export const createQuiz = asyncHandler(
    async (req, res) => {
        try {
            const { grade, Subject, TotalQuestions, MaxScore, Difficulty } = req.body;
            const token = req.headers.authorization.split(" ")[1];

            // Generate questions using your QuizGenerator function
            const generatedQuestions = await QuizGenerator(grade, Subject, TotalQuestions, MaxScore, Difficulty);

            // Verify token and get user info from the auth service
            const response = await axios.get(AUTH_SERVICE_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const username = response.data.user;
            const questionIds = [];

            for (const questionData of generatedQuestions) {
                const question = new Question({
                    questionText: questionData.questionText,
                    options: questionData.options,
                    correctOption: questionData.correctOption,
                    difficulty: Difficulty,
                });
                await question.save();
                questionIds.push(question._id);
            }

            const quiz = new Quiz({
                grade,
                Subject,
                TotalQuestions,
                MaxScore,
                Difficulty,
                questions: questionIds,
                createdBy: username,
                createdDate: new Date(),
            });

            await quiz.save();
            //populate the quiz with questions
            quiz = await Quiz.findById(quiz._id).populate({
                path: 'questions',
                model: 'Question',
                select: 'questionText options'
            });
            res.status(201).json({ message: 'Quiz created successfully', quiz });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    }
);


// {
//     "quizId": "randomQuizId",
//     "responses": [
//       {
//         "questionId": "randomQuestionId1",
//         "userResponse": "A"
//       },
//       {
//         "questionId": "randomQuestionId2",
//         "userResponse": "D"
//       },
//       {
//         "questionId": "randomQuestionId3",
//         "userResponse": "B"
//       }
//     ]
//   }
export const submitQuiz = asyncHandler(async (req, res) => {
    try {
        const { quizId, responses, email } = req.body;
        const token = req.headers.authorization.split(" ")[1];
        // Verify token and get user info from the auth service
        const response = await axios.get(AUTH_SERVICE_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const username = response.data.user;

        // Fetch the quiz by quizId
        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const { TotalQuestions, MaxScore } = quiz;
        const scorePerQuestion = MaxScore / TotalQuestions;
        let totalScore = 0;
        const evaluatedResponses = await Promise.all(responses.map(async (response) => {
            const question = await Question.findById(response.questionId);  // Fetch the question by ID
            if (!question) {
                throw new Error(`Question with ID ${response.questionId} not found.`);
            }
            const isCorrect = response.userResponse === question.correctOption;
            if (isCorrect) {
                totalScore += scorePerQuestion;
            }

            return {
                questionId: response.questionId,
                questionText: question.questionText,
                userResponse: response.userResponse,
                correctOption: question.correctOption,
                isCorrect
            };
        }));
        const submission = new Submission({
            quizId,
            username,
            responses: evaluatedResponses.map(r => ({
                questionId: r.questionId,
                userResponse: r.userResponse
            })),
            score: totalScore,
            submittedDate: new Date(),
        });

        await submission.save();

        if (email !== undefined) {
            const suggestionsPrompt = `
            Based on the following performance in a quiz, provide two short skill improvement suggestions in second person
            (give entire two suggestion in one square bracket):
            Score: ${totalScore}/${MaxScore}
            Performance: ${evaluatedResponses.map(response => `
                Question: ${response.questionText}, Correct: ${response.isCorrect ? 'Yes' : 'No'}
            `).join(' ')}
        `;
            const aiResponse = await suggestionsGenerator(suggestionsPrompt);
            console.log(aiResponse);

            const AIsuggestions = aiResponse?.match(/\[(.*?)\]/)[1];
            await sendEmail(email, totalScore, MaxScore, evaluatedResponses, AIsuggestions);
            res.status(201).json({
                message: 'Quiz submitted and results emailed successfully',
                totalScore,
                evaluatedResponses
            });
        }
        else {
            res.status(201).json({
                message: 'Quiz submitted successfully',
                totalScore,
                evaluatedResponses
            });
        }
    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({ message: error.message });
    }
});

export const getQuizHistory = asyncHandler(async (req, res) => {
    try {
        const { grade, subject, minScore, maxScore, fromDate, toDate } = req.query;
        const token = req.headers.authorization.split(" ")[1];
        const verify = await axios.get(AUTH_SERVICE_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const username = verify.data.user;
        let query = { username };

        // Join Submission with Quiz to apply filters on Quiz fields (grade, subject)
        const quizMatch = {};
        if (grade) {
            quizMatch.grade = grade;
        }
        if (subject) {
            quizMatch.Subject = subject;
        }

        if (minScore) {
            query.score = { ...query.score, $gte: Number(minScore) };
        }
        if (maxScore) {
            query.score = { ...query.score, $lte: Number(maxScore) };
        }
        if (fromDate || toDate) {
            query.submittedDate = {};
            if (fromDate) {
                query.submittedDate.$gte = new Date(fromDate);
            }
            if (toDate) {
                query.submittedDate.$lte = new Date(toDate);
            }
        }
        // console.log(query);
        // console.log(quizMatch);
        const submissions = await Submission.find(query)
            .populate({
                path: 'quizId',
                match: quizMatch,
                select: 'grade Subject TotalQuestions MaxScore Difficulty',
                populate: {
                    path: 'questions',
                    model: 'Question',
                    select: 'questionText options correctOption'
                }
            })
            .exec();

        // Filter out any submissions where quizId is null (because of mismatching quiz filters)
        const filteredSubmissions = submissions.filter(sub => sub.quizId !== null);

        if (filteredSubmissions.length !== 0) {
            res.status(200).json({
                message: 'Quiz history retrieved successfully',
                data: filteredSubmissions
            });
        }
        else {
            res.status(404).json({ message: 'No quiz history found' });
        }

    } catch (error) {
        console.error("Error retrieving quiz history:", error);
        res.status(500).json({ message: error.message });
    }
});

export const getQuizbyid = asyncHandler(async (req, res) => {
    try {
        const { Quizid } = req.params;
        console.log(req.params);

        const quiz = await Quiz.findById(Quizid).populate({
            path: 'questions',
            model: 'Question',
            select: 'questionText options'
        });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json({ message: 'Quiz retrieved successfully', data: quiz });
    } catch (error) {
        console.error("Error retrieving quiz:", error);
        res.status(500).json({ message: error.message });
    }

});


