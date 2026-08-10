export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/courses", label: "Courses" },
  { href: "/admissions", label: "Admissions" },
  { href: "/gallery", label: "Gallery" },
  { href: "/printing-press", label: "Printing Press" },
  { href: "/online-class", label: "Online Class" },
  { href: "/verification", label: "Verification" },
  { href: "/contact", label: "Contact" },
];

// TODO: Replace with your institute's real, verifiable figures.
export const stats = [
  { label: "Students Trained", value: "[Add figure]" },
  { label: "Professional Courses", value: "[Add figure]" },
  { label: "Success Rate", value: "[Add figure]" },
  { label: "Career Support", value: "[Add figure]" },
];

// TODO: Replace with your institute's real, verifiable figures.
export const aboutStats = [
  { label: "Students Trained", value: "[Add figure]" },
  { label: "Professional Courses", value: "[Add figure]" },
  { label: "Success Rate", value: "[Add figure]" },
  { label: "Placement Support", value: "[Add figure]" },
];

export type Course = {
  slug: string;
  title: string;
  category:
    | "IT & Programming"
    | "Design & Multimedia"
    | "Freelancing"
    | "Digital Marketing"
    | "Microsoft Office"
    | "Trading & Finance"
    | "Personal Development";
  description: string;
  duration: string;
  level: string;
  icon:
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
  /** Path under /public, e.g. "/images/courses/web-designing-developing.jpg" */
  image?: string;
  /** Monthly fee shown in Course Information, e.g. "Rs. 3,000/month" */
  monthlyFee?: string;
  /** Total students who have enrolled in this course to date */
  enrolledStudents?: number;
  /** Students who have successfully completed this course */
  completedStudents?: number;
  /** Average review rating out of 5, e.g. 4.8 */
  rating?: number;
  /** Number of reviews behind the rating above */
  reviewsCount?: number;
  overview: string;
  curriculum: string[];
  /** Optional: curriculum grouped by software/topic, rendered as columns on the course page. Falls back to a flat list from `curriculum` when omitted. */
  curriculumGroups?: { title: string; items: string[] }[];
  projects: string[];
  /** Optional: hands-on practice items grouped by software/topic, rendered as columns on the course page. Falls back to a flat list from `projects` when omitted. */
  practiceGroups?: { title: string; items: string[] }[];
  careers: string[];
};

