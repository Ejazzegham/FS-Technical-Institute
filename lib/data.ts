

export type CourseCategory =
  | "IT & Programming"
  | "Design & Multimedia"
  | "Freelancing"
  | "Digital Marketing"
  | "Microsoft Office"
  | "Trading & Finance"
  | "Personal Development";

export type CourseIcon =
  | "code"
  | "palette"
  | "trending-up"
  | "layout-grid"
  | "smartphone"
  | "terminal"
  | "video"
  | "ruler"
  | "megaphone"
  | "briefcase"
  | "youtube"
  | "line-chart"
  | "languages"
  | "graduation-cap";

export type Course = {
  slug: string;
  title: string;
  category: CourseCategory;
  icon: CourseIcon;
  overview: string;
  description: string;
  duration: string;
  level: string;
  monthlyFee?: string;
  rating?: number;
  reviewsCount?: number;
  enrolledStudents?: number;
  completedStudents?: number;
  curriculum: string[];
  curriculumGroups?: { title: string; items: string[] }[];
  projects: string[];
  practiceGroups?: { title: string; items: string[] }[];
  careers: string[];
  image?: string;
};

export const courses: Course[] = [
  {
    slug: "web-designing-developing",
    title: "Web Designing & Developing",
    category: "IT & Programming",
    icon: "code",
    overview:
      "Learn to design and build modern, responsive websites from scratch — from HTML/CSS fundamentals to interactive front-end development and basic back-end integration.",
    description:
      "A hands-on web development course covering HTML5, CSS3, JavaScript, responsive design, and modern front-end frameworks.",
    duration: "6 Months",
    level: "Beginner to Advanced",
    monthlyFee: "Rs. 3,500",
    curriculum: [
      "HTML5 & Semantic Markup",
      "CSS3, Flexbox & Grid",
      "JavaScript (ES6+) Fundamentals",
      "Responsive & Mobile-First Design",
      "Bootstrap & Tailwind CSS",
      "React.js Fundamentals",
      "Node.js & Express Basics",
      "Working with MySQL & MongoDB",
      "Git & GitHub Version Control",
      "Deploying Websites (Vercel/Netlify)",
    ],
    projects: [
      "Personal Portfolio Website",
      "Restaurant Ordering Website",
      "E-Commerce Storefront",
      "Blog Platform with Admin Panel",
    ],
    careers: ["Front-End Developer", "Full-Stack Developer", "WordPress Developer", "Freelance Web Developer"],
    image: "/images/courses/web-designing-developing.jpg",
  },
  {
    slug: "software-designing-developing",
    title: "Software Designing & Developing",
    category: "IT & Programming",
    icon: "terminal",
    overview:
      "Build a strong foundation in programming and software engineering — from C/C++ fundamentals through data structures, databases, and real desktop applications.",
    description:
      "A programming-focused course covering C/C++, object-oriented programming, data structures, and database-driven software projects.",
    duration: "6 Months",
    level: "Beginner to Advanced",
    monthlyFee: "Rs. 3,500",
    curriculum: [
      "C Programming Fundamentals",
      "Object-Oriented Programming in C++",
      "Data Structures & Algorithms",
      "Python Programming",
      "Database Design with SQL",
      "Software Development Life Cycle",
      "Version Control with Git",
      "Introduction to Java",
      "Desktop Application Development",
      "Debugging & Software Testing",
    ],
    projects: [
      "Inventory Management System",
      "Student Result Management System",
      "Library Management System",
      "Simple Point-of-Sale Application",
    ],
    careers: ["Software Developer", "Desktop Application Developer", "Junior Programmer", "QA / Test Engineer"],
    image: "/images/courses/software-designing-developing.jpg",
  },
  {
    slug: "graphic-designing",
    title: "Graphic Designing",
    category: "Design & Multimedia",
    icon: "palette",
    overview:
      "Master the tools and principles behind professional design work — from brand identity and logos to social media graphics and print materials.",
    description:
      "A creative design course covering Adobe Photoshop, Illustrator and InDesign, brand identity, and print & digital design.",
    duration: "4 Months",
    level: "Beginner Friendly",
    monthlyFee: "Rs. 3,000",
    curriculum: [
      "Design Principles: Color, Layout & Typography",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Adobe InDesign",
      "Logo & Brand Identity Design",
      "Social Media Post Design",
      "Print Design: Brochures, Flyers & Business Cards",
      "Packaging Design Basics",
    ],
    projects: [
      "Complete Brand Identity Package",
      "Social Media Campaign Kit",
      "Magazine Layout Design",
      "Product Packaging Mockup",
    ],
    careers: ["Graphic Designer", "Brand Identity Designer", "Freelance Designer", "Print & Packaging Designer"],
    image: "/images/courses/graphic-designing.jpg",
  },
  {
    slug: "mobile-app-designing-developing",
    title: "Mobile App Designing & Developing",
    category: "IT & Programming",
    icon: "smartphone",
    overview:
      "Design and build real Android apps — from UI/UX fundamentals through Flutter development, API integration, and publishing to the Play Store.",
    description:
      "A mobile development course covering UI/UX for mobile, Flutter & Dart, Firebase integration, and publishing apps to the Play Store.",
    duration: "5 Months",
    level: "Intermediate",
    monthlyFee: "Rs. 3,500",
    curriculum: [
      "UI/UX Fundamentals for Mobile Apps",
      "Java & Kotlin Basics",
      "Android Studio Essentials",
      "Flutter & Dart",
      "REST API Integration",
      "Firebase for Mobile Apps",
      "App Testing & Debugging",
      "Publishing to the Google Play Store",
    ],
    projects: [
      "To-Do List App",
      "Weather Forecast App",
      "E-Commerce Shopping App",
      "Chat Application with Firebase",
    ],
    careers: ["Android Developer", "Flutter Developer", "Mobile UI/UX Designer", "Freelance App Developer"],
    image: "/images/courses/mobile-app-designing-developing.jpg",
  },
  {
    slug: "video-editing",
    title: "Video Editing",
    category: "Design & Multimedia",
    icon: "video",
    overview:
      "Learn professional video editing and motion graphics — cutting, color grading, sound design, and effects for YouTube, social media and corporate video.",
    description:
      "A video editing course covering Adobe Premiere Pro, After Effects motion graphics, color grading, and sound design.",
    duration: "3 Months",
    level: "Beginner Friendly",
    monthlyFee: "Rs. 2,500",
    curriculum: [
      "Adobe Premiere Pro Basics",
      "Color Grading & Correction",
      "Adobe After Effects Motion Graphics",
      "Audio Editing & Sound Design",
      "Transitions & Visual Effects",
      "YouTube Video Editing Workflow",
      "Exporting for Social Media Platforms",
    ],
    projects: [
      "Short Film Edit",
      "YouTube Vlog Edit",
      "Corporate Promo Video",
      "Reels / TikTok Style Edit Pack",
    ],
    careers: ["Video Editor", "Motion Graphics Artist", "YouTube Content Editor", "Freelance Video Editor"],
    image: "/images/courses/video-editing.jpg",
  },
  {
    slug: "autocad",
    title: "AutoCAD",
    category: "Design & Multimedia",
    icon: "ruler",
    overview:
      "Learn professional 2D drafting and 3D modeling with AutoCAD — from drawing tools and dimensioning to architectural floor plans.",
    description:
      "A CAD drafting course covering 2D drafting, dimensioning, layers & blocks, and 3D modeling fundamentals in AutoCAD.",
    duration: "3 Months",
    level: "Beginner Friendly",
    monthlyFee: "Rs. 2,800",
    curriculum: [
      "AutoCAD Interface & Drawing Tools",
      "2D Drafting Fundamentals",
      "Dimensioning & Annotation",
      "Layers & Blocks",
      "Architectural Floor Plans",
      "3D Modeling Basics",
      "Plotting & Printing Drawings",
    ],
    projects: [
      "Residential Floor Plan",
      "Site Layout Plan",
      "Furniture Layout Drawing",
      "3D Building Model",
    ],
    careers: ["AutoCAD Draftsman", "Architectural Drafter", "Civil Design Assistant", "CAD Technician"],
    image: "/images/courses/autocad.jpg",
  },
  {
    slug: "social-media-marketing",
    title: "Social Media Marketing",
    category: "Digital Marketing",
    icon: "megaphone",
    overview:
      "Learn to plan, run and measure paid and organic campaigns across Facebook, Instagram and Google — a practical, results-driven digital marketing course.",
    description:
      "A digital marketing course covering Facebook & Instagram Ads, SEO basics, Google Ads, and analytics & reporting.",
    duration: "3 Months",
    level: "Beginner Friendly",
    monthlyFee: "Rs. 3,000",
    curriculum: [
      "Digital Marketing Fundamentals",
      "Facebook & Instagram Ads Manager",
      "Content Strategy & Calendar Planning",
      "SEO Basics",
      "Google Ads Fundamentals",
      "Analytics & Reporting",
      "Influencer & Community Management",
    ],
    projects: [
      "Live Ad Campaign for a Local Business",
      "Content Calendar for a Brand",
      "SEO Audit Report",
      "Social Media Growth Case Study",
    ],
    careers: ["Social Media Manager", "Digital Marketing Executive", "Paid Ads Specialist", "Freelance Marketer"],
    image: "/images/courses/social-media-marketing.jpg",
  },
  {
    slug: "youtube-automation",
    title: "YouTube Automation",
    category: "Digital Marketing",
    icon: "youtube",
    overview:
      "Learn how faceless YouTube channels are researched, scripted, produced and monetized — a practical, project-based automation workflow.",
    description:
      "A YouTube automation course covering niche research, scripting, AI voiceover tools, SEO, and monetization.",
    duration: "2 Months",
    level: "Beginner Friendly",
    monthlyFee: "Rs. 2,800",
    curriculum: [
      "Niche Research & Channel Planning",
      "Scriptwriting for Faceless Channels",
      "AI Voiceover & Stock Footage Tools",
      "Thumbnail Design",
      "YouTube SEO & Keyword Research",
      "Monetization & AdSense Setup",
      "Channel Analytics & Growth Strategy",
    ],
    projects: [
      "Faceless Channel Launch Plan",
      "3 Published Sample Videos",
      "Thumbnail A/B Test",
      "Monetization Application Walkthrough",
    ],
    careers: [
      "YouTube Channel Manager",
      "Content Automation Specialist",
      "Freelance YouTube Consultant",
      "Faceless Channel Owner",
    ],
    image: "/images/courses/youtube-automation.jpg",
  },
  {
    slug: "online-trading",
    title: "Online Trading",
    category: "Trading & Finance",
    icon: "line-chart",
    overview:
      "Understand how financial markets work and build a disciplined trading strategy — covering technical analysis, risk management and trading platforms.",
    description:
      "A trading & finance course covering forex and stock market basics, technical analysis, and risk management.",
    duration: "2 Months",
    level: "Beginner Friendly",
    monthlyFee: "Rs. 3,000",
    curriculum: [
      "Financial Markets Overview",
      "Forex & Stock Market Basics",
      "Technical Analysis & Chart Patterns",
      "Risk & Money Management",
      "Trading Platforms (MetaTrader)",
      "Fundamental Analysis",
      "Building a Trading Strategy",
    ],
    projects: [
      "Demo Trading Account Practice",
      "Trading Journal & Strategy Report",
      "Market Analysis Presentation",
    ],
    careers: ["Independent Trader", "Trading Analyst", "Financial Markets Consultant", "Investment Research Assistant"],
    image: "/images/courses/online-trading.jpg",
  },
  {
    slug: "freelancing",
    title: "Freelancing",
    category: "Freelancing",
    icon: "briefcase",
    overview:
      "Turn any skill into a source of income online — build a winning profile, write proposals that get hired, and get paid internationally.",
    description:
      "A freelancing course covering Fiverr & Upwork profile setup, proposal writing, client communication, and international payments.",
    duration: "2 Months",
    level: "Beginner Friendly",
    monthlyFee: "Rs. 2,500",
    curriculum: [
      "Choosing a Freelance Niche",
      "Building a Winning Portfolio",
      "Fiverr & Upwork Profile Optimization",
      "Writing Winning Proposals",
      "Client Communication & Negotiation",
      "International Payments (Payoneer / Wise)",
      "Time Management & Scaling a Freelance Career",
    ],
    projects: ["Freelance Profile Setup", "Sample Proposal Portfolio", "First Gig / Order Simulation"],
    careers: ["Freelance Professional", "Virtual Assistant", "Remote Contractor", "Online Service Provider"],
    image: "/images/courses/freelancing.jpg",
  },
  {
    slug: "ms-office-3-months",
    title: "MS Office (3 Months)",
    category: "Microsoft Office",
    icon: "layout-grid",
    overview:
      "A fast-paced introduction to MS Word, Excel and PowerPoint — the core computer skills needed for almost any office job.",
    description:
      "A 3-month Microsoft Office course covering MS Word, Excel and PowerPoint fundamentals.",
    duration: "3 Months",
    level: "Beginner Friendly",
    monthlyFee: "Rs. 2,000",
    curriculum: [
      "1. MS Word",
      "Formatting & Styles",
      "Tables & Mail Merge",
      "Templates & Reports",
      "2. MS Excel",
      "Formulas & Functions",
      "Charts & Pivot Tables",
      "Data Sorting & Filtering",
      "3. MS PowerPoint",
      "Slide Design & Themes",
      "Animations & Transitions",
      "Presentation Delivery Skills",
    ],
    projects: [
      "MS Word Projects",
      "Formal Business Letter",
      "Resume & Cover Letter",
      "MS Excel Projects",
      "Monthly Budget Sheet",
      "Sales Report with Charts",
      "MS PowerPoint Projects",
      "Company Profile Presentation",
    ],
    careers: ["Office Assistant", "Data Entry Operator", "Admin Coordinator", "Computer Operator"],
    image: "/images/courses/ms-office-3-months.jpg",
  },
  {
    slug: "ms-office-6-months",
    title: "MS Office (6 Months)",
    category: "Microsoft Office",
    icon: "layout-grid",
    overview:
      "An in-depth Microsoft Office program covering Word, Excel, PowerPoint, Access and Outlook — for students who want complete, job-ready office skills.",
    description:
      "A 6-month Microsoft Office course covering MS Word, Excel, PowerPoint, Access, Outlook and general internet/email skills.",
    duration: "6 Months",
    level: "Beginner to Intermediate",
    monthlyFee: "Rs. 2,500",
    curriculum: [
      "1. MS Word",
      "Formatting & Styles",
      "Tables & Mail Merge",
      "Templates & Long Documents",
      "2. MS Excel",
      "Formulas & Functions",
      "VLOOKUP & HLOOKUP",
      "Pivot Tables & Macros",
      "Charts & Dashboards",
      "3. MS PowerPoint",
      "Slide Design & Themes",
      "Animations & Transitions",
      "Presentation Delivery Skills",
      "4. MS Access",
      "Database Basics",
      "Tables & Queries",
      "Forms & Reports",
      "5. Internet & Email",
      "Browsing & Research Skills",
      "Professional Email Etiquette",
      "MS Outlook Setup",
    ],
    projects: [
      "MS Word Projects",
      "Formal Business Letter",
      "Resume & Cover Letter",
      "MS Excel Projects",
      "Monthly Budget Sheet",
      "Sales Report with Charts",
      "MS PowerPoint Projects",
      "Company Profile Presentation",
      "MS Access Projects",
      "Student Database",
      "Inventory Database",
    ],
    careers: ["Office Manager", "Executive Assistant", "Data Entry Analyst", "Admin Officer"],
    image: "/images/courses/ms-office-6-months.jpg",
  },
  {
    slug: "spoken-english",
    title: "Spoken English",
    category: "Personal Development",
    icon: "languages",
    overview:
      "Build the confidence and vocabulary to speak English fluently — for interviews, the workplace, and everyday conversation.",
    description:
      "A spoken English course covering grammar, vocabulary, pronunciation, and interview & workplace communication.",
    duration: "2 Months",
    level: "Beginner Friendly",
    monthlyFee: "Rs. 2,000",
    curriculum: [
      "Basic Grammar & Sentence Structure",
      "Vocabulary Building",
      "Everyday Conversation Practice",
      "Pronunciation & Accent Training",
      "Public Speaking & Confidence Building",
      "Interview & Workplace English",
      "Presentation Skills",
    ],
    projects: ["Group Discussion Sessions", "Mock Job Interview", "Final Presentation"],
    careers: [
      "Stronger Job Interview Performance",
      "Customer Service Roles",
      "Call Center Representative",
      "General Career Readiness",
    ],
    image: "/images/courses/spoken-english.jpg",
  },
  {
    slug: "pgd",
    title: "Post Graduate Diploma in IT",
    category: "IT & Programming",
    icon: "graduation-cap",
    overview:
      "A comprehensive, all-in-one IT program combining office applications, web development, programming and databases — ideal for graduates who want a complete, job-ready skillset.",
    description:
      "A 12-month combined IT diploma covering MS Office, web development, programming fundamentals, and databases.",
    duration: "12 Months",
    level: "Beginner to Advanced",
    monthlyFee: "Rs. 4,000",
    curriculum: [
      "Computer Fundamentals & Operating Systems",
      "MS Office Suite",
      "Web Designing & Developing (HTML, CSS, JS)",
      "Programming Fundamentals (C/C++)",
      "Database Management with SQL",
      "Graphic Designing Basics",
      "Networking Fundamentals",
      "Final Capstone Project",
    ],
    projects: ["Personal Portfolio Website", "Database-Driven Mini Project", "Capstone IT Project"],
    careers: ["IT Support Officer", "Junior Web Developer", "Computer Operator", "Office Automation Specialist"],
    image: "/images/courses/pgd.jpg",
  },
];

