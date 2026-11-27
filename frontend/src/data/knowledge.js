/* Single source of truth for InsightFlow facts: used by the chatbot, Help page and Demo page. */

export const TAGLINE =
  "InsightFlow helps organizations track real-time user behavior, detect journey friction, and generate AI-powered recommendations that improve conversions, retention, and product decisions.";

export const ABOUT =
  "InsightFlow is an intelligent web analytics platform that turns website interaction data into meaningful insights and predictive intelligence. A tracking script collects interaction events, MongoDB stores them, and an interactive dashboard shows activity, engagement, retention, conversion and navigation patterns. A machine learning layer predicts visitor retention, and a Generative AI layer (Google Gemini) explains the results in plain language.";

/* ───────── Roles ───────── */
export const ROLES = [
  {
    id: "USER", label: "User", signup: "Personal", short: "Individual use",
    forWho: "Individuals and employees: people who want to view analytics, not run a company account.",
    summary: "A User account is for individual use. Users join workspaces they are invited to and view the project analytics assigned to them.",
    can: ["Sign up for free as a Personal account", "Accept collaboration invitations from organizations", "Open the workspaces they belong to", "View project analytics allowed by their workspace role (Viewer, Admin, etc.)", "Get notifications, manage profile and settings"],
    cannot: ["Create company workspaces or projects (that is done by Organizer accounts)", "Generate API keys or run the SDK setup for a company"],
    dashboard: "/dashboard", color: "#3b2fa8",
  },
  {
    id: "ORGANIZER", label: "Organizer", signup: "Team / Org", short: "For organizations",
    forWho: "Companies, institutes and teams that want to track their own website or app. A company name is required at signup.",
    summary: "An Organizer account is for the company side. Organizers create workspaces, add projects, generate API keys, set up the SDK, invite team members and read the full analytics.",
    can: ["Register the organization (company name required)", "Create workspaces (one per company or team)", "Add projects (one per website or app) and get a hashed API key", "Use the SDK guide and click Verify SDK", "Open analytics: page views, DAU, MAU, funnels, retention, AI insights, ML predictions", "Invite members by email and assign roles such as Viewer or Admin"],
    cannot: ["Manage the whole platform (that belongs to Super Admin)"],
    dashboard: "/organizer-dashboard", color: "#f67963",
  },
  {
    id: "SUPER_ADMIN", label: "Super Admin", signup: "Platform team only", short: "Runs the platform",
    forWho: "The InsightFlow platform owners. This role is not available at public signup.",
    summary: "Super Admin controls the whole platform: users, organizations, verifications and approvals, admins, workspaces, projects, notifications and system settings.",
    can: ["Review and approve organization verifications", "Manage users, organizations, admins and settings", "Oversee every workspace and project", "Send platform notifications"],
    cannot: [],
    dashboard: null, color: "#2bb89a",
  },
];

export const WORKSPACE_ROLES = [
  { name: "Admin", text: "Can manage the project and its members, and see all analytics." },
  { name: "Team Member", text: "Works with the project and its analytics as allowed by the workspace." },
  { name: "Viewer", text: "Read-only access to dashboards and reports." },
];

/* ───────── Workflow ───────── */
export const WORKFLOW = [
  { title: "Register an organization account", text: "Sign up with the Team / Org account type and enter your company name." },
  { title: "Create a workspace", text: "A workspace represents your company or team. Each workspace's data is isolated." },
  { title: "Add a project", text: "A project is one website or app that you want to track." },
  { title: "Receive the API key", text: "A unique key is generated. It is stored only as a hash and shown one time, so copy it immediately." },
  { title: "Add the SDK", text: "Open the SDK guide, choose your stack (full stack/MERN, React, Next.js, HTML, WordPress, Vue, Angular, React Native, Flutter) and copy the ready-to-use script or the AI prompt." },
  { title: "Go live and verify", text: "Put the key in your site, deploy it, then click Verify SDK in InsightFlow. We check the key and the incoming event data." },
  { title: "Open analytics and AI insights", text: "The dashboard shows page views, user counts, DAU, MAU, funnels and retention, plus AI insights and ML predictions." },
  { title: "Invite your team", text: "Add a teammate's email to the workspace and choose a role. They accept the invitation and the role applies." },
];

export const INVITE_FLOW = [
  { title: "Add the email", text: "The organizer adds the member's email in the workspace." },
  { title: "Account check", text: "InsightFlow checks whether an account exists for that email." },
  { title: "Create account if needed", text: "If there is none, the person must sign up first." },
  { title: "Invitation email", text: "A collaboration invitation email is sent." },
  { title: "Accept and role applies", text: "After acceptance, the assigned role (Viewer, Admin...) takes effect." },
];

/* ───────── Data, AI and ML ───────── */
export const PIPELINE = ["Your website", "Tracking SDK", "Ingest API", "MongoDB events", "Analytics engine", "AI + ML layer", "Dashboard"];

