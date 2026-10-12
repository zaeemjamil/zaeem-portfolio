// guard.js — ONE refusal policy, used by BOTH the browser chat (index.html) and the server route (api/chat.js),
// via route() in answers.js. A message therefore gets the same decision and the same wording on either side.
//
// Order of decisions in classify():
//   1. empty / too long                        -> "refuse"
//   2. plain greeting or "what can you do"     -> "greet"
//   3. instruction-override attempts           -> "refuse"
//   4. requests to DO something (write code, an essay, an assignment, translate, solve ...) -> "refuse"
//      This applies EVEN IF the message names Zaeem or one of his projects: naming him does not unlock the task.
//   5. not clearly about Zaeem / his portfolio -> "refuse"
//   6. about Zaeem but personal and not in the portfolio (age, salary, family ...) -> "none"
//   7. about Zaeem -> "local" (a short question the quick answers may cover) or "ai" (needs the model)

export const REFUSE = "I can only answer questions about Zaeem and his portfolio.";
export const NONE = "I don't have that information in my portfolio.";
export const HELLO = "Hi! You can ask me about Zaeem's projects, skills, education or how to contact him.";
// Shown only when a question really needs the AI and the AI call did not succeed (never disguised as NONE):
export const BUSY = "The assistant is busy right now. Please try again in a moment.";
export const UNAVAILABLE = "The assistant can't answer that right now. Please try again later or use the contact links on this page.";

export const MAX_LEN = 300;