export const courses: Course[] = [
  {
    slug: "web-designing-developing",
    title: "Website Designing & Developing",
    category: "IT & Programming",
    description: "Build responsive websites & web apps with HTML5, CSS3, JavaScript, React.js, Next.js & Node.js.",
    duration: "3–6 Months",
    level: "Beginner",
    icon: "code",
    image: "/images/courses/web-designing-developing.jpg",
    monthlyFee: "[Add monthly fee]",
    overview:
      "Build responsive, modern websites and web applications using the latest frontend and backend technologies.",
    curriculum: [
      "HTML5", "CSS3", "Bootstrap", "Tailwind CSS", "JavaScript (ES6+)", "TypeScript Basics",
      "React.js", "Next.js", "Node.js", "Express.js", "Firebase", "MongoDB", "MySQL",
      "REST APIs", "Git & GitHub", "Website Deployment", "SEO Basics",
    ],
    curriculumGroups: [
      { title: "Frontend Foundations", items: ["HTML5", "CSS3", "Bootstrap", "Tailwind CSS", "JavaScript (ES6+)", "TypeScript Basics"] },
      { title: "Frontend Frameworks", items: ["React.js", "Next.js", "REST APIs", "Git & GitHub"] },
      { title: "Backend & Deployment", items: ["Node.js", "Express.js", "Firebase", "MongoDB", "MySQL", "Website Deployment", "SEO Basics"] },
    ],
    projects: [
      "Portfolio Website", "Company Website", "Institute Website", "Admin Dashboard",
      "Blog Website", "E-Commerce Website",
    ],
    practiceGroups: [
      { title: "Frontend Projects", items: ["Portfolio Website", "Blog Website"] },
      { title: "Business Websites", items: ["Company Website", "Institute Website"] },
      { title: "Full-Stack Projects", items: ["Admin Dashboard", "E-Commerce Website"] },
    ],
    careers: [
      "Frontend Developer", "Backend Developer", "Full Stack Developer", "Web Designer",
      "React Developer", "Next.js Developer",
    ],
  },
  {
    slug: "mobile-app-designing-developing",
    title: "Mobile App Designing & Developing",
    category: "IT & Programming",
    description: "Design and build Android & cross-platform apps with Figma, Flutter, React Native & Firebase.",
    duration: "3 Months",
    level: "Intermediate",
    icon: "smartphone",
    image: "/images/courses/mobile-app-designing-developing.jpg",
    monthlyFee: "[Add monthly fee]",
    overview: "Learn to design and develop modern Android and cross-platform mobile applications.",
    curriculum: [
      "Mobile UI/UX Design", "Figma", "Flutter", "React Native", "Firebase", "REST APIs",
      "Navigation", "Authentication", "Notifications", "Google Maps Integration", "App Publishing",
    ],
    curriculumGroups: [
      { title: "Design & Planning", items: ["Mobile UI/UX Design", "Figma"] },
      { title: "App Development", items: ["Flutter", "React Native", "Navigation", "Authentication"] },
      { title: "Integrations & Publishing", items: ["Firebase", "REST APIs", "Notifications", "Google Maps Integration", "App Publishing"] },
    ],
    projects: [
      "Business App", "School Management App", "Delivery App", "Attendance App", "E-Commerce App",
    ],
    practiceGroups: [
      { title: "Business Apps", items: ["Business App", "Attendance App"] },
      { title: "Management Systems", items: ["School Management App", "Delivery App"] },
      { title: "E-Commerce", items: ["E-Commerce App"] },
    ],
    careers: [
      "Mobile App Developer", "Flutter Developer", "React Native Developer", "UI/UX Designer",
      "App Tester", "Freelance App Developer",
    ],
  },
  {
    slug: "software-developing",
    title: "Software Designing & Developing",
    category: "IT & Programming",
    description: "Develop desktop & business software using JavaScript, Electron.js, React, Node.js & SQLite.",
    duration: "3 Months",
    level: "Intermediate",
    icon: "terminal",
    image: "/images/courses/software-designing-developing.jpg",
    monthlyFee: "[Add monthly fee]",
    overview: "Develop powerful desktop and business software solutions using modern programming technologies.",
    curriculum: [
      "Programming Fundamentals", "JavaScript", "TypeScript", "Electron.js", "React", "Node.js",
      "SQLite", "Firebase", "APIs", "Authentication", "Software Architecture", "Debugging", "Deployment",
    ],
    curriculumGroups: [
      { title: "Programming Basics", items: ["Programming Fundamentals", "JavaScript", "TypeScript"] },
      { title: "App Development", items: ["Electron.js", "React", "Node.js", "SQLite", "Firebase"] },
      { title: "Architecture & Delivery", items: ["APIs", "Authentication", "Software Architecture", "Debugging", "Deployment"] },
    ],
    projects: [
      "POS System", "Inventory System", "School Management System", "Hospital Management System",
      "CRM Software", "Accounting Software",
    ],
    practiceGroups: [
      { title: "Retail Systems", items: ["POS System", "Inventory System"] },
      { title: "Institutional Systems", items: ["School Management System", "Hospital Management System"] },
      { title: "Business Software", items: ["CRM Software", "Accounting Software"] },
    ],
    careers: [
      "Software Developer", "Desktop Application Developer", "Full Stack Developer",
      "System Developer", "Software Engineer",
    ],
  },
  {
    slug: "graphic-designing",
    title: "Graphic Designing",
    category: "Design & Multimedia",
    description: "Master Photoshop, Illustrator, CorelDRAW & Canva Pro to create logos, branding & print design.",
    duration: "3–6 Months",
    level: "Beginner",
    icon: "palette",
    image: "/images/courses/graphic-designing.jpg",
    monthlyFee: "[Add monthly fee]",
    overview:
      "Become a professional graphic designer by learning industry-standard software and modern design techniques for digital and print media.",
    curriculum: [
      "Design Principles", "Color Theory", "Typography", "Adobe Photoshop", "Adobe Illustrator",
      "CorelDRAW", "Canva Pro", "AI Design Tools", "Branding & Identity", "Print Design",
      "Social Media Design", "UI Design Basics",
    ],
    curriculumGroups: [
      { title: "Design Foundations", items: ["Design Principles", "Color Theory", "Typography"] },
      { title: "Design Software", items: ["Adobe Photoshop", "Adobe Illustrator", "CorelDRAW", "Canva Pro", "AI Design Tools"] },
      { title: "Applied Design", items: ["Branding & Identity", "Print Design", "Social Media Design", "UI Design Basics"] },
    ],
    projects: [
      "Logo Design", "Flyers & Brochures", "Business Cards", "Posters", "Social Media Posts",
      "Product Packaging", "Certificates", "Brand Identity Kit",
    ],
    practiceGroups: [
      { title: "Branding", items: ["Logo Design", "Business Cards", "Brand Identity Kit"] },
      { title: "Print Design", items: ["Flyers & Brochures", "Posters", "Certificates"] },
      { title: "Digital & Packaging", items: ["Social Media Posts", "Product Packaging"] },
    ],
    careers: [
      "Graphic Designer", "Branding Designer", "Social Media Designer", "Print Media Designer",
      "UI Designer", "Freelance Designer",
    ],
  },
  {
    slug: "video-editing",
    title: "Video Editing",
    category: "Design & Multimedia",
    description: "Edit professional videos with Premiere Pro, After Effects, CapCut & DaVinci Resolve.",
    duration: "3 Months",
    level: "Beginner",
    icon: "video",
    image: "/images/courses/video-editing.jpg",
    monthlyFee: "[Add monthly fee]",
    overview: "Learn professional video editing techniques for YouTube, social media, marketing, and commercial productions.",
    curriculum: [
      "Adobe Premiere Pro", "After Effects Basics", "CapCut Professional", "DaVinci Resolve Basics",
      "Motion Graphics", "Color Correction", "Audio Editing", "Green Screen Editing",
      "Cinematic Effects", "YouTube Editing",
    ],
    curriculumGroups: [
      { title: "Editing Software", items: ["Adobe Premiere Pro", "After Effects Basics", "CapCut Professional", "DaVinci Resolve Basics"] },
      { title: "Visual Effects", items: ["Motion Graphics", "Green Screen Editing", "Cinematic Effects"] },
      { title: "Color & Audio", items: ["Color Correction", "Audio Editing", "YouTube Editing"] },
    ],
    projects: [
      "YouTube Videos", "Promotional Ads", "Reels & Shorts", "Wedding Videos",
      "Documentary Editing", "Motion Graphics",
    ],
    practiceGroups: [
      { title: "Social & YouTube", items: ["YouTube Videos", "Reels & Shorts"] },
      { title: "Commercial", items: ["Promotional Ads", "Documentary Editing"] },
      { title: "Events & Effects", items: ["Wedding Videos", "Motion Graphics"] },
    ],
    careers: [
      "Video Editor", "YouTube Editor", "Motion Graphics Designer", "Social Media Editor",
      "Freelance Video Editor",
    ],
  },
  {
    slug: "autocad",
    title: "AutoCAD",
    category: "Design & Multimedia",
    description: "Learn 2D drawing & 3D modeling basics for architecture, civil & mechanical engineering.",
    duration: "3 Months",
    level: "Beginner",
    icon: "ruler",
    image: "/images/courses/autocad.jpg",
    monthlyFee: "[Add monthly fee]",
    overview:
      "Develop professional drafting and technical drawing skills using AutoCAD for architecture, civil engineering, mechanical engineering, and interior design.",
    curriculum: [
      "AutoCAD Interface", "2D Drawing", "3D Modeling Basics", "Floor Plans", "Elevation Design",
      "Sections", "Dimensioning", "Plotting & Printing", "Construction Drawings",
    ],
    curriculumGroups: [
      { title: "Fundamentals", items: ["AutoCAD Interface", "2D Drawing", "3D Modeling Basics"] },
      { title: "Architectural Drawing", items: ["Floor Plans", "Elevation Design", "Sections"] },
      { title: "Documentation", items: ["Dimensioning", "Plotting & Printing", "Construction Drawings"] },
    ],
    projects: [
      "House Plans", "Office Layouts", "Building Elevations", "Mechanical Parts", "Interior Layouts",
    ],
    practiceGroups: [
      { title: "Residential", items: ["House Plans", "Interior Layouts"] },
      { title: "Commercial", items: ["Office Layouts", "Building Elevations"] },
      { title: "Technical", items: ["Mechanical Parts"] },
    ],
    careers: [
      "AutoCAD Draftsman", "CAD Designer", "Civil Draftsman", "Mechanical Draftsman",
      "Architectural Assistant",
    ],
  },
  {
    slug: "social-media-marketing",
    title: "Social Media Marketing",
    category: "Digital Marketing",
    description: "Manage and grow brands on Facebook, Instagram, TikTok & LinkedIn with content strategy.",
    duration: "3 Months",
    level: "Beginner",
    icon: "megaphone",
    image: "/images/courses/social-media-marketing.jpg",
    monthlyFee: "[Add monthly fee]",
    overview:
      "Learn how to manage and grow brands across major social media platforms with effective content and advertising strategies.",
    curriculum: [
      "Facebook Management", "Instagram Management", "TikTok Marketing", "LinkedIn Management",
      "YouTube Channel Management", "Content Planning", "Graphic Design for Social Media",
      "Video Content Strategy", "Social Media Advertising", "Analytics & Reporting", "Community Management",
    ],
    curriculumGroups: [
      { title: "Platform Management", items: ["Facebook Management", "Instagram Management", "TikTok Marketing", "LinkedIn Management", "YouTube Channel Management"] },
      { title: "Content & Strategy", items: ["Content Planning", "Graphic Design for Social Media", "Video Content Strategy"] },
      { title: "Growth & Analytics", items: ["Social Media Advertising", "Analytics & Reporting", "Community Management"] },
    ],
    projects: [
      "Social Media Calendar", "Brand Strategy", "Facebook Campaign", "Instagram Campaign",
      "YouTube Channel Setup", "Content Creation",
    ],
    practiceGroups: [
      { title: "Strategy", items: ["Social Media Calendar", "Brand Strategy"] },
      { title: "Ad Campaigns", items: ["Facebook Campaign", "Instagram Campaign"] },
      { title: "Content", items: ["YouTube Channel Setup", "Content Creation"] },
    ],
    careers: [
      "Social Media Manager", "Content Creator", "Community Manager", "Digital Marketing Executive",
      "Brand Manager", "Freelance Social Media Specialist",
    ],
  },
  {
    slug: "youtube-automation",
    title: "YouTube Automation",
    category: "Digital Marketing",
    description: "Build faceless YouTube channels — idea research, scripting, AI voiceover, editing & monetization.",
    duration: "3 Months",
    level: "Beginner",
    icon: "youtube",
    image: "/images/courses/youtube-automation.jpg",
    monthlyFee: "[Add monthly fee]",
    overview:
      "Learn how to plan, produce and grow faceless/automated YouTube channels from scratch — from niche and idea research to scripting, AI voiceovers, video creation, SEO and monetization.",
    curriculum: [
      "Niche & Idea Research", "Script Writing", "AI Voice Over Tools", "Video Creation & Editing",
      "Thumbnail Design", "YouTube SEO Optimization", "Upload & Scheduling", "YouTube Analytics",
      "Monetization Strategies", "Channel Growth & Automation Tools",
    ],
    curriculumGroups: [
      { title: "Planning & Scripting", items: ["Niche & Idea Research", "Script Writing"] },
      { title: "Production", items: ["AI Voice Over Tools", "Video Creation & Editing", "Thumbnail Design"] },
      { title: "Growth & Monetization", items: ["YouTube SEO Optimization", "Upload & Scheduling", "YouTube Analytics", "Monetization Strategies", "Channel Growth & Automation Tools"] },
    ],
    projects: [
      "Faceless Channel Setup", "Script Library", "AI-Voiced Video", "Thumbnail Pack",
      "SEO-Optimized Upload", "Monetization Plan",
    ],
    practiceGroups: [
      { title: "Setup", items: ["Faceless Channel Setup", "Script Library"] },
      { title: "Production", items: ["AI-Voiced Video", "Thumbnail Pack"] },
      { title: "Growth", items: ["SEO-Optimized Upload", "Monetization Plan"] },
    ],
    careers: [
      "YouTube Automation Specialist", "Faceless Channel Owner", "Content Strategist",
      "YouTube Manager", "Freelance YouTube Consultant",
    ],
  },
  {
    slug: "online-trading",
    title: "Online Trading",
    category: "Trading & Finance",
    description: "Learn Forex, stocks & crypto trading — chart analysis, technicals, risk management & live trading.",
    duration: "3 Months",
    level: "Beginner",
    icon: "line-chart",
    image: "/images/courses/online-trading.jpg",
    monthlyFee: "[Add monthly fee]",
    overview:
      "Get a practical introduction to online trading across Forex, stocks, commodities and crypto — covering chart reading, technical analysis, indicators and disciplined risk management.",
    curriculum: [
      "Trading Fundamentals", "Forex Market Basics", "Candlestick & Chart Patterns",
      "Technical Indicators", "Trend & Trading View Analysis", "Risk & Money Management",
      "Stocks & Commodities", "Crypto Trading Basics", "Trading Psychology", "Live Market Practice",
    ],
    curriculumGroups: [
      { title: "Market Basics", items: ["Trading Fundamentals", "Forex Market Basics", "Stocks & Commodities", "Crypto Trading Basics"] },
      { title: "Technical Analysis", items: ["Candlestick & Chart Patterns", "Technical Indicators", "Trend & Trading View Analysis"] },
      { title: "Risk & Practice", items: ["Risk & Money Management", "Trading Psychology", "Live Market Practice"] },
    ],
    projects: [
      "Demo Trading Account", "Trading Journal", "Chart Analysis Reports", "Risk Management Plan",
    ],
    practiceGroups: [
      { title: "Trading Practice", items: ["Demo Trading Account", "Trading Journal"] },
      { title: "Analysis & Risk", items: ["Chart Analysis Reports", "Risk Management Plan"] },
    ],
    careers: [
      "Independent Trader", "Forex Analyst", "Trading Signal Provider", "Investment Consultant",
    ],
  },
  {
    slug: "spoken-english",
    title: "Spoken English",
    category: "Personal Development",
    description: "Speak confidently — grammar, vocabulary, pronunciation, conversation & interview skills.",
    duration: "3 Months",
    level: "Beginner",
    icon: "languages",
    image: "/images/courses/spoken-english.jpg",
    monthlyFee: "[Add monthly fee]",
    overview:
      "Build the confidence and fluency to speak English naturally in daily life, business and interviews through structured lessons, vocabulary building and guided conversation practice.",
    curriculum: [
      "Basic Grammar", "Vocabulary Building", "Pronunciation Practice", "Daily Conversations",
      "Business English", "Interview Skills", "Listening Practice", "Public Speaking",
      "Confidence Building", "Communication Skills",
    ],
    curriculumGroups: [
      { title: "Language Basics", items: ["Basic Grammar", "Vocabulary Building", "Pronunciation Practice", "Listening Practice"] },
      { title: "Conversation Skills", items: ["Daily Conversations", "Business English", "Communication Skills"] },
      { title: "Confidence & Career", items: ["Interview Skills", "Public Speaking", "Confidence Building"] },
    ],
    projects: [
      "Daily Conversation Practice", "Mock Interviews", "Group Discussions", "Presentation Practice",
    ],
    practiceGroups: [
      { title: "Conversation", items: ["Daily Conversation Practice", "Group Discussions"] },
      { title: "Career Prep", items: ["Mock Interviews", "Presentation Practice"] },
    ],
    careers: [
      "Customer Support Executive", "Receptionist", "Call Center Agent", "Tour Guide",
      "Better Interview & Career Readiness",
    ],
  },
  {
    slug: "ms-office-3-months",
    title: "Microsoft Office (3 Months)",
    category: "Microsoft Office",
    description: "Fast-track Word, Excel, PowerPoint & Outlook essentials for academic & professional use.",
    duration: "3 Months",
    level: "Beginner",
    icon: "layout-grid",
    image: "/images/courses/ms-office-3-months.jpg",
    monthlyFee: "[Add monthly fee]",
    overview:
      "A fast-track program covering the essential Microsoft Office applications used in offices, businesses, educational institutions, and government organizations. Learn to create professional documents, spreadsheets, presentations, and manage emails efficiently.",
    curriculum: [
      "Computer Fundamentals", "Windows Operating System", "Microsoft Word", "Microsoft Excel",
      "Microsoft PowerPoint", "Microsoft Outlook", "Internet & Email", "File Management",
      "Printing & Document Formatting",
    ],
    curriculumGroups: [
      { title: "Computer Basics", items: ["Computer Fundamentals", "Windows Operating System", "Internet & Email", "File Management"] },
      { title: "Microsoft Word", items: ["Document formatting & styles", "Tables & page layout", "Printing & document formatting"] },
      { title: "Microsoft Excel", items: ["Cells, rows & worksheets", "Basic formulas & functions", "Simple data tables"] },
      { title: "Microsoft PowerPoint & Outlook", items: ["Slide design & layouts", "Presentation basics", "Microsoft Outlook & email"] },
    ],
    projects: [
      "Professional Resume", "Office Letters", "Business Reports", "Excel Sheets", "Company Presentations",
    ],
    practiceGroups: [
      { title: "MS Word Practice", items: ["Professional Resume", "Office Letters", "Business Reports"] },
      { title: "MS Excel Practice", items: ["Excel Sheets"] },
      { title: "MS PowerPoint Practice", items: ["Company Presentations"] },
    ],
    careers: [
      "Office Assistant", "Data Entry Operator", "Computer Operator", "Receptionist",
    ],
  },
  {
    slug: "ms-office-6-months",
    title: "Microsoft Office (6 Months)",
    category: "Microsoft Office",
    description: "In-depth Word, Excel, PowerPoint & Outlook mastery with advanced formulas, macros & reporting.",
    duration: "6 Months",
    level: "Beginner to Advanced",
    icon: "layout-grid",
    image: "/images/courses/ms-office-6-months.jpg",
    monthlyFee: "[Add monthly fee]",
    overview:
      "An extended, in-depth program covering Microsoft Word, Excel, PowerPoint and Outlook in greater depth — including advanced Excel formulas, pivot tables, macros, mail merge and professional reporting — for stronger office and administrative careers.",
    curriculum: [
      "Computer Fundamentals", "Windows Operating System", "Microsoft Word (Advanced)",
      "Microsoft Excel (Formulas, Pivot Tables, Macros)", "Microsoft PowerPoint (Advanced)",
      "Microsoft Outlook", "Internet & Email", "File Management", "Mail Merge",
      "Business Report Writing", "Printing & Document Formatting",
    ],
    curriculumGroups: [
      { title: "Computer Basics", items: ["Computer Fundamentals", "Windows Operating System", "Internet & Email", "File Management"] },
      { title: "Microsoft Word (Advanced)", items: ["Advanced formatting & styles", "Mail Merge", "Business Report Writing", "Printing & Document Formatting"] },
      { title: "Microsoft Excel (Advanced)", items: ["Advanced formulas & functions", "Pivot Tables", "Macros"] },
      { title: "Microsoft PowerPoint & Outlook", items: ["Advanced slide design & animation", "Presentation delivery", "Microsoft Outlook & email"] },
    ],
    projects: [
      "Professional Resume", "Office Letters", "Business Reports", "Excel Payroll System",
      "Sales & Inventory Sheets", "Company Presentations", "Automated Excel Dashboard",
    ],
    practiceGroups: [
      { title: "MS Word Practice", items: ["Professional Resume", "Office Letters", "Business Reports"] },
      { title: "MS Excel Practice", items: ["Excel Payroll System", "Sales & Inventory Sheets", "Automated Excel Dashboard"] },
      { title: "MS PowerPoint Practice", items: ["Company Presentations"] },
    ],
    careers: [
      "Office Assistant", "Data Entry Operator", "Computer Operator", "Receptionist",
      "Administrative Officer", "Office Executive",
    ],
  },
  {
    slug: "pgd",
    title: "PGD (Post Graduate Diploma)",
    category: "Microsoft Office",
    description: "An advanced, extended diploma covering IT, office & professional skills for stronger job placement.",
    duration: "1 Year",
    level: "Advanced",
    icon: "graduation-cap",
    image: "/images/courses/pgd.jpg",
    monthlyFee: "[Add monthly fee]",
    overview:
      "A comprehensive Post Graduate Diploma combining computer fundamentals, Microsoft Office, and professional/IT skills into one extended program — designed for graduates who want a stronger, certificate-backed profile for jobs and further study.",
    curriculum: [
      "Computer Fundamentals", "Microsoft Office Suite", "Internet & Email", "Basic Web & IT Skills",
      "Office Communication", "Business Writing", "Presentation Skills", "Career & Interview Preparation",
    ],
    curriculumGroups: [
      { title: "Computer & Office Skills", items: ["Computer Fundamentals", "Microsoft Office Suite", "Internet & Email", "Basic Web & IT Skills"] },
      { title: "Communication", items: ["Office Communication", "Business Writing", "Presentation Skills"] },
      { title: "Career Readiness", items: ["Career & Interview Preparation"] },
    ],
    projects: [
      "Capstone Portfolio", "Business Reports", "Professional Presentations", "Final Project Submission",
    ],
    practiceGroups: [
      { title: "Documentation", items: ["Business Reports", "Final Project Submission"] },
      { title: "Presentation", items: ["Professional Presentations", "Capstone Portfolio"] },
    ],
    careers: [
      "Office Executive", "Administrative Officer", "Data Entry Supervisor", "Computer Operator",
      "Further Higher Education",
    ],
  },
  {
    slug: "freelancing",
    title: "Freelancing",
    category: "Freelancing",
    description: "Learn to earn online via Fiverr, Upwork & LinkedIn with portfolio & proposal writing skills.",
    duration: "3–6 Months",
    level: "Beginner",
    icon: "briefcase",
    image: "/images/courses/freelancing.jpg",
    monthlyFee: "[Add monthly fee]",
    overview:
      "Learn how to earn online by selling your skills on international freelancing platforms and building a successful digital career.",
    curriculum: [
      "Introduction to Freelancing", "Fiverr", "Upwork", "Freelancer.com", "LinkedIn Optimization",
      "Portfolio Creation", "Proposal Writing", "Client Communication", "Project Management",
      "Payment Methods", "Personal Branding",
    ],
    curriculumGroups: [
      { title: "Getting Started", items: ["Introduction to Freelancing", "LinkedIn Optimization", "Personal Branding"] },
      { title: "Platforms", items: ["Fiverr", "Upwork", "Freelancer.com"] },
      { title: "Client Success", items: ["Portfolio Creation", "Proposal Writing", "Client Communication", "Project Management", "Payment Methods"] },
    ],
    projects: [
      "Fiverr Gig Setup", "Professional Portfolio", "LinkedIn Profile", "Proposal Writing", "Client Projects",
    ],
    practiceGroups: [
      { title: "Platform Setup", items: ["Fiverr Gig Setup", "LinkedIn Profile"] },
      { title: "Portfolio & Proposals", items: ["Professional Portfolio", "Proposal Writing"] },
      { title: "Client Work", items: ["Client Projects"] },
    ],
    careers: [
      "Full-Time Freelancer", "Remote Employee", "Virtual Assistant", "Digital Consultant", "Agency Owner",
    ],
  },
];

