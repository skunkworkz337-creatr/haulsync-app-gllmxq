
export interface OnboardingStep {
  id: number;
  title: string;
  content: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Registration & Account Creation',
    content: [
      'Welcome to Haul.IO! Create your secure hauler account.',
      'Provide your full legal name, business name (if applicable), phone number, and valid email address.',
      'Set a strong password and keep it confidential.',
      'Select your role as Hauler during sign-up.',
      'Verify your email via the link sent to your inbox before proceeding.',
      'Customers gain immediate access; haulers continue the onboarding process.',
    ],
  },
  {
    id: 2,
    title: 'Background & DMV Check via Checkr',
    content: [
      'To maintain a trusted community, haulers must complete background and DMV checks with Checkr.',
      'You will be sent a secure Checkr link to pay and submit required information.',
      'Follow all instructions carefully—progress depends on successful submission and favorable results.',
      'Admin monitors Checkr\'s dashboard and notifies you by email upon completion.',
      'Approved applicants move to the next step; denied applicants receive information on next steps.',
    ],
  },
  {
    id: 3,
    title: 'Document Submission',
    content: [
      'After approval, upload clear, legible copies of:',
      '  - Driver\'s License (front and back)',
      '  - Vehicle Registration',
      '  - Proof of Insurance (meeting minimum state requirements for hauling services)',
      'Ensure that documents show your name, are valid, and not expired.',
      'Incomplete or unclear documents must be resubmitted.',
    ],
  },
  {
    id: 4,
    title: 'Business & Service Area Setup',
    content: [
      'Provide additional business details (e.g., EIN or license numbers if applicable).',
      'Describe your vehicle fleet, including types and number of vehicles or special equipment.',
      'Select your preferred service areas by zip code, city, or county.',
      'Service area coverage depends on your subscription tier:',
      '  • Free: Limited coverage',
      '  • Pro: Expanded regional coverage',
      '  • Premier: Full city/county coverage',
    ],
  },
  {
    id: 5,
    title: 'Subscription Tiers',
    content: [
      'Choose your plan during onboarding. Payment is securely handled in-app.',
      'Upgrade or downgrade your plan anytime to suit your business.',
      '',
      'Tier Comparison:',
      '',
      'Free - $0/month',
      '  • Limited Coverage',
      '  • Basic listings, limited jobs, ads',
      '',
      'Pro - $5/month or $50/year',
      '  • Expanded Regional Coverage',
      '  • Ad-free, more jobs, priority notifications',
      '',
      'Premier - $15/month or $150/year',
      '  • Full City/County Coverage',
      '  • All Pro features, analytics, premium support',
    ],
  },
  {
    id: 6,
    title: 'Courtesy & Customer Service',
    content: [
      'Always be polite, professional, and communicate clearly.',
      'Arrive on time for every job.',
      'Respect customers\' property and privacy.',
      'Address disputes calmly and professionally.',
      'Use Haul.IO\'s in-app messaging for communication.',
      'Encourage and value customer feedback.',
    ],
  },
  {
    id: 7,
    title: 'Safety & Personal Protective Equipment (PPE)',
    content: [
      'Wear gloves and closed-toe shoes at all times.',
      'Use safe lifting techniques during jobs.',
      'Wear safety vests for large or public-area jobs.',
      'Do not handle hazardous or illegal materials. Report suspicious items immediately.',
      'Report any work-related incidents or accidents right away.',
    ],
  },
  {
    id: 8,
    title: 'Job Assignment & Operations',
    content: [
      'Haul.IO assigns jobs automatically based on service area and subscription tier—no bidding required.',
      'Accept jobs promptly and confirm your availability.',
      'Update job status regularly until completion.',
      'Complete jobs exactly as requested and documented.',
    ],
  },
  {
    id: 9,
    title: 'Communication Guidelines',
    content: [
      'Use the in-app messaging system to communicate with customers.',
      'Respond promptly to all notifications and messages.',
      'Clearly explain any delays or issues.',
      'Maintain professionalism in all communications.',
    ],
  },
  {
    id: 10,
    title: 'Final Quiz & Certification',
    content: [
      'Complete a final quiz on all onboarding topics.',
      'Quiz includes multiple choice and true/false questions.',
      'A passing score is required before account activation.',
      'Retake the quiz if necessary.',
      'Electronically certify your understanding and agreement with Haul.IO policies.',
    ],
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the first step to becoming a hauler on Haul.IO?',
    options: [
      'A) Complete the background check',
      'B) Register an account and verify your email',
      'C) Upload your documents',
      'D) Choose a subscription plan',
    ],
    correctAnswer: 'B',
    explanation: 'Registration and email verification is the first step before proceeding to background checks.',
  },
  {
    id: 2,
    question: 'True or False: Customers must wait to verify their email before accessing the platform.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Customers get immediate access after registration. Only haulers need to complete additional verification steps.',
  },
  {
    id: 3,
    question: 'Who handles the payment and processing of the background and DMV checks?',
    options: [
      'A) Haul.IO Admin',
      'B) Stripe',
      'C) Checkr',
      'D) The hauler themselves without a third party',
    ],
    correctAnswer: 'C',
    explanation: 'Checkr is the third-party service that handles background and DMV check payments and processing.',
  },
  {
    id: 4,
    question: 'What happens if your background check is denied?',
    options: [
      'A) You can still proceed with onboarding',
      'B) You receive instructions on how to resolve it and cannot proceed until cleared',
      'C) You get a warning but continue',
      'D) You are automatically approved regardless',
    ],
    correctAnswer: 'B',
    explanation: 'Denied applicants receive information on next steps and cannot proceed until the issue is resolved.',
  },
  {
    id: 5,
    question: 'Which of the following documents must you upload after background approval? (Select all that apply)',
    options: [
      'A) Driver\'s License',
      'B) Vehicle Registration',
      'C) Proof of Insurance',
      'D) Social Security Card',
    ],
    correctAnswer: 'A, B, C',
    explanation: 'You must upload Driver\'s License, Vehicle Registration, and Proof of Insurance. Social Security Card is not required.',
  },
  {
    id: 6,
    question: 'True or False: Expired or unclear documents will be accepted as long as the policy is followed.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'All documents must be valid, clear, and not expired. Incomplete or unclear documents must be resubmitted.',
  },
  {
    id: 7,
    question: 'What business detail is required if you operate a registered company?',
    options: [
      'A) Driver\'s License',
      'B) Employer Identification Number (EIN)',
      'C) Utility Bill',
      'D) Passport',
    ],
    correctAnswer: 'B',
    explanation: 'If you operate a registered company, you need to provide your Employer Identification Number (EIN).',
  },
  {
    id: 8,
    question: 'Service area coverage depends on which factor?',
    options: [
      'A) Vehicle size',
      'B) Subscription tier',
      'C) How long you\'ve been registered',
      'D) Time of day',
    ],
    correctAnswer: 'B',
    explanation: 'Your subscription tier (Free, Pro, or Premier) determines your service area coverage.',
  },
  {
    id: 9,
    question: 'What are the three subscription tiers available?',
    options: [
      'A) Basic, Advanced, Enterprise',
      'B) Free, Pro, Premier',
      'C) Bronze, Silver, Gold',
      'D) Starter, Standard, Premium',
    ],
    correctAnswer: 'B',
    explanation: 'The three subscription tiers are Free, Pro, and Premier.',
  },
  {
    id: 10,
    question: 'How much does the Pro plan cost monthly?',
    options: ['A) $0', 'B) $5', 'C) $10', 'D) $15'],
    correctAnswer: 'B',
    explanation: 'The Pro plan costs $5 per month or $50 per year.',
  },
  {
    id: 11,
    question: 'True or False: You can upgrade or downgrade your subscription plan at any time.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'You can change your subscription plan anytime to suit your business needs.',
  },
  {
    id: 12,
    question: 'What personal protective equipment (PPE) must be worn on all jobs? (Select all that apply)',
    options: [
      'A) Gloves',
      'B) Closed-toe shoes',
      'C) Safety vest for large jobs',
      'D) Helmet',
    ],
    correctAnswer: 'A, B, C',
    explanation: 'Gloves and closed-toe shoes are required for all jobs. Safety vests are required for large or public-area jobs.',
  },
  {
    id: 13,
    question: 'What should you do if you encounter hazardous materials during a haul?',
    options: [
      'A) Continue the job and dispose normally',
      'B) Stop work and contact Haul.IO support immediately',
      'C) Ignore and transport without notifying',
      'D) Leave items at the customer\'s location',
    ],
    correctAnswer: 'B',
    explanation: 'Do not handle hazardous or illegal materials. Report suspicious items immediately to Haul.IO support.',
  },
  {
    id: 14,
    question: 'True or False: You should report any accidents or incidents to Haul.IO immediately.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'All work-related incidents or accidents must be reported right away for safety and liability purposes.',
  },
  {
    id: 15,
    question: 'How are jobs assigned on Haul.IO?',
    options: [
      'A) Through a bidding process',
      'B) Automatically by the platform based on area and subscription tier',
      'C) By customer selection of hauler',
      'D) First come, first served',
    ],
    correctAnswer: 'B',
    explanation: 'Haul.IO automatically assigns jobs based on your service area and subscription tier—no bidding required.',
  },
  {
    id: 16,
    question: 'What must a hauler do after receiving a job assignment?',
    options: [
      'A) Confirm availability promptly',
      'B) Wait 24 hours to respond',
      'C) Contact multiple customers first',
      'D) Decline to reduce workload',
    ],
    correctAnswer: 'A',
    explanation: 'Accept jobs promptly and confirm your availability to ensure efficient service.',
  },
  {
    id: 17,
    question: 'True or False: You are responsible for completing the job exactly as described and updating the job status regularly.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Haulers must complete jobs as requested and update status regularly for transparency and customer satisfaction.',
  },
  {
    id: 18,
    question: 'What communication channel does Haul.IO require haulers to use for job-related communication?',
    options: [
      'A) Personal phone calls',
      'B) Face-to-face only',
      'C) In-app messaging system',
      'D) Social Media',
    ],
    correctAnswer: 'C',
    explanation: 'All job-related communication must be conducted through the in-app messaging system for record-keeping and professionalism.',
  },
  {
    id: 19,
    question: 'How should a hauler communicate delays or issues to the customer?',
    options: [
      'A) Wait for the customer to ask',
      'B) Notify promptly with clear explanation via app messaging',
      'C) Ignore the problem',
      'D) Message a third party',
    ],
    correctAnswer: 'B',
    explanation: 'Respond promptly and clearly explain any delays or issues through the in-app messaging system.',
  },
  {
    id: 20,
    question: 'True or False: Professionalism is not important as long as the job gets done.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Professionalism is essential in all communications and interactions with customers.',
  },
  {
    id: 21,
    question: 'What types of items are haulers prohibited from removing?',
    options: [
      'A) Household items',
      'B) Hazardous or illegal materials',
      'C) Electronics',
      'D) Furniture',
    ],
    correctAnswer: 'B',
    explanation: 'Haulers are prohibited from handling hazardous or illegal materials and must report suspicious items.',
  },
  {
    id: 22,
    question: 'What is the consequence of violating Haul.IO\'s safety or conduct policies?',
    options: [
      'A) Warning, suspension, or removal from platform',
      'B) Monetary fine',
      'C) No consequence',
      'D) Higher job priority',
    ],
    correctAnswer: 'A',
    explanation: 'Violations can result in warnings, suspension, or removal from the platform to maintain safety and quality standards.',
  },
  {
    id: 23,
    question: 'How many times can a hauler retake the final onboarding quiz if they fail?',
    options: ['A) None', 'B) Unlimited times', 'C) Once', 'D) Twice'],
    correctAnswer: 'B',
    explanation: 'Haulers can retake the quiz as many times as needed to pass and complete onboarding.',
  },
  {
    id: 24,
    question: 'True or False: Passing the final onboarding quiz is required before a hauler\'s account is activated.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'A passing score on the final quiz is mandatory before account activation to ensure understanding of all policies.',
  },
  {
    id: 25,
    question: 'After passing the onboarding quiz, what must a hauler do?',
    options: [
      'A) Start bidding on jobs',
      'B) Simply wait for an invitation',
      'C) Begin receiving job assignments based on subscription and service area',
      'D) No further action needed',
    ],
    correctAnswer: 'C',
    explanation: 'After passing the quiz and completing onboarding, haulers begin receiving automatic job assignments based on their subscription tier and service area.',
  },
];
