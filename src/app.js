import express from 'express';
import cors from 'cors';

const app = express();


app.set('trust proxy', 1);

app.use(express.json());

app.use(cors({
  origin: '*',          
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Importing routes
import chapterRoutes from "./routes/chapter.routes.js";

// Using routes
app.use("/api/v1/chapters", chapterRoutes);

export { app };
