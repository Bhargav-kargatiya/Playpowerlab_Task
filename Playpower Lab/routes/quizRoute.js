import express from 'express';
import { createQuiz, submitQuiz, getQuizHistory, getQuizbyid, updateQuiz, getQuestion } from '../controllers/quizController.js';
import { getHintForQuestion } from '../controllers/bonusController.js';
import { Ratelimiter } from '../middleware/Ratelimiter.js';


const quizRouter = express.Router();

// Necessary API routes
quizRouter.post('/create', Ratelimiter(50, 5), createQuiz);
quizRouter.post('/submit', Ratelimiter(50, 5), submitQuiz);
quizRouter.get('/history', Ratelimiter(50, 5), getQuizHistory);
quizRouter.post('/retry', Ratelimiter(50, 5), submitQuiz);
quizRouter.get('/oldquiz/:Quizid', Ratelimiter(50, 5), getQuizbyid);
quizRouter.put('/updateQuestion/:Quizid', Ratelimiter(50, 5), updateQuiz);
quizRouter.get('/question', Ratelimiter(50, 5), getQuestion);

// Bonus API routes
quizRouter.get('/hint/:questionId', getHintForQuestion);

export default quizRouter;
