const CandidateProfile = require('../models/CandidateProfile');
const catchAsync = require('../utils/catchAsync');

exports.getMyProfile = catchAsync(async (req, res, next) => {
  let profile = await CandidateProfile.findOne({ user: req.user._id });

  // If the candidate hasn't created a profile yet, return an empty shell
  // instead of a 404 — the frontend "profile" screen should always render.
  if (!profile) {
    profile = { user: req.user._id, skills: [], education: [], experience: [] };
  }

  res.status(200).json({
    success: true,
    message: 'Profile fetched',
    data: profile,
  });
});

exports.updateMyProfile = catchAsync(async (req, res, next) => {
  const allowedFields = ['headline', 'skills', 'education', 'experience', 'resumeUrl', 'portfolioUrl'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const profile = await CandidateProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: updates, $setOnInsert: { user: req.user._id } },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated',
    data: profile,
  });
});