/** Strip invisible/control characters and odd spacing so tricks like "ig\u200bnore" don't slip through. */
export function normalize(raw) {
  return String(raw ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2060\ufeff]/g, " ")
    .replace(/[’‘`´]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// ---- who / what a message refers to ----
const ZAEEM = /\bzaeem\b/i;
const STRONG_ENTITY = /\b(statflow|stat flow|fnp|ferns n petals|taxi (driver|revenue|project|analysis|trip|fare|dataset|hypothesis)|maximi[sz]ing taxi)\b/i;
const WEAK_ENTITY = /\b(kpmg|dev ?valley|fiverr|n8n)\b/i;                       // only count when the wording also points at Zaeem
const POSS = /\b(he|his|him|himself|the owner|this (portfolio|website|site|page|person)|the portfolio)\b/i;
const SECOND = /\b(you|your|yours|you're)\b/i;                                    // the assistant speaks for Zaeem
const NOUN = /\b(portfolio|resume|cv|website|skills?|projects?|education|experience|interns?|internships?|certifications?|certificates?|degree|study|studies|studying|university|punjab|background|contact|email|github|linkedin|location|based|languages?|dashboards?|workflows?)\b/i;
const TECH = /\b(python|pandas|numpy|mysql|sql|excel|power query|statistics|regression|hypothesis|visuali[sz]ation|machine learning|jupyter|n8n|scipy|matplotlib|seaborn|data analysis|data cleaning)\b/i;
const TOPIC_VERB = /\b(live|lives|study|studies|studied|work|works|worked|built|speak|speaks|graduate|graduated|based)\b|\bwhat (?:does|do|did) (?:he|you) do\b/i;   // only counts with "he/his", never with a bare "you"

// ---- things the bot must never do ----
const VERBS = "write|generate|compose|draft|create|produce|code|program|implement|develop|debug|fix|translate|solve|calculate|compute|convert|rewrite|rephrase|paraphrase|proofread|build|simulate|do my|complete my|finish my";
// A request verb at the start of the message, of a sentence, or right after "and / then / also / but ...", optionally behind
// "please", "can you", "I need you to", "help me" ... so "Tell me about Zaeem and also write Python code" is caught too.
const PREFIX = `(?:(?:please|kindly|just)\\s+)*(?:(?:can|could|would|will|may)\\s+you\\s+(?:please\\s+)?|i\\s+(?:need|want|would like|'d like)\\s+(?:you\\s+to\\s+)?|help\\s+me\\s+(?:to\\s+)?|let's\\s+)?`;
const OBJECT = "(?:me\\b|my\\b|a\\b|an\\b|the\\b|some\\b|this\\b|that\\b|it\\b|python\\b|sql\\b|java\\w*\\b|r\\b|code\\b|\\w+\\s+(?:code|script|essay|program|function|query)\\b)";
const TASK = new RegExp(
  `(?:^|[.!?;:,\\n])\\s*${PREFIX}(?:${VERBS})\\b` +                                     // start of message / sentence: any request verb
  `|\\b(?:and|then|also|but|plus|now|so)\\s+${PREFIX}(?:${VERBS})\\s+${OBJECT}`, "i");  // after a connector: verb + object ("and write python ...")
const ARTIFACT = "code|source code|script|program|function|algorithm|snippet|query|essay|assignment|homework|poem|story|joke|song|recipe|haiku|lyrics|cover letter|thesis|article|blog post|report";
const ARTIFACT_REQ = new RegExp(`\\b(give|show|provide|send|get|need|want|make|do)\\s+(?:me\\s+)?(?:a |an |the |some |my |your )?(?:[\\w-]+\\s+){0,3}(?:${ARTIFACT})\\b`, "i");
const LINK_LOOKUP = /\b(github|repo|repository|link|url)\b/i;                    // "show me the repo/link" is a lookup, not a generation request
const HOWTO = /\bhow (?:do|can|could|would|should) (?:i|you|we|one)\b[^?.!]*\b(implement|code|write|build|calculate|solve|install|fix|debug|train|create|plot|run|use)\b|\bhow to\b[^?.!]*\b(implement|code|write|build|calculate|solve|install|fix|debug|train|create|plot|run|use)\b/i;
const CREATIVE = /\b(poem|joke|story|essay|song|recipe|haiku|lyrics|cover letter|assignment|homework|thesis|riddle)\b/i;
const OTHER_PERSON = /\bwho (is|was|are|were)\b/i;                               // allowed only when Zaeem is clearly the subject
const INJECTION = new RegExp([
  "(ignore|disregard|forget|override|bypass|skip|drop|neglect|overrule)\\b[^.?!]{0,40}\\b(instructions?|rules?|prompts?|guidelines?|restrictions?|polic(y|ies)|constraints?|limits?)",
  "(system|developer|hidden|initial|original) (prompt|message|instructions?)",
  "(reveal|show|print|repeat|leak|display|output)\\b[^.?!]{0,30}\\b(prompt|instructions|rules|knowledge base)",
  "\\b(pretend|role.?play|jailbreak|developer mode|dan mode|do anything now)\\b",
  "\\bact (as|like)\\b",
  "\\byou are (now|no longer)\\b",
  "\\bfrom now on\\b",
  "\\bnew (instructions?|rules?|persona|role)\\b",
  "\\b(without|no) (any )?(restrictions?|rules|limits|filters?)\\b",
  "\\bin (the )?(role|character) of\\b",
].join("|"), "i");
const GREETING = /^(?:hi|hello|hey|hii+|salam|assalam[ -]?o[ -]?alaikum|thanks|thank you|ok|okay)\b[\s!.?]*$/i;
const HELP = /^(?:what can you do|how can you help( me)?|help|what do you do)\??$/i;
// Personal details the portfolio does NOT contain -> the standard "not in my portfolio" reply, without asking a model.
const PERSONAL_UNSUPPORTED = /\b(age|old|birthday|birthdate|date of birth|dob|born|birth ?place|married|marital|wife|husband|girlfriend|boyfriend|single|family|father|mother|parents?|brothers?|sisters?|siblings?|kids?|children|religion|religious|political|politics|salary|income|earns?|earning|net worth|paid|rates?|hourly|charges?|price|pricing|height|weight|tall|pets?|hobbies|hobby|favou?rites?|phone|whatsapp|mobile number|cnic|passport|home address|street address|gpa|cgpa|grades?|marks|percentage|ethnicity|caste|nationality)\b/i;
const PERSONAL_WORDS = PERSONAL_UNSUPPORTED.source.replace(/^\\b\(|\)\\b$/g, "");
// Without his name, only count a personal-detail question when it is plainly aimed at him/the assistant
// ("his salary", "your age", "how old is he", "is he married"), so "Do you know the age of the universe?" is still refused.
const PERSONAL_BY_PRONOUN = new RegExp(
  `\\b(?:his|your)\\s+(?:\\w+\\s+){0,2}(?:${PERSONAL_WORDS})\\b|\\bhow old (?:is|are) (?:he|you)\\b|\\b(?:is|are) (?:he|you) (?:married|single)\\b|\\b(?:does|do) (?:he|you) (?:earn|have (?:a |any )?(?:wife|husband|girlfriend|boyfriend|kids|children|pets?|siblings?|brothers?|sisters?))\\b`, "i");
const personalUnsupported = (t, named) => (named ? PERSONAL_UNSUPPORTED.test(t) : PERSONAL_BY_PRONOUN.test(t));
const YESNO = /^(does|did|has|have|is|are|can|could|do|will|would|was|were)\b/i;

/** @returns {"refuse"|"greet"|"none"|"local"|"ai"} */
export function classify(raw) {
  const t = normalize(raw);
  if (!t || t.length > MAX_LEN) return "refuse";
  if (GREETING.test(t) || HELP.test(t)) return "greet";

  // 3–4. Never obey instructions or do tasks, even when the message mentions Zaeem or a project.
  if (INJECTION.test(t)) return "refuse";
  if (TASK.test(t) || HOWTO.test(t) || CREATIVE.test(t)) return "refuse";
  if (ARTIFACT_REQ.test(t) && !LINK_LOOKUP.test(t)) return "refuse";

  // 5. Must be about Zaeem / his portfolio.
  const person = ZAEEM.test(t);
  const pointsAtHim = person || POSS.test(t) || SECOND.test(t) || /\b(intern|internship|project|experience|work|role|degree|study|studies)\b/i.test(t);
  const named = person || STRONG_ENTITY.test(t) || (WEAK_ENTITY.test(t) && pointsAtHim);
  if (OTHER_PERSON.test(t) && !person) return "refuse";
  const words = t.split(" ").length;
  const anchored = named || POSS.test(t) || SECOND.test(t);
  const onTopic = named
    || (anchored && (NOUN.test(t) || TECH.test(t) || (POSS.test(t) && TOPIC_VERB.test(t))))
    || (anchored && personalUnsupported(t, named))
    || (words <= 2 && NOUN.test(t));                                            // "Skills", "Contact info", "Resume"
  if (!onTopic) return "refuse";

  // 6. Personal details that are not in the portfolio.
  if (anchored && personalUnsupported(t, named)) return "none";

  // 7. Answerable.
  // "Does Zaeem know Tableau?" needs a real check by the model. Certifications are the exception: data.js answers that exactly.
  if (YESNO.test(t) && !/\bcertif|\bcertificates?\b/i.test(t)) return "ai";
  return named || POSS.test(t) || SECOND.test(t) || words <= 3 ? "local" : "ai";
}
