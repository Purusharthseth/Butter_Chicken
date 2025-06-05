import { Chapter } from "../models/chapterModel.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/Apierror.js";

const getAllChapters = async (req, res, next) => {
  try {
    const {
      class: className, //'class' is a reserved keyword in JavaScript.
      unit,
      status,
      subject,
      weakChapters,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};
    if (className) filter.class = className;
    if (unit) filter.unit = unit;
    if (status) filter.status = status;
    if (subject) filter.subject = subject;
    if (weakChapters === "true") filter.weak = true;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const chapterLimit = parseInt(limit);

    const [chapters, total] = await Promise.all([
      Chapter.find(filter).skip(skip).limit(chapterLimit),
      Chapter.countDocuments(filter)
    ]);

    if (!chapters || chapters.length === 0) {
      throw new ApiError(404, "No chapters found for given filters");
    }

    res.status(200).json(
      new ApiResponse(200, {
        totalChapters: total,
        page: parseInt(page),
        limit: chapterLimit,
        totalPages: Math.ceil(total / chapterLimit),
        chapters,
      }, "Chapters fetched successfully")
    );
  } catch (err) {
    next(err);
  }
};

export default getAllChapters;
