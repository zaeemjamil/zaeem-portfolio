# How to add or edit a project

**Everything about your projects lives in one file: `data.js`**, in the list called `PROJECTS`.
You never edit `index.html` for a project. The site reads the list and builds the cards, the filter buttons and the detail popup by itself.

## Add a new project (copy → paste → change)
1. Open `data.js` in any text editor (VS Code, Notepad).
2. Find `export const PROJECTS = [`. Each project is one block that starts with `{` and ends with `},`.
3. Copy one whole block and paste it right after the last block, before the closing `];`.
4. Change the text between the quotes. Keep the quotes and commas.
5. Save, refresh the page (or push to GitHub/Vercel). The new card appears.

| Field | What to write |
|---|---|
| `title` | The project name shown on the card. |
| `slug` | A short unique id: lowercase, dashes, no spaces (e.g. `sales-dashboard`). The chatbot also uses its first word to recognise the project. |
| `categories` | Short tags shown under the project number on the card, e.g. `["Python", "Statistics"]`. Only the first three are shown. |
| `description` | One or two sentences for the card. |
| `image` | Thumbnail path (see below). |
| `tools` | Tools you really used, e.g. `["Python", "Pandas"]`. |
| `githubUrl` | Your repository link. |
| `liveUrl` | A working live demo link. |
| `caseStudyUrl` | A case-study link, if one really exists. |
| `overview`, `problem`, `approach`, `results` | Text for the detail popup. `approach` and `results` are lists: `["first point", "second point"]`. |

Write only what is true and documented. Do not add numbers you cannot show.

## Add a thumbnail
1. Put the image file in the `projects/` folder, e.g. `projects/sales-dashboard.png`.
2. Set `image: "/projects/sales-dashboard.png"`.
3. Optional extra screenshots go in `gallery: ["/projects/one.png", "/projects/two.png"]` and appear in the popup.
4. Add `imageAlt: "Short description of the image"` for accessibility.

If `image` is empty (`""`), the card shows a plain workflow placeholder from `placeholder: ["Step 1", "Step 2"]`. It is labelled "not a screenshot".

## Add GitHub and Live Demo links
Paste the full address into `githubUrl` and `liveUrl` (starting with `https://`).

## Optional fields
Leave a field as `""` (text) or `[]` (list) and it is simply hidden. No Live Demo link → no Live Demo button. No `problem` → no "Problem" section in the popup.

## The assistant recognises new projects automatically
ZJ Assistant answers "what is X" questions by matching the first word of a project's `title` or `slug` against what was asked, so a new project is answerable by name as soon as it's added — nothing to wire up separately.

## Remove or reorder
Delete a whole block to remove a project. Cards show in the same order as the list.
