import express from 'express';
import bodyParser from 'body-parser';
import quizRouter from '../routes/quizRoute.js';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnect from '../config/dbConnect.js';
import authRouter from '../routes/authRoute.js';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath

dotenv.config();
//db connect
dbConnect();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html')); // Use path.resolve to get an absolute path
});

app.use('/auth', authRouter);
app.use('/quiz', quizRouter);

export default app;