export const courseHighlights = [
  "Experienced & Professional Instructors",
  "Practical Hands-on Training",
  "Project-Based Learning",
  "Modern Computer Labs",
  "Career Counseling",
  "Freelancing & Job Preparation",
  "Certificate on Successful Completion",
  "Interview Preparation",
  "Portfolio Development",
  "Affordable Fee Structure",
  "Small Class Sizes",
  "Ongoing Student Support",
];

// TODO: Replace with real testimonials from actual FSTI students/graduates.
export const testimonials = [
  {
    name: "[Student Name]",
    role: "[Graduate's course / current job title]",
    quote: "[Add a real quote from this student here.]",
  },
  {
    name: "[Student Name]",
    role: "[Graduate's course / current job title]",
    quote: "[Add a real quote from this student here.]",
  },
  {
    name: "[Student Name]",
    role: "[Graduate's course / current job title]",
    quote: "[Add a real quote from this student here.]",
  },
];

export const contactInfo = {
  phone: "+92300-7640392",
  whatsapp: "+923007640392",
  email: "fstechins@gmail.com",
  address: "Nankana Road Furqan Saeed Printing Press Shahkot",
  hours: "Mon - Sat : 9:00 AM - 6:00 PM",
};

// --- Fees ---
// Global fee settings, editable from /admin/fees. Per-course monthly fees
// live on each course (see the `monthlyFee` field on `Course`, editable from
// /admin/courses) — this covers the one-time admission fee that's the same
// for every course, plus an optional free-text note shown alongside it.
export const feeSettings = {
  admissionFee: "Rs. 1,000",
  feeNote: "Fee is payable in cash at the admin office. Keep your receipt for your records.",
};

