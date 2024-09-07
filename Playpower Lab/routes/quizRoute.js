import express from 'express';
import { createQuiz, submitQuiz, getQuizHistory, getQuizbyid } from '../controllers/quizController.js';


const quizRouter = express.Router();


quizRouter.post('/create', createQuiz);
quizRouter.post('/submit', submitQuiz);
quizRouter.get('/history', getQuizHistory);
quizRouter.post('/retry', submitQuiz);
quizRouter.get('/oldquiz/:Quizid', getQuizbyid);

export default quizRouter;
