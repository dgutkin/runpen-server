import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRoutes from './routes/user-routes';
import journalRoutes from './routes/journal-routes';
import goalRoutes from './routes/goal-routes';
import entryRoutes from './routes/entry-routes';
import tagRoutes from './routes/tag-routes';
import noteRoutes from './routes/note-routes';
import { VerifyToken } from './middleware/verify-token';

const app = express();

dotenv.config();

app.use(cors({origin: process.env.CLIENT_URL || 'http://localhost:3000'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const dbPath = process.env.DB_URL || 'mongodb://127.0.0.1:27017/runpen';

mongoose.connect(dbPath)
  .then(() => console.log('Database Connected!'));

app.get("/", function (req: Request, res: Response) {
  res.send("runPen back-end server");
});

app.use(VerifyToken);

app.use("/", userRoutes);
app.use("/", journalRoutes);
app.use("/", goalRoutes);
app.use("/", entryRoutes);
app.use("/", tagRoutes);
app.use("/", noteRoutes);

export default app;
