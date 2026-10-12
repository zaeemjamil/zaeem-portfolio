# Zaeem Jamil — Portfolio

A plain HTML/CSS/JS site (no build step, no framework). All content is in **`data.js`**.

Detailed beginner guide: **[PROJECTS.md](PROJECTS.md)** (add/edit projects).

## Folder structure
```
portfolio/
├── index.html          the page (structure + behaviour)
├── style.css            the design system (black / red / white)
├── data.js              ALL your content: links, profile, projects
├── api/chat.js          chatbot server route (Vercel runs this at /api/chat)
├── guard.js              shared refusal rules — used by BOTH the browser and api/chat.js, so they always agree
├── answers.js           shared router + quick answers built from data.js (browser and api/chat.js both call route())
├── tests/chat.test.js   chatbot regression tests — run with `npm test` (no API key needed)
├── vercel.json          gives api/chat.js a 30 s limit for slower free models
├── package.json         {"type":"module"} so api/chat.js can import data.js
├── .env.example         names of the environment variables (copy to .env; never commit real keys)
├── .gitignore
├── projects/             project thumbnails / screenshots
├── resume/               zaeem-jamil-resume.pdf lives here
├── README.md  PROJECTS.md
```
> `projects/` may gain more images over time; if a folder is ever missing after a fresh clone, just create it with that exact name.

## 1. Run the website
Browsers block `data.js` (and the separate `style.css`) when you double-click `index.html`, so use a tiny local server:
```
cd portfolio
npx serve .          # or: python3 -m http.server 8000
```
Open the address it prints (e.g. http://localhost:3000).

## 2. Change my name / bio / title
Open `data.js` → edit `PROFILE` (`name`, `title`, `intro`, `about`, `education`, `skills`, `experience`). Save, refresh. `about` is a list of short paragraphs — add or remove lines freely.
The title also appears in three fixed places in `index.html` (the page `<title>`, the `og:title` line, and the big hero line under your name) — search for `ML Engineer` and change all of them together if you ever change the title.

## 3. Add a project
1. Open `data.js`, find `PROJECTS`.
2. Copy one whole `{ … },` block and paste it at the end of the list.
3. Change `title`, `slug` (unique, lowercase-with-dashes) and `description`.
4. Set `image` (see step 4), `categories`, `tools`, `githubUrl`, and `liveUrl` if you have one.
5. Fill `overview`, `problem`, `approach`, `results` only with things that are really documented. Empty ones are hidden automatically, and so is the Live Demo button if `liveUrl` is empty.
6. Save, refresh. The project shell on the Projects section and its detail popup are both generated from this list — nothing else needs editing.

Full walkthrough: **[PROJECTS.md](PROJECTS.md)**.

## 4. Change a project thumbnail
Put the image in `projects/` (e.g. `projects/my-project.png`) and set `image: "/projects/my-project.png"`. More screenshots can go in `gallery: [...]` and appear in the detail popup.
The FNP and Taxi thumbnails already live in `projects/` as local files. StatFlow currently has no confirmed real screenshot, so its card shows a plain labelled placeholder instead of inventing one — replace it the same way once you have one.

## 5. GitHub / Live Demo links
Set `githubUrl` and `liveUrl` on the project. Leave `liveUrl: ""` and no Live Demo button is shown — only StatFlow currently has a real one.

## 6. Replace my resume
Your CV is already in place at **`resume/zaeem-jamil-resume.pdf`**. Both Resume buttons (navbar, mobile menu — there's intentionally none in the hero) link to that exact path. To update it later, overwrite that file with the same name — nothing else needs to change. If the file is ever missing, the Resume buttons show a clear message instead of a broken link.

## 7. Update social links
`data.js` → `LINKS` (`email`, `github`, `linkedin`, `fiverr`). The Contact section and footer are generated from the `CONNECT` list near the top of the script in `index.html` — if you add a new link to `LINKS`, add it to `CONNECT` too. There is intentionally no Medium, certifications or data-portfolio link in this version.

## 8–9. Configure the chatbot / environment variables
The ZJ Assistant is a floating chat panel: it only opens when a visitor clicks the round chat button at the bottom-right (it never opens by itself and takes no space in the page). The 4 chips under the greeting are shortcuts, not a limit — they disappear after the first message, and any question about Zaeem can be typed directly.
Both the browser and the server route call `route()` in `answers.js` (which uses `guard.js`), so the same message always gets the same decision and wording: a greeting, a refusal, "not in my portfolio", a quick answer from `data.js`, or — only when it genuinely needs it — the AI. Requests to *do* something (write code, essays, assignments, translate, solve), other people, general knowledge, and attempts to override the rules are refused even if the message mentions Zaeem or one of his projects, and they never reach the API. The server re-checks every message itself; it never trusts the browser.
1. Create an OpenRouter key.
2. Vercel → Project → Settings → Environment Variables: `OPENROUTER_API_KEY` (required). `OPENROUTER_MODEL` is optional — it defaults to `openrouter/free`, which lets OpenRouter route to whichever free-tier model is currently available, so the bot keeps working even if a specific free model is retired. Set this only to pin one model.
3. Redeploy. Locally: `npm i -g vercel`, copy `.env.example` to `.env`, run `vercel dev`.
4. If a visitor's question is about Zaeem but the knowledge in `data.js` doesn't cover it, the bot says "I don't have that information in my portfolio." It never guesses.
Without a key configured, refusals and quick answers still work; a question that needs the AI gets an honest "can't answer that right now" message (HTTP 503 from `/api/chat`), never a pretend answer. Never put a key in `index.html` or `data.js`.

**Tests:** `npm test` runs the chatbot regression tests (local router + `/api/chat` with `fetch` mocked). `npm run check` syntax-checks the JS files.

## 10. Deploy to GitHub
```
git init && git add . && git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/zaeemjamil/<repo-name>.git
git push -u origin main
```
GitHub Pages can host the site itself, but **not** `/api/chat` (the AI fallback). Use Vercel for that part.

## 11. Deploy to Vercel
vercel.com → Add New → Project → import the GitHub repo → Framework "Other" → Deploy. Then add the environment variables above and redeploy.
