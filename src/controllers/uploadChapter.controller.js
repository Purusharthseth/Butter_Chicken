import { z } from "zod";
import ApiError from "../utils/Apierror.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Chapter } from "../models/chapterModel.js";

const chapterSchema = z.object({
  subject: z.string().min(1),
  chapter: z.string().min(1),
  class: z.string().min(1),
  unit: z.string().min(1),
  yearWiseQuestionCount: z.record(z.number().nonnegative()),
  questionSolved: z.number().nonnegative().optional(),
  status: z.enum(['Not Started', 'In Progress', 'Completed']).optional(),
  isWeakChapter: z.boolean().optional(),
});

const uploadChapters = async (req, res, next) => {
  try {
    let chapters = [];
    const contentType = req.headers["content-type"] || "";

    if (contentType.includes("multipart/form-data")) {
      if (!req.file) throw new ApiError(400, "No file uploaded");
      const raw = req.file.buffer.toString("utf8");
      try {
        chapters = JSON.parse(raw);
      } catch (err) {
        throw new ApiError(400, "Uploaded file is not valid JSON");
      }
    } else if (contentType.includes("application/json")) {
      chapters = req.body.chapters;
    } else {
      throw new ApiError(400, "Unsupported content type");
    }

    if (!Array.isArray(chapters)) {
      throw new ApiError(400, "Expected an array of chapters");
    }

    const failed = [];
    const inserted = [];

    for (const chapter of chapters) {
      const result = chapterSchema.safeParse(chapter);

      if (!result.success) {
        failed.push({
          chapter,
          error: result.error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      } else {
        try {
          const doc = await Chapter.create(result.data);
          inserted.push(doc.toObject());  // ✅ Fix: avoid circular refs
        } catch (dbErr) {
          failed.push({
            chapter: result.data,  // result.data is plain JS object, safe
            error: [{ path: "database", message: dbErr.message }],
          });
        }
      }
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          uploaded: inserted.length,
          failed: failed.length,
          failedChapters: failed,
          insertedChapters: inserted,
        },
        "Upload processed"
      )
    );
  } catch (err) {
    next(err);
  }
};

export default uploadChapters;