// Bullet points shown in the "Why Choose FSTI?" panel on every course page.
export const courseHighlights: string[] = [
  "Experienced & Certified Instructors",
  "Hands-On, Project-Based Learning",
  "Modern, Fully-Equipped Computer Labs",
  "Flexible Morning, Evening & Weekend Batches",
  "Recognized Certificate on Completion",
  "Job Placement & Freelancing Guidance",
  "Affordable Fee with Easy Installment Plans",
  "Small Batch Sizes for Personal Attention",
];

// ---------------------------------------------------------------------------
// Testimonials & Stats
// ---------------------------------------------------------------------------

export const testimonials: { name: string; role: string; quote: string }[] = [
  {
    name: "Ayesha Khan",
    role: "Web Designing & Developing Graduate",
    quote:
      "The hands-on projects gave me a real portfolio before I even finished the course. I landed a junior developer role within weeks of graduating from FSTI.",
  },
  {
    name: "Bilal Ahmed",
    role: "Graphic Designing Graduate",
    quote:
      "The instructors were patient and genuinely invested in our growth. I now freelance full-time using the skills I picked up here.",
  },
  {
    name: "Sana Malik",
    role: "MS Office Graduate",
    quote:
      "I had almost no computer experience before joining. The step-by-step teaching style made everything easy to follow, and I got an office job right after.",
  },
  {
    name: "Hamza Farooq",
    role: "Mobile App Designing & Developing Graduate",
    quote:
      "Building real apps from day one made all the difference. The final project became the centerpiece of my portfolio.",
  },
];

