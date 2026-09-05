const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    skills: [{ type: String, trim: true }],
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'contract'],
      required: [true, 'Job type is required'],
    },
    workMode: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      required: [true, 'Work mode is required'],
    },
    location: { type: String, trim: true },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'closed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ location: 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ recruiter: 1 });

module.exports = mongoose.model('Job', jobSchema);
