const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled date/time is required'],
    },
    mode: {
      type: String,
      enum: ['online', 'onsite'],
      required: [true, 'Interview mode is required'],
    },
    meetingDetails: { type: String, trim: true }, // link if online, address if onsite
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

interviewSchema.index({ application: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