export const stats: { label: string; value: string }[] = [
  { label: "Years of Excellence", value: "10+" },
  { label: "Courses Offered", value: "14+" },
  { label: "Students Trained", value: "3,000+" },
  { label: "Expert Instructors", value: "15+" },
];

export const aboutStats: { label: string; value: string }[] = [
  { label: "Students Enrolled", value: "3,000+" },
  { label: "Courses Available", value: "14+" },
  { label: "Certified Instructors", value: "15+" },
  { label: "Years of Experience", value: "10+" },
];

export const galleryStats: { label: string; value: string }[] = [
  { label: "Classrooms", value: "6" },
  { label: "Computer Labs", value: "3" },
  { label: "Events Hosted", value: "40+" },
  { label: "Graduating Batches", value: "25+" },
];

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

export type GalleryCategory = "Classrooms" | "Labs" | "Events" | "Workshops" | "Achievements";

export const galleryCategories: GalleryCategory[] = ["Classrooms", "Labs", "Events", "Workshops", "Achievements"];

export const galleryItems: { id: string; category: GalleryCategory; caption: string; imageUrl?: string }[] = [
  { id: "g1", category: "Classrooms", caption: "Web Development classroom in session" },
  { id: "g2", category: "Labs", caption: "Students practicing in the computer lab" },
  { id: "g3", category: "Events", caption: "Annual certificate distribution ceremony" },
  { id: "g4", category: "Workshops", caption: "Graphic design weekend workshop" },
  { id: "g5", category: "Achievements", caption: "Top graduates of the Spring batch" },
  { id: "g6", category: "Classrooms", caption: "MS Office class for beginners" },
  { id: "g7", category: "Labs", caption: "AutoCAD lab session" },
  { id: "g8", category: "Events", caption: "Orientation day for new students" },
];