// --- Gallery ---
export type GalleryCategory = "Classrooms" | "Labs" | "Events" | "Workshops" | "Achievements";

export const galleryCategories: GalleryCategory[] = [
  "Classrooms",
  "Labs",
  "Events",
  "Workshops",
  "Achievements",
];

export const galleryItems: { id: string; category: GalleryCategory; caption: string }[] = [
  { id: "g1", category: "Classrooms", caption: "Students in a hands-on lab session" },
  { id: "g2", category: "Workshops", caption: "Hardware workshop, hands-on build" },
  { id: "g3", category: "Classrooms", caption: "Student working on a laptop" },
  { id: "g4", category: "Classrooms", caption: "Instructor-led coding session" },
  { id: "g5", category: "Labs", caption: "Graphic design lab session" },
  { id: "g6", category: "Achievements", caption: "Certificate distribution ceremony" },
  { id: "g7", category: "Workshops", caption: "Cyber Security workshop" },
  { id: "g8", category: "Labs", caption: "Students working in the computer lab" },
  { id: "g9", category: "Events", caption: "Group photo outside the institute" },
  { id: "g10", category: "Labs", caption: "Student soldering hardware components" },
  { id: "g11", category: "Labs", caption: "Coding session in the lab" },
  { id: "g12", category: "Achievements", caption: "Annual award ceremony" },
];

