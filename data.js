// ============================================================
// ALL SITE CONTENT LIVES IN THIS FILE. Edit here, save, refresh.
// Only put facts here that are true and that you can back up.
// The chatbot answers ONLY from what is written in this file.
// ============================================================

export const LINKS = {
  email: "zaeemjamil786@gmail.com",
  github: "https://github.com/zaeemjamil",
  linkedin: "https://www.linkedin.com/in/muhammadzaeemjamil/",
  fiverr: "https://www.fiverr.com/zaeemjamil/",
  resume: "/resume/zaeem-jamil-resume.pdf", // put your PDF at resume/zaeem-jamil-resume.pdf
};

export const PROFILE = {
  name: "Muhammad Zaeem Jamil",
  shortName: "Zaeem Jamil",
  title: "Data Analyst | ML Engineer",
  location: "Gujranwala, Pakistan",
  intro:
    "I study statistics and build practical data projects. I use Python, Excel and MySQL to clean data, test hypotheses and turn findings into clear, useful outputs.",
  // Exactly 2 short paragraphs: what he does, then what tools/methods he uses. Education/experience live in the
  // badge and the Experience ledger already, so they're not repeated here — built only from facts already in this file.
  about: [
    "I'm a Data Analyst studying BS Statistics, focused on turning real datasets into clear analytical insights.",
    "My work uses Python, Excel, MySQL and statistical methods for data cleaning, analysis, hypothesis testing, visualization and machine learning.",
  ],
  education: { degree: "BS Statistics", school: "University of the Punjab", years: "2024–2028", note: "In progress" },
  languages: ["Urdu (native)", "English (conversational)"],
  focus: ["Data Analysis", "Statistics", "Machine Learning", "Python"],
  skills: {
    "Data Analysis": ["Excel", "Power Query", "Data Cleaning", "EDA", "Data Visualization"],
    Statistics: ["Descriptive Statistics", "Hypothesis Testing", "Correlation Analysis", "Regression"],
    Programming: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "SciPy"],
    Databases: ["MySQL"],
    "Machine Learning": ["Machine Learning", "Linear Regression", "Model Evaluation", "Train/Test Split", "LLMs"],
    Tools: ["GitHub", "Jupyter Notebook", "n8n", "OpenRouter"],
  },
  process: [
    { n: "01", t: "Understand", d: "Understand the business question, dataset, objective, and constraints." },
    { n: "02", t: "Prepare", d: "Clean, validate, structure, and prepare the data." },
    { n: "03", t: "Analyze", d: "Apply statistical analysis, exploratory analysis, and machine learning where appropriate." },
    { n: "04", t: "Communicate", d: "Turn findings into clear visualizations, conclusions, and useful outputs." },
  ],
  // Experience: newest first. Source: your CV (MUHAMMAD_ZAEEM_JAMIL_CV__2_.pdf) — Dev Valley and KPMG are the only
  // employers it lists, so those are the only two used here. Wording is a faithful summary of the CV's bullet points.
  experience: [
    { mark: "KP", role: "Data Analyst Intern", org: "KPMG", place: "Remote, Australia", period: "Dec 2025 – Feb 2026", summary: "Cleaned and transformed raw datasets into structured formats, ran end-to-end analysis to identify gaps, interpreted results using statistical techniques, and developed dashboards and data visualizations.", tools: [] },
    { mark: "DV", role: "Data Analyst Intern", org: "Dev Valley Software House", place: "Gujranwala, Pakistan", period: "Oct 2024 – Dec 2024", summary: "Used Excel to generate reports and graphs from complex datasets, wrote SQL queries to extract data from multiple sources, and created visualizations for management review.", tools: ["Excel", "SQL"] },
  ],
};

