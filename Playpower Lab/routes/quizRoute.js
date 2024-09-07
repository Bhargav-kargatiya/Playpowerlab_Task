import express from 'express';
import { createQuiz, submitQuiz, getQuizHistory, getQuizbyid } from '../controllers/quizController.js';
import { getHintForQuestion } from '../controllers/bonusController.js';


const quizRouter = express.Router();

// Necessary API routes
quizRouter.post('/create', createQuiz);
quizRouter.post('/submit', submitQuiz);
quizRouter.get('/history', getQuizHistory);
quizRouter.post('/retry', submitQuiz);
quizRouter.get('/oldquiz/:Quizid', getQuizbyid);

// Bonus API routes
quizRouter.get('/hint/:questionId', getHintForQuestion);

export default quizRouter;