// TODO: Replace with your institute's real, verifiable figures.
export const galleryStats = [
  { label: "Students Trained", value: "[Add figure]" },
  { label: "Courses Offered", value: "[Add figure]" },
  { label: "Events Conducted", value: "[Add figure]" },
  { label: "Awards Won", value: "[Add figure]" },
];

// --- Admissions ---
export const admissionProcess = [
  {
    step: 1,
    title: "Fill Out Form",
    desc: "Complete the online admission form with accurate information.",
  },
  {
    step: 2,
    title: "Document Submission",
    desc: "Upload required documents for verification.",
  },
  {
    step: 3,
    title: "Confirmation",
    desc: "Our team will verify your details and confirm your admission.",
  },
  {
    step: 4,
    title: "Start Learning",
    desc: "Get your enrollment number and start your journey with FSTI.",
  },
];

export const requiredDocuments = [
  "CNIC/B-Form (Front & Back)",
  "Recent Passport Size Photo",
  "Educational Certificates",
  "Domicile (If Required)",
];

export const whyChooseFSTI = [
  "Industry-Oriented Courses",
  "Experienced Instructors",
  "Modern Labs & Tools",
  "Career Support & Guidance",
];

export const qualifications = ["Matric", "Intermediate", "Bachelor's", "Master's", "Other"];