// ---------- PROJECTS ----------
// To add a project: copy one object below, paste it at the end, change the text.
// Leave a field as "" or [] if you don't have it: that section is simply hidden.
export const PROJECTS = [
  {
    title: "StatFlow AI — Automated Statistical & Machine Learning Analysis",
    slug: "statflow-ai",
    categories: ["Python", "Statistics", "Machine Learning", "Automation"],
    description:
      "An n8n workflow that turns an uploaded CSV into a statistical and machine learning report with AI-written interpretation, a PDF, and a shareable link.",
    image: "", // e.g. "/projects/statflow-ai.png". Empty = clean placeholder (not a screenshot)
    placeholder: ["Upload CSV", "Statistics + ML", "AI interpretation", "PDF report"],
    gallery: [], // extra screenshots: ["/projects/a.png", "/projects/b.png"]
    tools: ["n8n", "Python", "OpenRouter", "HTML/CSS", "PDFPipe", "Google Drive"],
    githubUrl: "https://github.com/zaeemjamil/statflow-ai",
    liveUrl: "https://zaeemjamil.app.n8n.cloud/form/31aac902-c6d2-4b42-8d81-6a739b009891",
    caseStudyUrl: "",
    featured: true,
    overview:
      "Users upload a dataset through an n8n form. The workflow prepares the data, runs statistical analysis and a regression model, asks an AI model to interpret the calculated results, and delivers a formatted PDF report through a Google Drive link.",
    problem: "",
    approach: [
      "Basic preprocessing: duplicate detection, missing-value filtering, numeric data preparation.",
      "Descriptive statistics (count, mean, median, standard deviation, min, max) and correlations.",
      "Multiple Linear Regression with an 80/20 train-test split, implemented with custom Python matrix operations (no scikit-learn).",
      "OpenRouter interprets only the calculated results; the prompt tells it not to invent numbers.",
      "Results are formatted into an HTML report, converted to PDF, and shared via Google Drive.",
    ],
    results: [
      "Sample run documented in the repository README: 238 clean observations (190 train / 48 test), R² 0.1986, MAE 999.97, RMSE 1308.62.",
    ],
  },
  {
    title: "Maximizing Taxi Driver Revenue Using Hypothesis Testing",
    slug: "taxi-revenue-hypothesis-testing",
    categories: ["Python", "Statistics"],
    description:
      "A hypothesis-testing analysis of taxi trip data that asks whether payment type (cash vs credit card) affects fare amount.",
    image: "/projects/taxi-revenue.jpg",
    imageAlt: "Graphs from the taxi revenue hypothesis testing analysis",
    gallery: [],
    tools: ["Python", "Pandas", "Matplotlib", "Seaborn", "SciPy", "Jupyter Notebook"],
    githubUrl: "https://github.com/zaeemjamil/Maximizing-Taxi-Driver-Revenue-Using-Hypothesis-Testing",
    liveUrl: "",
    caseStudyUrl: "",
    featured: true,
    overview:
      "The project analyzes taxi trip data (pickup and dropoff times, passenger count, distance, fare amount, payment type) to see whether payment method is linked to fare amount.",
    problem: "Do customers who pay by credit card generate higher fares than those who pay in cash?",
    approach: [
      "Created a trip duration feature from pickup and dropoff times.",
      "Cleaned the data: removed missing values, fixed data types, dropped duplicates and negative values.",
      "Removed outliers in fare, distance and duration using the IQR method.",
      "Exploratory analysis of distance, fare and passengers by payment type.",
      "Tested H₀ (no difference in average fare) against H₁ (card fares are higher).",
    ],
    results: ["p-value below 0.05, so the null hypothesis was rejected. The README concludes that card payments show significantly higher fares than cash."],
  },
  {
    title: "FNP Sales Analysis",
    slug: "fnp-sales-analysis",
    categories: ["Excel"],
    description:
      "An interactive Excel dashboard analyzing 1,000 orders from FNP (Ferns N Petals): revenue, delivery time, occasions, categories and cities.",
    image: "/projects/fnp-sales.png",
    imageAlt: "Screenshot of the FNP sales analysis Excel dashboard",
    gallery: [],
    tools: ["Excel", "Power Query", "Pivot Tables", "Slicers"],
    githubUrl: "https://github.com/zaeemjamil/FNP__Excel-Project",
    liveUrl: "",
    caseStudyUrl: "",
    featured: true,
    overview:
      "A sales analysis of gift orders across occasions such as Diwali, Raksha Bandhan, Holi, Valentine's Day, birthdays and anniversaries, built as a dashboard over order, customer and product data.",
    problem: "Answer ten business questions about revenue, delivery time, monthly sales, top products, customer spending, top cities and occasions.",
    approach: [
      "Prepared orders, customers and products data with Power Query.",
      "Built pivot tables and slicers for the dashboard.",
      "Compared revenue by occasion, category, month and order hour.",
    ],
    results: [
      "From the repository README: 1,000 orders, total revenue $3,520,984, average order-to-delivery time 5.53 days.",
      "Highest-revenue occasions: Anniversary, Raksha Bandhan and Diwali.",
    ],
  },
];

// ---------- CERTIFICATIONS ----------
// Not shown on the site in this version (kept as an empty export so api/chat.js keeps working).
export const CERTIFICATIONS = [];
