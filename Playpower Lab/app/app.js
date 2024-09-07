import express from 'express';
import bodyParser from 'body-parser';
import quizRouter from '../routes/quizRoute.js';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnect from '../config/dbConnect.js';
dotenv.config();
//db connect
dbConnect();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/quiz', quizRouter);

export default app;