export const religions = ["Islam", "Christianity", "Hinduism", "Sikhism", "Other"];

export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Don't Know"];

export const batches = ["Morning Batch", "Evening Batch", "Weekend Batch"];

// --- Online Class ---
export type LiveClass = {
  id: string;
  title: string;
  /** Must match a `slug` in `courses` above — keeps live classes tied to your real course catalog. */
  courseSlug: string;
  instructor: string;
  time: string;
  studentsOnline: number;
};

// TODO: Replace with your real live class schedule, instructors and live viewer counts
// (ideally sourced from Firestore rather than hardcoded here).
export const liveClasses: LiveClass[] = [
  {
    id: "lc1",
    title: "[Class Title]",
    courseSlug: "web-designing-developing",
    instructor: "[Instructor Name]",
    time: "[Start Time] - [End Time]",
    studentsOnline: 0,
  },
  {
    id: "lc2",
    title: "[Class Title]",
    courseSlug: "graphic-designing",
    instructor: "[Instructor Name]",
    time: "[Start Time] - [End Time]",
    studentsOnline: 0,
  },
  {
    id: "lc3",
    title: "[Class Title]",
    courseSlug: "social-media-marketing",
    instructor: "[Instructor Name]",
    time: "[Start Time] - [End Time]",
    studentsOnline: 0,
  },
  {
    id: "lc4",
    title: "[Class Title]",
    courseSlug: "online-trading",
    instructor: "[Instructor Name]",
    time: "[Start Time] - [End Time]",
    studentsOnline: 0,
  },
];

