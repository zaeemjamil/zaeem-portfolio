// guard.js — used by BOTH the browser chat (index.html) and the server route (api/chat.js),
// so the two always refuse in the same way, with the same wording.

export const REFUSE = "I can only answer questions about Zaeem and his portfolio.";
export const NONE = "I don't have that information in my portfolio.";
export const BUSY = "The assistant is busy right now. Please try again in a moment.";
export const HELLO = "Hi! You can ask me about Zaeem's projects, skills, education or how to contact him.";

const PERSON = /\b(zaeem|jamil|muhammad|he|his|him)\b/i;                       // refers to Zaeem
const ENTITY = /\b(statflow|taxi|fnp|kpmg|valley|fiverr|n8n)\b/i;               // his projects / employers / profiles
const SECOND = /\b(you|your|yours)\b/i;                                          // the assistant speaks for Zaeem
const NOUN = /\b(portfolio|resume|cv|website|skills?|projects?|education|experience|interns?|internships?|certifications?|certificates?|degree|study|studies|studying|university|punjab|background|contact|email|github|linkedin|location|based|languages?)\b/i;
const TECH = /\b(python|pandas|numpy|mysql|sql|excel|statistics|regression|hypothesis|visuali[sz]ation|machine learning|jupyter|n8n)\b/i;
const TASK = /\b(write|generate|compose|draft|debug|translate|solve|calculate|compute|convert|rewrite)\b/i;   // jobs the bot must not do
const CREATIVE = /\b(poem|joke|story|essay|song|recipe|haiku|lyrics|cover letter)\b/i;
const OTHER_PERSON = /\bwho (is|was|are|were)\b(?![^?]*\b(zaeem|jamil|muhammad|he|this|you)\b)/i;     // "Who is Elon Musk?"
const INJECTION = /\b(ignore (all |the |your |previous |above )*(instructions|rules)|system prompt|pretend|act as|role.?play|jailbreak)\b/i;
const GREETING = /^\s*(hi|hello|hey|thanks|thank you|ok|okay)\b[\s!.?]*$/i;

/**
 * "refuse" – not about Zaeem / not allowed          → answer REFUSE
 * "greet"  – a plain hello                           → answer HELLO
 * "local"  – clearly about Zaeem                     → browser may answer from data.js, otherwise ask the AI
 * "ai"     – about the portfolio but loosely worded  → ask the AI
 */
export function classify(q) {
  const t = String(q || "").trim();
  if (!t) return "refuse";
  if (GREETING.test(t)) return "greet";
  if (INJECTION.test(t) || CREATIVE.test(t) || OTHER_PERSON.test(t)) return "refuse";
  const named = PERSON.test(t) || ENTITY.test(t);
  const onTopic = named || NOUN.test(t) || (SECOND.test(t) && TECH.test(t));
  if (!onTopic) return "refuse";
  if (TASK.test(t) && !named) return "refuse";
  const words = t.split(/\s+/).length;
  return named || SECOND.test(t) || words <= 3 ? "local" : "ai";
}
