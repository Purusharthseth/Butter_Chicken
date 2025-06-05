import { Chapter } from "../models/chapterModel.js";
import ApiError from "../utils/Apierror.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// GET /api/v1/chapters/:id
const getChapterById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check for valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid chapter id");
    }

    const chapter = await Chapter.findById(id);
    if (!chapter) {
      throw new ApiError(404, "Chapter not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, chapter, "Chapter fetched successfully"));
  } catch (err) {
    next(err);
  }
};

export default getChapterById;