export type RecordedLecture = {
  id: string;
  title: string;
  /** Must match a `slug` in `courses` above — keeps recorded lectures tied to your real course catalog. */
  courseSlug: string;
  instructor: string;
  duration: string;
};

// TODO: Replace with your real recorded lecture library.
export const recordedLectures: RecordedLecture[] = [
  { id: "rl1", title: "[Lecture Title]", courseSlug: "web-designing-developing", instructor: "[Instructor Name]", duration: "[mm:ss]" },
  { id: "rl2", title: "[Lecture Title]", courseSlug: "mobile-app-designing-developing", instructor: "[Instructor Name]", duration: "[mm:ss]" },
  { id: "rl3", title: "[Lecture Title]", courseSlug: "graphic-designing", instructor: "[Instructor Name]", duration: "[mm:ss]" },
  { id: "rl4", title: "[Lecture Title]", courseSlug: "social-media-marketing", instructor: "[Instructor Name]", duration: "[mm:ss]" },
  { id: "rl5", title: "[Lecture Title]", courseSlug: "ms-office-3-months", instructor: "[Instructor Name]", duration: "[mm:ss]" },
];

export const onlineClassFeatures = [
  { title: "Live Classes", desc: "Join real-time classes and interact with instructors." },
  { title: "Recorded Lectures", desc: "Access all recorded lectures anytime, anywhere." },
  { title: "Study Material", desc: "Download notes, slides and important resources." },
  { title: "Assignments", desc: "Submit assignments and track your progress." },
  { title: "Discussion Forum", desc: "Ask questions and discuss with your classmates." },
];

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export type BlogCategory =
  | "Technology"
  | "Cyber Security"
  | "Digital Marketing"
  | "Career Development"
  | "Design"
  | "Institute News";