// ---------------------------------------------------------------------------
// Online Class — live classes & recorded lectures
// ---------------------------------------------------------------------------

export type LiveClass = {
  id: string;
  courseSlug: string;
  title: string;
  instructor: string;
  time: string;
  studentsOnline: number;
};

export const liveClasses: LiveClass[] = [
  {
    id: "lc1",
    courseSlug: "web-designing-developing",
    title: "JavaScript Fundamentals — Live Session",
    instructor: "Ali Raza",
    time: "6:00 PM - 7:30 PM",
    studentsOnline: 24,
  },
  {
    id: "lc2",
    courseSlug: "graphic-designing",
    title: "Adobe Illustrator Deep Dive",
    instructor: "Hina Shah",
    time: "4:00 PM - 5:30 PM",
    studentsOnline: 18,
  },
  {
    id: "lc3",
    courseSlug: "mobile-app-designing-developing",
    title: "Flutter UI Basics",
    instructor: "Usman Tariq",
    time: "7:00 PM - 8:30 PM",
    studentsOnline: 12,
  },
];

export type RecordedLecture = {
  id: string;
  courseSlug: string;
  title: string;
  instructor: string;
  duration: string;
};

export const recordedLectures: RecordedLecture[] = [
  { id: "rl1", courseSlug: "web-designing-developing", title: "Introduction to HTML & CSS", instructor: "Ali Raza", duration: "38 min" },
  { id: "rl2", courseSlug: "web-designing-developing", title: "JavaScript DOM Manipulation", instructor: "Ali Raza", duration: "42 min" },
  { id: "rl3", courseSlug: "graphic-designing", title: "Logo Design Workflow in Illustrator", instructor: "Hina Shah", duration: "35 min" },
  { id: "rl4", courseSlug: "mobile-app-designing-developing", title: "Building Your First Flutter App", instructor: "Usman Tariq", duration: "50 min" },
  { id: "rl5", courseSlug: "software-designing-developing", title: "Intro to Data Structures", instructor: "Fahad Iqbal", duration: "40 min" },
  { id: "rl6", courseSlug: "social-media-marketing", title: "Setting Up Facebook Ads Manager", instructor: "Mariam Yousaf", duration: "30 min" },
];

