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

## 2. Change my name / bio
Open `data.js` → edit `PROFILE` (`name`, `intro`, `about`, `education`, `skills`, `experience`). Save, refresh.

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
Your CV is already in place at **`resume/zaeem-jamil-resume.pdf`**. Every Resume button (navbar, mobile menu, hero) links to that exact path. To update it later, overwrite that file with the same name — nothing else needs to change. If the file is ever missing, the Resume buttons show a clear message instead of a broken link.

## 7. Update social links
`data.js` → `LINKS` (`email`, `github`, `linkedin`, `fiverr`, `medium`). There is intentionally no certifications or data-portfolio link in this version.

## 8–9. Configure the chatbot / environment variables
The ZJ Assistant always answers common questions from `data.js` in the browser, and refuses anything not about Zaeem. For free-form questions it calls `/api/chat`, which asks OpenRouter using only `data.js` as its knowledge — never outside knowledge.
1. Create an OpenRouter key.
2. Vercel → Project → Settings → Environment Variables: `OPENROUTER_API_KEY` (required), `OPENROUTER_MODEL` (optional).
3. Redeploy. Locally: `npm i -g vercel`, copy `.env.example` to `.env`, run `vercel dev`.
Without a key configured, unknown-but-relevant questions get "I don't have that information in my portfolio." Never put a key in `index.html` or `data.js`.

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
