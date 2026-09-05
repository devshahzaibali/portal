require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');

const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const seedData = async () => {
  console.log('Wiping existing data...');
  await Promise.all([
    User.deleteMany({}),
    CandidateProfile.deleteMany({}),
    Company.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
    Interview.deleteMany({}),
  ]);

  console.log('Creating users...');

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'Admin@1234',
    role: 'admin',
  });

  const recruiter1 = await User.create({
    name: 'Sara Recruiter',
    email: 'sara.recruiter@test.com',
    password: 'Recruiter@123',
    role: 'recruiter',
  });

  const recruiter2 = await User.create({
    name: 'Bilal Recruiter',
    email: 'bilal.recruiter@test.com',
    password: 'Recruiter@123',
    role: 'recruiter',
  });

  const candidateData = [
    { name: 'Ali Candidate', email: 'ali.candidate@test.com' },
    { name: 'Ayesha Candidate', email: 'ayesha.candidate@test.com' },
    { name: 'Usman Candidate', email: 'usman.candidate@test.com' },
    { name: 'Fatima Candidate', email: 'fatima.candidate@test.com' },
    { name: 'Hamza Candidate', email: 'hamza.candidate@test.com' },
  ];

  const candidates = [];
  for (const c of candidateData) {
    const user = await User.create({
      name: c.name,
      email: c.email,
      password: 'Candidate@123',
      role: 'candidate',
    });
    candidates.push(user);

    await CandidateProfile.create({
      user: user._id,
      headline: 'Aspiring Full-Stack Developer',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'].slice(0, 2 + Math.floor(Math.random() * 3)),
      education: [{ degree: 'BSCS', institution: 'Lahore Leads University', year: 2026 }],
      experience: [],
      resumeUrl: `https://example.com/resumes/${user._id}.pdf`,
      portfolioUrl: `https://portfolio.example.com/${user._id}`,
    });
  }

  console.log('Creating companies...');

  const company1 = await Company.create({
    owner: recruiter1._id,
    name: 'Triad Labz',
    website: 'https://triadlabz.com',
    location: 'Lahore, Pakistan',
    description: 'Product development studio building SaaS tools.',
    approvalStatus: 'approved',
  });

  const company2 = await Company.create({
    owner: recruiter2._id,
    name: 'Code-XA',
    website: 'https://code-xa.com',
    location: 'Lahore, Pakistan',
    description: 'Full-stack development agency for local businesses.',
    approvalStatus: 'pending',
  });

  console.log('Creating jobs...');

  const jobsToCreate = [
    { company: company1, recruiter: recruiter1, title: 'Junior Backend Developer', type: 'internship', workMode: 'hybrid', status: 'approved', deadlineDays: 30 },
    { company: company1, recruiter: recruiter1, title: 'React Frontend Intern', type: 'internship', workMode: 'remote', status: 'approved', deadlineDays: 20 },
    { company: company1, recruiter: recruiter1, title: 'Full-Stack MERN Developer', type: 'full-time', workMode: 'onsite', status: 'approved', deadlineDays: 45 },
    { company: company1, recruiter: recruiter1, title: 'DevOps / Server Admin', type: 'contract', workMode: 'remote', status: 'approved', deadlineDays: 15 },
    { company: company2, recruiter: recruiter2, title: 'Junior QA / Automation Engineer', type: 'part-time', workMode: 'hybrid', status: 'pending', deadlineDays: 25 },
    { company: company2, recruiter: recruiter2, title: 'AI Chatbot Developer (Closed Role)', type: 'full-time', workMode: 'remote', status: 'rejected', deadlineDays: -5 },
  ];

  const jobs = [];
  for (const j of jobsToCreate) {
    const job = await Job.create({
      company: j.company._id,
      recruiter: j.recruiter._id,
      title: j.title,
      description: `We are looking for a ${j.title} to join our team. Strong fundamentals in JavaScript and a willingness to learn required.`,
      skills: ['JavaScript', 'Node.js', 'MongoDB', 'React'],
      type: j.type,
      workMode: j.workMode,
      location: 'Lahore, Pakistan',
      salaryMin: 30000,
      salaryMax: 80000,
      deadline: daysFromNow(j.deadlineDays),
      status: j.status,
    });
    jobs.push(job);
  }

  console.log('Creating applications...');

  const approvedJobs = jobs.filter((j) => j.status === 'approved');
  const statusCycle = ['applied', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'];

  const applications = [];
  let statusIndex = 0;
  for (const job of approvedJobs) {
    for (const candidate of candidates) {
      if (Math.random() < 0.4) continue;

      const status = statusCycle[statusIndex % statusCycle.length];
      statusIndex += 1;

      try {
        const app = await Application.create({
          job: job._id,
          candidate: candidate._id,
          coverNote: `I am very interested in the ${job.title} role and believe my skills are a strong fit.`,
          resumeUrl: `https://example.com/resumes/${candidate._id}.pdf`,
          status,
          appliedAt: daysAgo(Math.floor(Math.random() * 10)),
        });
        applications.push(app);
      } catch (err) {
        // Skip duplicates silently — the unique index is doing its job.
      }
    }
  }

  console.log('Creating interviews...');

  const interviewCandidateApps = applications.filter((a) => a.status === 'interview');
  for (const app of interviewCandidateApps.slice(0, 2)) {
    await Interview.create({
      application: app._id,
      scheduledAt: daysFromNow(3),
      mode: 'online',
      meetingDetails: 'https://meet.google.com/seed-interview-link',
      notes: 'Initial technical screening round.',
    });
  }

  console.log('\nSeed complete.\n');
  console.log('Test accounts:');
  console.log('  Admin:      admin@test.com / Admin@1234');
  console.log('  Recruiter1: sara.recruiter@test.com / Recruiter@123 (approved company: Triad Labz)');
  console.log('  Recruiter2: bilal.recruiter@test.com / Recruiter@123 (pending company: Code-XA)');
  console.log('  Candidates: ali.candidate@test.com ... hamza.candidate@test.com / Candidate@123');
  console.log(`\nCreated ${jobs.length} jobs, ${applications.length} applications, ${interviewCandidateApps.slice(0, 2).length} interviews.\n`);
};

if (require.main === module) {
  const connectDB = require('../config/db');
  connectDB()
    .then(async () => {
      await seedData();
      await mongoose.connection.close();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}

module.exports = seedData;