export const onlineClassFeatures: { title: string; desc: string }[] = [
  { title: "Live Interactive Classes", desc: "Join real-time sessions with instructors and ask questions as you learn." },
  { title: "Downloadable Notes", desc: "Access lecture notes and resources anytime from the student portal." },
  { title: "Recorded Lectures", desc: "Missed a class? Catch up anytime with full recordings of every session." },
  { title: "Assignments & Quizzes", desc: "Practice what you learn with regular assignments and quick quizzes." },
  { title: "Instructor Support", desc: "Get your questions answered directly by instructors between classes." },
];

// ---------------------------------------------------------------------------
// Admin reference: software used for recording lectures & running online
// classes. Purely an internal reference list shown in the admin panel (not
// on the public site) — edit or add to it from /admin/software.
// ---------------------------------------------------------------------------

export type SoftwareTool = {
  id: string;
  name: string;
  category: "Live Classes" | "Recording Lectures" | "Both";
  purpose: string;
  website?: string;
};

export const softwareTools: SoftwareTool[] = [
  { id: "sw1", name: "Zoom", category: "Live Classes", purpose: "Hosting live interactive class sessions with students.", website: "https://zoom.us" },
  { id: "sw2", name: "Google Meet", category: "Live Classes", purpose: "Backup / lightweight option for live classes, no download needed.", website: "https://meet.google.com" },
  { id: "sw3", name: "Microsoft Teams", category: "Live Classes", purpose: "Live sessions with built-in chat and file sharing.", website: "https://www.microsoft.com/microsoft-teams" },
  { id: "sw4", name: "OBS Studio", category: "Recording Lectures", purpose: "Free screen + webcam recording and live streaming for lecture videos.", website: "https://obsproject.com" },
  { id: "sw5", name: "Camtasia", category: "Recording Lectures", purpose: "Screen recording with built-in editing for polished lecture videos.", website: "https://www.techsmith.com/camtasia" },
  { id: "sw6", name: "Loom", category: "Recording Lectures", purpose: "Quick screen + webcam recordings, auto-uploaded and easy to share.", website: "https://www.loom.com" },
  { id: "sw7", name: "HandBrake", category: "Recording Lectures", purpose: "Compressing recorded lecture videos before uploading to the site.", website: "https://handbrake.fr" },
  { id: "sw8", name: "DaVinci Resolve", category: "Recording Lectures", purpose: "Editing and trimming recorded lectures before publishing.", website: "https://www.blackmagicdesign.com/products/davinciresolve" },
  { id: "sw9", name: "VLC Media Player", category: "Both", purpose: "Previewing/checking recordings and stream test playback.", website: "https://www.videolan.org" },
  { id: "sw10", name: "Google Drive", category: "Both", purpose: "Storing and sharing lecture recordings and class materials with staff.", website: "https://drive.google.com" },
  { id: "sw11", name: "WhatsApp", category: "Both", purpose: "Sending class links and quick reminders to students/instructors.", website: "https://www.whatsapp.com" },
];

