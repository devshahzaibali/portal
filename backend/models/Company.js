const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    website: { type: String, trim: true },
    location: { type: String, trim: true },
    description: { type: String, trim: true },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

companySchema.index({ owner: 1 });

module.exports = mongoose.model('Company', companySchema);
