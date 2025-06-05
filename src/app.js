import express from 'express';
import cors from 'cors';
import apiErrorHandler from './middleware/apiErrorHandler.js';
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

app.use(apiErrorHandler);
export { app };