// ---------------------------------------------------------------------------
// Site settings — contact info & fees
// ---------------------------------------------------------------------------

// TODO: replace with your institute's real contact details, or edit from
// /admin/settings once Firestore is configured.
export const contactInfo = {
  phone: "+92 300 1234567",
  whatsapp: "923001234567",
  email: "info@fsti.edu.pk",
  address: "Main Bazaar Road, Pakistan",
  hours: "Mon - Sat: 9:00 AM - 8:00 PM",
};

export const feeSettings = {
  admissionFee: "Rs. 1,000",
  feeNote: "Fee once paid is non-refundable. Contact the office for installment options.",
};

// ---------------------------------------------------------------------------
// Admissions
// ---------------------------------------------------------------------------

export const admissionProcess: { step: number; title: string; desc: string }[] = [
  { step: 1, title: "Choose Your Course", desc: "Browse our course catalog and pick the program that matches your career goals." },
  { step: 2, title: "Fill the Admission Form", desc: "Complete the online admission form with your personal and academic details." },
  { step: 3, title: "Submit Documents & Fee", desc: "Upload the required documents and pay the one-time admission fee." },
  { step: 4, title: "Start Learning", desc: "Get your enrollment number, receive your batch schedule, and begin classes." },
];

export const requiredDocuments: string[] = [
  "CNIC / B-Form (Original + Copy)",
  "2 Passport Size Photographs",
  "Highest Qualification Certificate",
  "Proof of Residence",
];

export const batches: string[] = [
  "Morning (9:00 AM - 12:00 PM)",
  "Afternoon (12:00 PM - 3:00 PM)",
  "Evening (4:00 PM - 7:00 PM)",
  "Weekend Batch",
];

export const qualifications: string[] = ["Under Matric", "Matric", "Intermediate", "Bachelor's", "Master's", "Other"];

export const religions: string[] = ["Islam", "Christianity", "Hinduism", "Sikhism", "Other"];

export const bloodGroups: string[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export const navLinks: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/courses", label: "Courses" },
  { href: "/online-class", label: "Online Class" },
  { href: "/printing-press", label: "Printing Press" },
  { href: "/gallery", label: "Gallery" },
  { href: "/admissions", label: "Admissions" },
  { href: "/verification", label: "Verification" },
  { href: "/contact", label: "Contact" },
];