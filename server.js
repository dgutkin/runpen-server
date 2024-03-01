import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import userRoutes from './routes/userRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import entryRoutes from './routes/entryRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { VerifyToken } from './middleware/verify-token.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({origin: process.env.CLIENT_URL || 'http://localhost:3000'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const dbPath = process.env.DB_URL || 'mongodb://127.0.0.1:27017/runpen';

mongoose.connect(dbPath)
  .then(() => console.log('Database Connected!'));

app.get("/", function (req, res) {
  res.send("runPen back-end server");
});

app.use(VerifyToken);

app.use("/", userRoutes);
app.use("/", journalRoutes);
app.use("/", goalRoutes);
app.use("/", entryRoutes);
app.use("/", postRoutes);

app.listen(PORT, function () {
  console.log(`runPen back-end listening on port ${PORT}!`);
});