export type BlogPost = {
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  date: string;
  readTime: string;
};

// TODO: Replace with your real blog articles, or manage these from the admin panel later.
export const blogPosts: BlogPost[] = [
  {
    slug: "5-in-demand-tech-skills-2026",
    title: "5 In-Demand Tech Skills to Learn in 2026",
    category: "Technology",
    excerpt:
      "From web development to AI-assisted design tools, here are the skills employers are actively hiring for this year — and where to start learning them.",
    date: "Jul 28, 2026",
    readTime: "5 min read",
  },
  {
    slug: "protect-business-cyber-threats",
    title: "How to Protect Your Business From Common Cyber Threats",
    category: "Cyber Security",
    excerpt:
      "Phishing emails, weak passwords, and unpatched software cause most small-business breaches. A practical checklist to close the easy gaps first.",
    date: "Jul 21, 2026",
    readTime: "6 min read",
  },
  {
    slug: "social-media-marketing-trends",
    title: "Social Media Marketing Trends Every Small Business Should Know",
    category: "Digital Marketing",
    excerpt:
      "Short-form video, community-first content, and paid ad targeting keep shifting. Here's what's actually moving the needle for local businesses right now.",
    date: "Jul 14, 2026",
    readTime: "4 min read",
  },
  {
    slug: "student-to-professional-portfolio",
    title: "From Student to Professional: Building Your First Portfolio",
    category: "Career Development",
    excerpt:
      "A strong portfolio matters more than a long resume when you're starting out. What to include, what to leave out, and how to present it to employers.",
    date: "Jul 7, 2026",
    readTime: "5 min read",
  },
  {
    slug: "graphic-design-principles-beginners",
    title: "Principles of Good Graphic Design for Beginners",
    category: "Design",
    excerpt:
      "Color, contrast, alignment, and hierarchy — the four fundamentals that instantly make your designs look more professional, explained simply.",
    date: "Jun 30, 2026",
    readTime: "6 min read",
  },
  {
    slug: "fsti-new-batch-enrollment",
    title: "FSTI Announces New Batch Enrollment for MS Office & Web Development",
    category: "Institute News",
    excerpt:
      "Admissions are now open for our upcoming batch. Limited seats, flexible morning and evening timings, and certificates on completion.",
    date: "Jun 23, 2026",
    readTime: "3 min read",
  },
  {
    slug: "spoken-english-job-seekers",
    title: "Why Every Job Seeker Needs Spoken English Skills",
    category: "Career Development",
    excerpt:
      "Strong technical skills can still lose out at interview stage without confident communication. Why spoken English is worth prioritizing early.",
    date: "Jun 16, 2026",
    readTime: "4 min read",
  },
  {
    slug: "ai-tools-for-designers-2026",
    title: "AI Tools Every Designer Should Try in 2026",
    category: "Design",
    excerpt:
      "AI won't replace designers, but it will change your workflow. A look at tools worth adding to your process, and where human judgment still wins.",
    date: "Jun 9, 2026",
    readTime: "5 min read",
  },
];

export const blogCategoryCounts: { label: BlogCategory; count: number }[] = (
  ["Technology", "Cyber Security", "Digital Marketing", "Career Development", "Design", "Institute News"] as BlogCategory[]
).map((label) => ({
  label,
  count: blogPosts.filter((p) => p.category === label).length,
}));

export const popularPosts: BlogPost[] = [
  blogPosts[0],
  blogPosts[3],
  blogPosts[5],
];
