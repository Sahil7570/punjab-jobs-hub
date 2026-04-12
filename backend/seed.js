const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const Job = require('./models/Job');

dotenv.config();

const sampleJobs = [
  {
    title: 'Punjab Police Constable Recruitment 2025',
    department: 'Punjab Police Department',
    category: 'Police',
    salary: '₹19,900 - ₹63,200 per month',
    totalVacancies: 1746,
    lastDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    applyLink: 'https://punjabpolice.gov.in',
    eligibility: { gender: 'Both', minAge: 18, maxAge: 28, qualification: '12th' },
    overview: 'Punjab Police Department is recruiting for the post of Constable (Male & Female). This is a great opportunity for candidates from Punjab to join the state police force. Total 1746 vacancies are available across various districts.',
    selectionProcess: 'Selection will be done in three stages: (1) Physical Measurement Test (PMT), (2) Physical Screening Test (PST), and (3) Written Examination followed by Medical Examination.',
    documents: ['10th class certificate & marksheet', '12th class certificate & marksheet', 'Date of Birth proof', 'Punjab domicile certificate', 'Caste certificate (if applicable)', 'Character certificate from Gazetted Officer', 'Recent passport-size photographs (8 copies)', 'Aadhaar Card'],
    stepsToApply: ['Visit punjabpolice.gov.in', 'Click on "Recruitment" section', 'Select "Constable Recruitment 2025"', 'Register using your mobile number and email ID', 'Fill in personal details and education information', 'Upload scanned copies of required documents', 'Pay the application fee online (₹100 General, Nil SC/ST)', 'Download and save the confirmation receipt'],
    commonMistakes: ['Uploading blurry or low-resolution photographs', 'Entering incorrect date of birth', 'Forgetting to save the application number', 'Applying without checking district-wise vacancies', 'Paying fee multiple times by refreshing the payment page'],
  },
  {
    title: 'PSSSB Clerk Cum Data Entry Operator 2025',
    department: 'Punjab Subordinate Services Selection Board',
    category: 'Clerk',
    salary: '₹10,300 - ₹34,800 per month',
    totalVacancies: 500,
    lastDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    applyLink: 'https://sssb.punjab.gov.in',
    eligibility: { gender: 'Both', minAge: 18, maxAge: 37, qualification: '12th' },
    overview: 'PSSSB has announced recruitment for 500+ Clerk Cum Data Entry Operator posts across various government departments in Punjab. Candidates with 12th pass and basic computer knowledge are eligible.',
    selectionProcess: 'Selection will be based on: (1) Written Test (Objective Type - 120 marks), (2) Typing Test in English/Punjabi (qualifying), and (3) Document Verification.',
    documents: ['10th and 12th marksheets', 'Computer literacy certificate', 'Punjabi language certificate', 'Punjab domicile certificate', 'Caste certificate if applicable', 'Aadhaar Card and PAN Card', '4 passport-size photographs'],
    stepsToApply: ['Go to sssb.punjab.gov.in', 'Click on "Apply Online" for Clerk Cum DEO Recruitment 2025', 'Create a new account with valid email and mobile', 'Fill the online application form', 'Upload required documents', 'Pay application fee: ₹200 General, ₹50 SC/ST', 'Submit and take a printout'],
    commonMistakes: ['Not having a valid computer course certificate', 'Selecting wrong category', 'Missing Punjabi language requirement', 'Uploading documents in wrong format'],
  },
  {
    title: 'Punjab Education Department Teacher Recruitment 2025',
    department: 'Department of School Education Punjab',
    category: 'Teaching',
    salary: '₹35,400 - ₹1,12,400 per month',
    totalVacancies: 8393,
    lastDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    applyLink: 'https://educationrecruitmentboard.com',
    eligibility: { gender: 'Both', minAge: 21, maxAge: 37, qualification: 'Graduate' },
    overview: 'Department of School Education, Punjab has released notification for 8393 Master Cadre Teacher posts. Candidates with B.Ed degree and PSTET/CTET qualification are eligible.',
    selectionProcess: 'Selection based on: (1) Academic Qualifications (60%), (2) PSTET/CTET Score (20%), and (3) Interview (20%). Final selection will be district-wise.',
    documents: ['Graduation degree certificate', 'B.Ed degree certificate', 'PSTET or CTET certificate', '10th and 12th certificates', 'Punjab domicile certificate', 'Aadhaar card, PAN card', '6 passport-size photographs'],
    stepsToApply: ['Visit Education Recruitment Board Punjab website', 'Navigate to "Teacher Recruitment 2025"', 'Register with your email ID and mobile number', 'Fill in academic details and PSTET/CTET score', 'Select subject and preferred district', 'Upload all required documents', 'Pay fee ₹600 General / ₹150 SC/BC', 'Submit and print acknowledgment'],
    commonMistakes: ['Applying without valid PSTET or CTET certificate', 'Filling incorrect PSTET/CTET score', 'Not choosing correct subject specialization', 'Applying for wrong district'],
  },
  {
    title: 'Punjab Mandi Board Field Assistant 2025',
    department: 'Punjab Mandi Board',
    category: 'Others',
    salary: '₹25,500 - ₹81,100 per month',
    totalVacancies: 200,
    lastDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    applyLink: 'https://mandiboard.punjab.gov.in',
    eligibility: { gender: 'Male', minAge: 18, maxAge: 35, qualification: 'Graduate' },
    overview: 'Punjab Mandi Board invites applications for Field Assistant posts. Selected candidates will be responsible for monitoring agricultural markets and farmer-related services in their assigned mandis.',
    selectionProcess: '(1) Written Examination (100 marks), (2) Physical Test, and (3) Document Verification.',
    documents: ['Graduation certificate', '10th and 12th marksheets', 'Punjab domicile certificate', 'Caste certificate', 'Aadhaar card', '4 passport-size photographs'],
    stepsToApply: ['Visit mandiboard.punjab.gov.in', 'Go to "Recruitment" tab', 'Download and read the official notification', 'Register online', 'Fill qualification and category information', 'Upload scanned documents', 'Pay the application fee'],
    commonMistakes: ['Missing the close deadline — closes very soon!', 'Not having Punjab domicile certificate', 'Incomplete document upload'],
  },
  {
    title: 'Punjab Vigilance Bureau Inspector 2025',
    department: 'Punjab Vigilance Bureau',
    category: 'Police',
    salary: '₹44,900 - ₹1,42,400 per month',
    totalVacancies: 50,
    lastDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    applyLink: 'https://punjabvigilance.gov.in',
    eligibility: { gender: 'Both', minAge: 21, maxAge: 35, qualification: 'Graduate' },
    overview: 'Punjab Vigilance Bureau is recruiting Inspector level officers to carry out anti-corruption investigations and vigilance work.',
    selectionProcess: '(1) Written Examination (200 marks), (2) Physical Fitness Test, (3) Interview and Medical Examination.',
    documents: ['Graduation certificate', '10th and 12th certificates', 'Punjab domicile certificate', 'Character certificate from SDM', 'No criminal record certificate', 'Aadhaar card', '8 passport-size photographs'],
    stepsToApply: ['Visit punjabvigilance.gov.in', 'Open Inspector Recruitment 2025 notification', 'Check all eligibility criteria', 'Register and complete the online form', 'Upload all documents including character certificate', 'Pay fee ₹500 General / ₹125 SC/BC', 'Note your application number'],
    commonMistakes: ['Not obtaining proper character certificate before deadline', 'Underestimating Law section — study CrPC, IPC, Evidence Act', 'Not keeping printout of application'],
  },
  {
    title: 'PSPCL Junior Engineer (Electrical) 2025',
    department: 'Punjab State Power Corporation Limited',
    category: 'Others',
    salary: '₹48,000 - ₹1,51,100 per month',
    totalVacancies: 800,
    lastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    applyLink: 'https://pspcl.in',
    eligibility: { gender: 'Both', minAge: 18, maxAge: 37, qualification: 'Graduate' },
    overview: 'PSPCL has invited applications for Junior Engineer (Electrical). Candidates with B.Tech/B.E. in Electrical Engineering or Diploma in Electrical Engineering are eligible. 800 vacancies announced.',
    selectionProcess: 'Online written test of 120 marks: Technical Questions (80%), Punjabi Language (10%), General Awareness (10%).',
    documents: ['B.Tech/B.E. or Diploma in Electrical Engineering', '10th and 12th certificates', 'Punjab domicile certificate', 'Caste certificate if applicable', 'Aadhaar card and PAN Card', '4 passport-size photographs'],
    stepsToApply: ['Go to pspcl.in', 'Navigate to "Career" section', 'Read official notification', 'Register online', 'Fill complete application form', 'Upload documents', 'Pay fee ₹600 General / ₹150 SC/BC', 'Submit and save confirmation'],
    commonMistakes: ['Applying with wrong specialization — must be Electrical', 'Not preparing for Punjabi language section', 'Fee payment failure — use stable internet connection'],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/punjab-jobs-hub');
    console.log('✅ Connected to MongoDB');

    await Job.deleteMany({});
    console.log('🗑️  Cleared existing jobs');

    const jobs = await Job.insertMany(sampleJobs);
    console.log(`✅ Inserted ${jobs.length} sample jobs`);

    // Create default admin if not exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@punjabjobshub.in' });
    if (!existingAdmin) {
      await Admin.create({
        name: 'Super Admin',
        email: process.env.ADMIN_EMAIL || 'admin@punjabjobshub.in',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'superadmin',
      });
      console.log(`✅ Admin created: ${process.env.ADMIN_EMAIL || 'admin@punjabjobshub.in'}`);
    } else {
      console.log('ℹ️  Admin already exists, skipping');
    }

    console.log('\n🎉 Seed completed!\n');
    jobs.forEach((j) => console.log(`  • ${j.title} [${j.category}]`));
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
