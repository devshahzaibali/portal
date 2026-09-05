const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    degree: String,
    institution: String,
    year: Number,
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    company: String,
    role: String,
    startDate: Date,
    endDate: Date,
    description: String,
  },
  { _id: false }
);

const candidateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    headline: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    education: [educationSchema],
    experience: [experienceSchema],
    resumeUrl: { type: String, trim: true },
    portfolioUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
