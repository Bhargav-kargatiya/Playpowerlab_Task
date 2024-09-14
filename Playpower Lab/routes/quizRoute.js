import express from 'express';
import { createQuiz, submitQuiz, getQuizHistory, getQuizbyid, updateQuiz, getQuestion } from '../controllers/quizController.js';
import { getHintForQuestion } from '../controllers/bonusController.js';
getQuestion

const quizRouter = express.Router();

// Necessary API routes
quizRouter.post('/create', createQuiz);
quizRouter.post('/submit', submitQuiz);
quizRouter.get('/history', getQuizHistory);
quizRouter.post('/retry', submitQuiz);
quizRouter.get('/oldquiz/:Quizid', getQuizbyid);
quizRouter.put('/updateQuestion/:Quizid', updateQuiz);
quizRouter.get('/question', getQuestion);

// Bonus API routes
quizRouter.get('/hint/:questionId', getHintForQuestion);

export default quizRouter;
