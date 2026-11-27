import { TAGLINE, ABOUT, ROLES, WORKSPACE_ROLES, WORKFLOW, INVITE_FLOW, PIPELINE, EVENT_EXAMPLE, LAYERS, ML, PROJECT, USE_CASES, EXAM_EXAMPLE } from "./knowledge";

const role = (id) => ROLES.find((r) => r.id === id);
const list = (a) => a.map((x) => `• ${x}`).join("\n");
const U = role("USER"), O = role("ORGANIZER"), S = role("SUPER_ADMIN");
const ROLE_LINK = { label: "Roles guide", to: "/help#roles" };

export const KB = [
  /* ───── About ───── */
  { id: "about", keys: ["what is insightflow", "what does insightflow", "insightflow kya", "insightflow kya hai", "insightflow kya karta", "about insightflow", "tell me about", "what do you do", "introduce", "overview", "explain insightflow"],
    a: `**InsightFlow** ${TAGLINE.replace("InsightFlow ", "")}\n\n${ABOUT}`,
    follow: ["How does it work?", "Which role should I pick?", "How is retention predicted?"], links: [{ label: "Take the demo", to: "/demo" }] },
  { id: "problem", keys: ["problem", "why insightflow", "why use", "benefit", "motivation", "why this project", "kyun"],
    a: `${PROJECT.motivation}`, follow: ["What are the key innovations?", "Who is it for?"], links: [] },
  { id: "innovation", keys: ["innovation", "innovative", "unique", "special", "key features", "highlights", "what is new"],
    a: `Key innovations:\n${list(PROJECT.innovations)}`, follow: ["How is retention predicted?", "What tech stack is used?"], links: [] },
  { id: "usecases", keys: ["use case", "who is it for", "who can use", "which websites", "coaching", "college", "ecommerce", "e-commerce", "job portal", "edtech", "which type of website"],
    a: `InsightFlow suits:\n${list(USE_CASES)}\n\nFor exam platforms it can show where students quit, which section is weak and time per question. Note: you can only track sites where you can add the script, so not third-party sites like YouTube or Instagram.`,
    follow: ["How does it work?", "Show me an AI insight example"], links: [] },

  /* ───── Roles ───── */
  { id: "roles", keys: ["roles", "which role", "kaunsa role", "kaun sa role", "register as", "signup as", "sign up as", "account type", "role kya", "roles kya", "difference between", "user vs", "personal or", "user vs organizer", "user or organizer", "user and organizer", "user aur organizer", "organizer or user", "organizer vs user", "team / org", "role choose", "role select", "what roles", "role ka kaam"],
    a: `You can register with two account types:\n• **${U.label}** (shown as "${U.signup}"): ${U.short.toLowerCase()}. ${U.forWho}\n• **${O.label}** (shown as "${O.signup}"): ${O.short.toLowerCase()}. ${O.forWho}\n\nA third role, **Super Admin**, belongs to the platform team and is not available at signup.\n\n**Rule of thumb:** pick *Personal* if you were invited to view a company's analytics. Pick *Team / Org* if you are a company that wants to add projects and track its own site.`,
    follow: ["What can a User do?", "What can an Organizer do?", "What does Super Admin do?"], links: [ROLE_LINK, { label: "Create account", to: "/signup" }] },
  { id: "role-user", keys: ["user role", "role user", "user wala", "user account", "personal account", "as a user", "individual", "user kya kar", "user ka kaam", "what can a user", "personal role", "user role kis liye", "employee account", "user kis liye", "user wala role", "user wale role", "user role kiske", "user role ka", "user kiske liye"],
    a: `**User (Personal)**: ${U.summary}\n\n**A User can:**\n${list(U.can)}\n\n**A User cannot:**\n${list(U.cannot)}\n\nTypical case: an employee or teammate who is invited by their company's Organizer.`,
    follow: ["What can an Organizer do?", "How do invitations work?"], links: [ROLE_LINK] },
  { id: "role-org", keys: ["organizer", "organiser", "organization role", "organisation role", "organization wala", "organisation wala", "company role", "company account", "org role", "organization account", "organizer kya", "organizer ka kaam", "what can an organizer", "who can create project", "who can add project", "kaun project add", "company ke liye", "team / org account", "who creates workspace"],
    a: `**Organizer (Team / Org)**: ${O.summary}\n\n**An Organizer can:**\n${list(O.can)}\n\nOrganizer accounts go through a verification step before full access.`,
    follow: ["How does it work?", "How do I invite my team?", "Is my API key secure?"], links: [ROLE_LINK, { label: "Create organization account", to: "/signup" }] },
  { id: "role-admin", keys: ["super admin", "superadmin", "super_admin", "platform admin", "admin panel", "admin dashboard", "who approves", "approval", "approve", "verification", "verify organization", "organizer verification"],
    a: `**Super Admin**: ${S.summary}\n\n**Super Admin can:**\n${list(S.can)}\n\nThis role is for the platform team and cannot be chosen at public signup.`,
    follow: ["What can an Organizer do?", "Which role should I pick?"], links: [ROLE_LINK] },
  { id: "role-workspace", keys: ["viewer", "admin role", "member role", "workspace role", "collaborator role", "team member role", "permission", "permissions", "access level", "what is viewer"],
    a: `Inside a workspace, an Organizer can give invited people one of these roles:\n${WORKSPACE_ROLES.map((r) => `• **${r.name}**: ${r.text}`).join("\n")}\n\nThe invited person needs a User account first.`,
    follow: ["How do invitations work?", "Which role should I pick?"], links: [ROLE_LINK] },

  /* ───── Workflow & setup ───── */
  { id: "workflow", keys: ["how does it work", "how it works", "how insightflow works", "workflow", "getting started", "get started", "kaise kaam", "kaise use", "steps", "process", "step by step", "start to end", "flow of insightflow"],
    a: `Here is the flow:\n${WORKFLOW.map((w, i) => `${i + 1}. **${w.title}**`).join("\n")}\n\nAsk me about any step, for example "API key", "SDK setup" or "Verify SDK".`,
    follow: ["Is my API key secure?", "How do I set up the SDK?", "How do I verify the SDK?"], links: [{ label: "Setup guide", to: "/help#workflow" }, { label: "Interactive demo", to: "/demo" }] },
  { id: "workspace", keys: ["workspace", "create workspace", "what is a workspace", "project kya", "what is a project", "add project", "create project", "project add"],
    a: `A **workspace** represents a company or team, and its data is isolated from other organizations. A **project** lives inside a workspace and stands for one website or app you want to track. Organizers create both, and a new project immediately gives you an API key, project id and the SDK guide.`,
    follow: ["Is my API key secure?", "How do I set up the SDK?"], links: [] },
  { id: "apikey", keys: ["api key", "apikey", "hashed", "hash", "one time", "one-time", "key lost", "lost key", "secret key", "missed the key", "key kaha", "key kaise", "key regenerate", "rotate"],
    a: `When a project is created, InsightFlow generates a unique API key. It is stored only as a **hash** (never in plain text) and is **shown one time**, so copy it right away. You put this key in the tracking script on your website or app. If you lose it, create a new key or project.`,
    follow: ["How do I set up the SDK?", "How do I verify the SDK?"], links: [{ label: "Security FAQ", to: "/help#faq" }] },
  { id: "sdk", keys: ["sdk", "script", "install", "integrate", "integration", "wordpress", "html", "react", "next.js", "nextjs", "vue", "angular", "mern", "full stack", "fullstack", "flutter", "react native", "prompt", "language", "framework", "ready to use", "snippet", "tracking code", "kaise lagaye", "kaise lagana"],
    a: `Open the **SDK guide** and choose your project's stack: full stack/MERN, React, Next.js, HTML, WordPress, Vue, Angular, React Native or Flutter. You get:\n• a **ready-to-use script**, and\n• an **AI prompt** you can paste into any AI assistant so it implements the script for you.\n\nThen add your API key, deploy, and verify.`,
    follow: ["How do I verify the SDK?", "What events are tracked?"], links: [{ label: "Open SDK guide", to: "/help#sdk" }] },
  { id: "verify", keys: ["verify sdk", "verify the sdk", "verify", "sdk verify", "verification of sdk", "check sdk", "sdk working", "connected", "events not coming", "no data", "data nahi"],
    a: `Once your site is live with the API key in place, open InsightFlow and click **Verify SDK**. We check your API key and the incoming event data. When it passes, the analytics dashboard opens. If nothing arrives, make sure the script is on the live site, the key and project id are correct, and refresh the site once.`,
    follow: ["What do I see in analytics?", "Is my API key secure?"], links: [] },
  { id: "events", keys: ["events", "event tracking", "what is tracked", "what events", "page view", "click", "track", "tracking", "identify", "custom event"],
    a: `The tracking script records **page views** (including single-page route changes), clicks, form submissions, exam activity, payments and **custom events**. Visitors are tracked anonymously with an anonymous id, and you can link a logged-in user with \`identify\`.`,
    follow: ["How is my data stored?", "What do I see in analytics?"], links: [] },

  /* ───── Analytics, AI, ML ───── */
  { id: "analytics", keys: ["dau", "mau", "metrics", "analytics", "dashboard", "users count", "active users", "funnel", "retention curve", "bounce", "what do i see", "kya dikhta", "reports", "charts"],
    a: `The dashboard shows **page views, user counts, Daily Active Users (DAU), Monthly Active Users (MAU)**, top pages and events, funnels with drop-off, retention, bounce rate, charts, filters and reports, plus AI insights and ML predictions.`,
    follow: ["Show me an AI insight example", "How is retention predicted?"], links: [{ label: "See live demo", to: "/demo" }] },
  { id: "ai", keys: ["ai insight", "insights", "gemini", "recommendation", "suggest", "generative", "genai", "natural language", "explain data", "ai kya", "ai example", "insight example", "chat assistant"],
    a: `The **Generative AI layer** uses the Google Gemini API. It receives analytics results as context and writes plain-language findings and recommendations.\n\nExample for an exam platform:\n*${EXAM_EXAMPLE}*`,
    follow: ["How is retention predicted?", "How do AI and ML differ here?"], links: [{ label: "AI Insights", to: "/#ai-insights" }] },
  { id: "ml", keys: ["machine learning", "predict", "prediction", "xgboost", "random forest", "logistic", "retention predict", "visitor retention", "supervised", "classifier", "ml model", "ml layer", " ml", "model select", "forecast"],
    a: `${ML.objective}\n\n• **Models:** ${ML.models.map((m) => `${m.name} (${m.role.toLowerCase()})`).join(", ")}\n• **Features:** ${ML.features.join(", ")}\n• **Metrics:** ${ML.metrics.join(", ")}\n\n${ML.note}`,
    follow: ["How do AI and ML differ here?", "What can ML forecast?", "How is feature engineering done?"], links: [{ label: "Predictions demo", to: "/demo" }] },
  { id: "ai-vs-ml", keys: ["ai and ml", "ai vs ml", "difference between ai", "ml ai", "dependency on ai", "ai pr dependency", "ml aur ai", "both"],
    a: `They work together:\n• **ML** does the numeric prediction (for example the probability that a visitor returns within 7 days).\n• **AI (Gemini)** explains analytics and predictions in plain language and recommends actions.\n\nBecause ML now produces the predictions, the platform depends less on AI alone, and a validation layer checks that AI explanations match the underlying metrics.`,
    follow: ["How is retention predicted?", "What can ML forecast?"], links: [] },
  { id: "ml-forecast", keys: ["forecast", "dau forecast", "mau forecast", "drop-off rate", "what can ml", "which model for", "regressor", "ml for dau"],
    a: `Planned ML uses:\n${ML.forecasts.map((f) => `• **${f.metric}**: ${f.idea} (${f.model})`).join("\n")}`,
    follow: ["How is retention predicted?", "How is feature engineering done?"], links: [] },
  { id: "features", keys: ["feature engineering", "features", "one hot", "one-hot", "encoding", "training row", "label", "target", "returned_within_7d", "dataset"],
    a: `**Feature engineering** turns raw MongoDB events into a numeric table for ML. For each visitor we compute things like page views in 7 days, sessions in 7 days, visit frequency and days since last visit. The label \`returned_within_7d\` is the answer the model learns, so it is **never used as an input** when predicting. Categorical fields such as \`eventName\` can be one-hot encoded. Raw events stay untouched; features go to a separate training dataset.`,
    follow: ["How is retention predicted?", "How is my data stored?"], links: [] },

  /* ───── Data & architecture ───── */
  { id: "data", keys: ["data stored", "how is data", "mongodb", "event format", "json", "schema", "semi structured", "semi-structured", "database", "data kis form", "raw data", "unstructured", "event document"],
    a: `Events are stored in **MongoDB** as **semi-structured** documents: predefined fields (\`eventName\`, \`projectId\`, \`sessionId\`, \`anonymousId\`, \`userId\`, \`ts\`) plus a flexible \`properties\` object. Example:\n\`${JSON.stringify(EVENT_EXAMPLE)}\`\n\nSo it is not purely unstructured: some fields are fixed and \`properties\` varies by event.`,
    follow: ["How does data flow to the dashboard?", "How is feature engineering done?"], links: [] },
  { id: "pipeline", keys: ["pipeline", "architecture", "how does data flow", "data flow", "flow of data", "ingest", "raw to dashboard", "layers", "how data reaches"],
    a: `${PIPELINE.join(" → ")}\n\n${LAYERS.map((l) => `• **${l.name}:** ${l.text}`).join("\n")}`,
    follow: ["How is my data stored?", "How is retention predicted?"], links: [{ label: "Data flow", to: "/help#data" }] },
  { id: "security", keys: ["secure", "security", "privacy", "multi tenant", "multi-tenant", "isolated", "jwt", "oauth", "safe", "data safe", "role based", "rbac"],
    a: `• Each organization's workspace data is **isolated** (multi-tenant)\n• API keys are **hashed** and shown once\n• **Role-based access** (User, Organizer, Super Admin, plus workspace roles)\n• Sign-in with **JWT** and **Google OAuth**\n• Project analytics APIs check that you belong to the workspace`,
    follow: ["Which role should I pick?", "Is my API key secure?"], links: [] },
  { id: "invite", keys: ["invite", "invitation", "add member", "team member", "collaborat", "employee", "teammate", "share project", "add email", "member add", "kaise add"],
    a: `${INVITE_FLOW.map((s, i) => `${i + 1}. **${s.title}:** ${s.text}`).join("\n")}\n\nWorkspace roles you can assign: ${WORKSPACE_ROLES.map((r) => r.name).join(", ")}.`,
    follow: ["What can a User do?", "Which role should I pick?"], links: [{ label: "Invite flow", to: "/help#team" }] },

  /* ───── Project ───── */
  { id: "stack", keys: ["tech stack", "technology", "built with", "technologies", "tools", "software requirement", "frontend", "backend", "which language", "fastapi", "tailwind", "tech used"],
    a: `${Object.entries(PROJECT.stack).map(([k, v]) => `• **${k}:** ${v}`).join("\n")}`, follow: ["What are the hardware requirements?", "What is the project timeline?"], links: [] },
  { id: "hardware", keys: ["hardware", "system requirement", "ram", "processor", "laptop"],
    a: `**Hardware:** ${PROJECT.hardware}`, follow: ["What tech stack is used?"], links: [] },
  { id: "timeline", keys: ["timeline", "gantt", "schedule", "planning", "phases", "project plan", "when will", "months", "deadline", "project duration"],
    a: `Project plan (Sep 2026 to Dec 2026), iterative development:\n${PROJECT.gantt.map(([t, d]) => `• ${t} (${d})`).join("\n")}\n\nThe final schedule follows the approved project duration and actual progress.`,
    follow: ["What tech stack is used?", "Who built this?"], links: [] },
  { id: "team", keys: ["who made", "who built", "who created", "creator", "developer", "supervisor", "guide", "gla", "group", "g51", "team members", "kisne banaya", "project topic", "department", "university", "final year"],
    a: `**${PROJECT.title}** is a final year project (${PROJECT.program}) by Group **${PROJECT.group}** at **${PROJECT.university}**, ${PROJECT.department}.\n\n**Members:** ${PROJECT.members.join(", ")}.\n**Supervisor:** ${PROJECT.supervisor}.`,
    follow: ["What are the key innovations?", "What is the project timeline?"], links: [{ label: "Meet the team", to: "/#team" }] },
  { id: "free", keys: ["free", "price", "pricing", "cost", "plan", "paid"],
    a: `Registration is free. Create an account, set up a workspace and add your first project in minutes.`, follow: ["Which role should I pick?"], links: [{ label: "Create account", to: "/signup" }] },
  { id: "help", keys: ["help", "support", "contact", "problem hai", "issue", "error", "not working", "bug"],
    a: `The **Help Center** has the workflow, SDK guide, roles, FAQs and troubleshooting. You can also use the contact form at the bottom of the home page.`, follow: ["How do I verify the SDK?"], links: [{ label: "Open Help Center", to: "/help" }] },
  { id: "hello", keys: ["hello", "hi", "hey", "namaste", "hii", "good morning", "good evening"],
    a: `Hi! I'm **Flo**. I can explain what InsightFlow does, the **User vs Organizer roles**, how the SDK and API key work, team invitations, analytics, AI and ML, and the project itself.`, follow: ["What does InsightFlow do?", "Which role should I pick?"], links: [] },
  { id: "thanks", keys: ["thanks", "thank you", "shukriya", "dhanyavad", "great", "awesome"], a: `Happy to help! Ask me anything else about InsightFlow.`, follow: ["Which role should I pick?", "How does it work?"], links: [] },
];

export const CHIPS = ["What does InsightFlow do?", "Which role should I pick?", "User vs Organizer", "How does it work?", "How is retention predicted?", "Who built this?"];
export const FALLBACK = { a: "I'm not sure about that one yet. I can help with **what InsightFlow does, roles (User, Organizer, Super Admin), setup and the API key, team invitations, analytics, AI and ML, and the project details**.", follow: ["What does InsightFlow do?", "Which role should I pick?", "How does it work?"], links: [{ label: "Open Help Center", to: "/help" }] };

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s\-./_]/g, " ").replace(/\s+/g, " ").trim();

export const answer = (q) => {
  const t = " " + norm(q) + " ";
  let best = null, top = 0;
  for (const e of KB) {
    let sc = 0;
    for (const k of e.keys) {
      const key = k.trim();
      const hit = key.length <= 3 ? new RegExp(`\\b${key}\\b`).test(t) : t.includes(key);
      if (hit) sc += key.length <= 3 ? 6 : key.length;
    }
    if (sc > top) { top = sc; best = e; }
  }
  return top >= 5 ? best : FALLBACK;
};
