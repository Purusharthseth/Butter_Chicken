import express from 'express';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());

//importing routes
import chapterRoutes from "./routes/chapter.routes.js";
//using routes
app.use("/api/v1/chapters", chapterRoutes);
export {app};