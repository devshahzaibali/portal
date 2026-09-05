const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, required: true },
    phone: { type: String, trim: true, required: true },
    linkedIn: { type: String, trim: true },
    portfolioUrl: { type: String, trim: true },
    currentRole: { type: String, trim: true },
    yearsOfExperience: { type: Number, min: 0, max: 50 },
    coverNote: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    resumeFileName: { type: String, trim: true },
    resumeSource: { type: String, enum: ['url', 'file'], default: 'url' },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'],
      default: 'applied',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
