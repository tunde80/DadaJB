# Dr. Dada Joseph Babatunde — Personal Website

A professional personal site for a physicist and electronics maker, built as a
static website and ready to host free on GitHub Pages. The design is an
"instrument panel" theme — a printed-circuit-board palette with an animated
oscilloscope hero — chosen to reflect the owner's dual identity in physics and
electronics.

**The key feature:** all content lives in three plain-text data files in the
`data/` folder. You update the site by editing those files — you never need to
touch HTML or CSS.

---

## 1. Files at a glance

```
dada-site/
├── index.html          The page structure (rarely needs editing)
├── 404.html            Friendly "page not found" screen
├── css/style.css       All styling
├── js/main.js          Loads your data and builds the page
├── data/
│   ├── profile.json    Your name, bio, teaching, contact, social links
│   ├── research.json   Research interests and publications
│   └── projects.json   Your portfolio  ← edit this most often
├── images/             (optional) put project photos here
├── .nojekyll           Tells GitHub Pages to serve files as-is
└── README.md           This file
```

---

## 2. Publish it on GitHub Pages (one-time setup)

1. Create a free account at <https://github.com> if you don't have one.
2. Create a new **public** repository. If you name it
   `yourusername.github.io`, your site will live at
   `https://yourusername.github.io`. Any other name (e.g. `website`) puts it at
   `https://yourusername.github.io/website`.
3. Upload **the contents** of the `dada-site` folder (not the folder itself):
   click **Add file → Upload files**, drag everything in, and **Commit**.
   Make sure the hidden `.nojekyll` file is included (see the note below).
4. Go to **Settings → Pages**. Under **Build and deployment**, set
   **Source** to *Deploy from a branch*, choose the **main** branch and the
   **/(root)** folder, and click **Save**.
5. Wait about a minute, then refresh. GitHub will show
   *"Your site is live at ..."* with your link.

> **Seeing the hidden file:** files beginning with a dot are hidden by default.
> On Windows, tick *Hidden items* in File Explorer's View tab. On Mac, press
> `Cmd + Shift + .` in Finder. If `.nojekyll` still doesn't upload, on GitHub
> click **Add file → Create new file**, type `.nojekyll` as the name, leave it
> empty, and commit.

---

## 3. Update your content (the part you'll use often)

All edits happen on GitHub: open the file, click the **pencil icon**, make your
change, and click **Commit changes**. The site updates within a minute.

### Add a new portfolio project

Open `data/projects.json`. Copy one existing block between the `{ }` braces and
paste it as a new entry, then edit the values. A project looks like this:

```json
{
  "title": "My New Device",
  "year": "2025",
  "category": "Sensing",
  "status": "Prototype",
  "summary": "One or two sentences describing what it is and what it does.",
  "tags": ["Arduino", "Bluetooth", "3D Printed"],
  "highlights": [
    "First notable thing about it",
    "Second notable thing about it"
  ],
  "link": "https://github.com/you/project-repo",
  "image": ""
}
```

Field notes:
- **status** — use `Prototype`, `Deployed`, or `Complete`. Each gets its own
  colour automatically. Any other word still works and shows in teal.
- **category** — projects with the same category are grouped under the filter
  buttons at the top of the portfolio. New categories create new filter buttons
  automatically.
- **link** — leave as `""` (empty) if there's nothing to link to yet; the
  "View project" link simply won't appear.
- **Commas matter.** Put a comma between each project block, but not after the
  last one. If the site ever looks blank after an edit, a missing or extra
  comma is almost always the cause — paste your file into
  <https://jsonlint.com> to find it.

### Edit your bio, teaching, or contact details

Open `data/profile.json` and edit the text in quotes. To activate a social
link, paste its web address into the empty `"url": ""`. Links left empty appear
greyed out and disabled.

### Add a publication or research interest

Open `data/research.json` and edit the `interests` or `publications` lists,
following the same copy-a-block pattern.

---

## 4. Add project photos (optional)

1. Put an image file in the `images/` folder (e.g. `smartwatch.jpg`).
2. In `projects.json`, set that project's `"image"` to `"images/smartwatch.jpg"`.

(Photos are optional; the cards look complete without them.)

---

## 5. Preview locally before publishing (optional)

If you'd like to see changes on your own computer first, open a terminal in the
`dada-site` folder and run:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000> in your browser. (Opening `index.html`
directly by double-clicking will **not** load the data files — a local server
is needed because browsers block file-to-file data loading for security.)

---

## 6. Customising the look (optional)

Colours and fonts are defined once at the top of `css/style.css` in the
`:root` block. For example, to change the accent colour, edit the `--copper`
value. The comments explain what each colour is for.

---

## Design credits

- **Typefaces:** Space Grotesk (display), Inter (body), JetBrains Mono
  (labels and data) — all free via Google Fonts.
- **Theme:** custom "instrument panel" / printed-circuit-board identity.

Built to be maintained by its owner. Enjoy your new site.
