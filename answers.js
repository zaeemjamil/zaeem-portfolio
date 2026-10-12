// answers.js — the single place that turns a visitor's message into a decision + (when possible) an answer.
// Imported by BOTH index.html (instant answers in the browser) and api/chat.js (the server re-checks everything;
// it never trusts the browser). Everything here is built from data.js, so the bot can't say anything the site doesn't.
import { PROFILE as P, PROJECTS, CERTIFICATIONS, LINKS as L } from "./data.js";
import { REFUSE, NONE, HELLO, classify, normalize } from "./guard.js";

const pj = PROJECTS.map((p) => `• ${p.title}: ${p.description}`).join("\n");

// Quick answers, checked in this order. Every pattern is whole-word so "know", "about", "work" can't trigger by accident.
const quick = [
  [/\bresume\b|\bcv\b/i, () => "The resume can be downloaded with the Resume button in the navigation bar."],
  [/\bgithub\b/i, () => `GitHub: ${L.github}`],
  [/\blinkedin\b/i, () => `LinkedIn: ${L.linkedin}`],
  [/\bfiverr\b/i, () => `Fiverr: ${L.fiverr}`],
  [/\bcontact\b|\bemail\b|\breach\b|\bhire\b|\bhiring\b|\bfreelanc|\bavailable\b|\bget in touch\b/i, () => `Email: ${L.email}\nLinkedIn: ${L.linkedin}\nGitHub: ${L.github}\nFiverr: ${L.fiverr}`],
  [/\blanguages?\b|\burdu\b|\benglish\b/i, () => `Languages: ${P.languages.join(", ")}`],
  [/\bbased\b|\blocation\b|\bcity\b|\blive\b|\bgujranwala\b/i, () => `${P.name} is based in ${P.location}.`],
  [/\beducation\b|\bstud(y|ies|ying)\b|\bdegree\b|\buniversit|\bpunjab\b/i, () => `${P.education.degree} at ${P.education.school}, ${P.education.years} (${P.education.note.toLowerCase()}).`],
  [/\bprojects?\b|\bbuilt\b|\bportfolio work\b/i, () => `Projects on this portfolio:\n${pj}`],
  [/\bexperience\b|\bintern(s|ship|ships|ed)?\b|\bjobs?\b|\bwork(ed|s)?\b|\bkpmg\b|\bdev valley\b|\bemploy/i, () => P.experience.map((e) => `${e.role} at ${e.org}${e.place ? ", " + e.place : ""} (${e.period}).${e.tools && e.tools.length ? " Tools: " + e.tools.join(", ") : ""}`).join("\n")],
  [/\bskills?\b|\btechnolog|\bstack\b|\btools?\b|\bpython\b|\bexcel\b|\bmysql\b|\bsql\b|\bexpertise\b/i, () => `Skills: ${Object.values(P.skills).flat().join(", ")}`],
  [/\bcertif/i, () => (CERTIFICATIONS.length ? CERTIFICATIONS.map((c) => c.name).join(", ") : NONE)],
  [/\bwho\b|\bintroduce\b|\bbackground\b|\bsummary\b|\bbio\b|\bfocus\b/i, () => `${P.name} (${P.shortName}) is a Data Analyst. He is studying ${P.education.degree} at ${P.education.school} (${P.education.years}, ${P.education.note.toLowerCase()}).\nCurrent focus: ${P.focus.join(", ")}.`],
];

// Words that identify each project. The first slug word is added automatically; extras live here (not in data.js).
const ALIASES = { "fnp-sales-analysis": ["ferns n petals"], "statflow-ai": ["stat flow"], "taxi-revenue-hypothesis-testing": ["taxi driver", "taxi revenue", "maximizing taxi", "maximising taxi"] };
const findProject = (q) => {
  const s = q.toLowerCase();
  return PROJECTS.find((p) => [p.slug.split("-")[0], ...(ALIASES[p.slug] || [])].some((k) => k.length > 2 && new RegExp(`\\b${k}\\b`).test(s)));
};

const projectAnswer = (p, q) => {
  if (/\b(results?|findings?|conclusions?|outcomes?|p-?value|r2|r²|revenue|metrics?|accuracy)\b/i.test(q)) return p.results && p.results.length ? `${p.title}\n${p.results.join("\n")}` : NONE;
  if (/\b(tools?|stack|technolog\w*|libraries|built with)\b/i.test(q)) return `${p.title}\nTools: ${p.tools.join(", ")}`;
  if (/\b(demo|live|try)\b/i.test(q)) return p.liveUrl ? `${p.title}\nLive demo: ${p.liveUrl}` : NONE;
  if (/\b(github|repo|repository|code|link|source)\b/i.test(q)) return p.githubUrl ? `${p.title}\nGitHub: ${p.githubUrl}` : NONE;
  if (/\b(approach|methods?|steps|process|how)\b/i.test(q) && p.approach && p.approach.length) return `${p.title}\n${p.approach.map((a) => "• " + a).join("\n")}`;
  if (/\b(problem|question|goal|hypothesis)\b/i.test(q) && p.problem) return `${p.title}\nQuestion: ${p.problem}`;
  return [p.title, p.overview || p.description, p.problem && `Question: ${p.problem}`, `Tools: ${p.tools.join(", ")}`, p.githubUrl && `GitHub: ${p.githubUrl}`, p.liveUrl && `Live demo: ${p.liveUrl}`].filter(Boolean).join("\n");
};

/**
 * route(message) -> { type, reply? }
 *   "refuse" | "greet" | "none" | "local"  -> final answer in `reply` (no AI involved, same text everywhere)
 *   "ai"                                   -> on-topic but needs the model; caller must ask the API
 */
export function route(message) {
  const q = normalize(message);
  const kind = classify(q);
  if (kind === "refuse") return { type: "refuse", reply: REFUSE };
  if (kind === "greet") return { type: "greet", reply: HELLO };
  if (kind === "none") return { type: "none", reply: NONE };
  if (kind === "local" && q.split(" ").length <= 8) {
    const p = findProject(q);
    if (p) return { type: "local", reply: projectAnswer(p, q) };
    const hit = quick.find(([re]) => re.test(q));
    if (hit) return { type: "local", reply: hit[1]() };
  }
  return { type: "ai" };
}