export const EVENT_EXAMPLE = {
  projectId: "PROJECT_ID", eventName: "page_view", sessionId: "SESSION_ID", anonymousId: "VISITOR_ID", userId: "",
  properties: { page: "/products", device: "mobile" }, ts: "2026-10-29T10:30:00.000Z",
};

export const LAYERS = [
  { name: "Raw event layer", text: "Every action is saved as its own MongoDB document: eventName, projectId, sessionId, anonymousId, userId, ts and a flexible properties object. This is semi-structured data." },
  { name: "Analytics layer", text: "The analytics service aggregates raw events into numbers such as total events, page views, unique users, DAU, MAU, bounce rate and retention." },
  { name: "AI insights layer", text: "Analytics results are given to Gemini as context, which writes explanations and recommendations in plain language." },
  { name: "ML prediction layer", text: "Features are engineered from events (page views, sessions, visit frequency, days since last visit) and models predict visitor retention." },
];

export const ML = {
  objective: "Predict whether a visitor will return within 7 days (visitor retention), using supervised learning.",
  models: [{ name: "XGBoost", role: "Primary candidate" }, { name: "Random Forest", role: "Comparison model" }, { name: "Logistic Regression", role: "Comparison model" }],
  metrics: ["Precision", "Recall", "F1-score", "ROC-AUC"],
  features: ["page_views_7d", "sessions_7d", "visit_frequency", "days_since_last_visit"],
  note: "The final model is chosen from experimental results, not assumed. A validation layer checks data quality, model performance and whether AI explanations match the real metrics.",
  forecasts: [
    { metric: "DAU", idea: "Forecast the next day's daily active users", model: "XGBoost Regressor" },
    { metric: "MAU", idea: "Forecast next month's monthly active users", model: "XGBoost Regressor" },
    { metric: "7-day retention", idea: "Probability that a visitor returns within 7 days", model: "XGBoost Classifier" },
    { metric: "Drop-off rate", idea: "Expected drop-off for future sessions or cohorts", model: "XGBoost Classifier or Regressor" },
  ],
};

/* ───────── Final year project facts ───────── */
export const PROJECT = {
  title: "InsightFlow: An Intelligent User Behaviour Analytics and Predictive Intelligence",
  group: "G51", university: "GLA University, Mathura", department: "Department of Computer Engineering & Applications",
  program: "B.Tech. (CSE), Session 2026-27", supervisor: "Dr. Monica Dutta",
  members: ["Aaradhya Rathore", "Arpan Jain", "Pavan Patel", "Radhika Gupta", "Shyam Ji Patel"],
  motivation: "Traditional web analytics mostly shows historical, descriptive reports, which is not enough to anticipate future visitor behaviour. InsightFlow explores how machine learning can find behavioural patterns and predict retention, while Generative AI translates results into understandable recommendations. It can help startups, educational platforms and other digital services make informed engagement decisions.",
  innovations: [
    "Predictive Visitor Retention: supervised ML predicts retention from historical behavioural features.",
    "Comparative ML Modelling: Logistic Regression, Random Forest and XGBoost are evaluated to find a suitable model.",
    "AI-Powered Analytical Insights: the Google Gemini API writes natural-language explanations and recommendations.",
    "Behavioural Feature Engineering: raw interaction events become structured features for ML.",
    "Integrated Analytics Dashboard: historical analytics, AI insights and ML predictions in one interface.",
  ],
  gantt: [
    ["Requirement analysis and architecture design", "Sep 2026"], ["Event tracker middleware and MongoDB schema", "Sep to Oct 2026"],
    ["Data cleaning and feature extraction (Pandas)", "Oct to Nov 2026"], ["ML modelling (XGBoost, Random Forest, Logistic Regression)", "Oct to Nov 2026"],
    ["Frontend dashboard and JWT / OAuth setup", "Oct to Nov 2026"], ["Decoupled GenAI advisory layer integration", "Nov 2026"], ["End-to-end system testing and deployment", "Nov to Dec 2026"],
  ],
  stack: { Frontend: "React.js, Vite, Tailwind CSS, Recharts", Backend: "Node.js, Express.js", Database: "MongoDB Atlas, Mongoose", "Machine Learning": "Python, Pandas, NumPy, Scikit-learn, XGBoost, FastAPI", "Generative AI": "Google Gemini API", Tools: "Visual Studio Code, Git, GitHub, Postman" },
  hardware: "Intel Core i5 / AMD Ryzen 5 or equivalent, minimum 8 GB RAM (16 GB recommended), SSD storage and a reliable internet connection.",
};

export const USE_CASES = ["Coaching centers", "College portals", "Exam and test systems", "E-commerce websites", "HR and job portals", "Business and startup websites"];

export const EXAM_EXAMPLE = "Math completion is running 28% below the platform average. Question 8 shows a repeated hesitation pattern with a 42% reattempt rate. Recommended action: add a contextual hint and simplify the question prompt.";
