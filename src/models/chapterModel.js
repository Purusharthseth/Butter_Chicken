import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  chapter: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  yearWiseQuestionCount: {
    type: Map,
    of: Number,
    required: true,
  },
  questionSolved: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started',
  },
  isWeakChapter: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export const Chapter = mongoose.models.chapter || mongoose.model('chapter', chapterSchema);
