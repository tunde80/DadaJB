/* ============================================================
   Dr. Dada Joseph Babatunde — site logic
   Loads content from /data/*.json and renders it, so the site
   owner can update everything by editing JSON, never HTML.
   ============================================================ */

// ---- Small helpers ----
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error(`Could not load ${path}:`, err);
    return null;
  }
}

/* ============================================================
   PROFILE — bio, about, teaching, contact
   ============================================================ */
function renderProfile(p) {
  if (!p) return;

  // Hero + nav brand
  const first = p.name.replace(/^Dr\.\s*/, "").split(" ")[0];
  setText("[data-bind='name']", p.name);
  setText("[data-bind='role']", p.role);
  setText("[data-bind='institution']", p.institution);
  setText("[data-bind='tagline']", p.tagline);

  // About paragraphs
  const about = $("[data-bind='about']");
  if (about && Array.isArray(p.about)) {
    about.innerHTML = "";
    p.about.forEach(par => about.appendChild(el("p", null, esc(par))));
  }

  // Spec card stats
  const specs = $("[data-bind='stats']");
  if (specs && Array.isArray(p.stats)) {
    specs.innerHTML = "";
    p.stats.forEach(s => {
      const row = el("div", "spec-row");
      row.appendChild(el("span", "k", esc(s.label)));
      row.appendChild(el("span", "v", esc(s.value)));
      specs.appendChild(row);
    });
  }

  // Teaching
  const teach = $("[data-bind='teaching']");
  if (teach && Array.isArray(p.teaching)) {
    teach.innerHTML = "";
    p.teaching.forEach(t => {
      const card = el("div", "interest");
      card.appendChild(el("h3", null, esc(t.course)));
      card.appendChild(el("p", null, esc(t.detail)));
      teach.appendChild(card);
    });
  }

  // Contact
  if (p.contact) {
    const email = $("[data-bind='email']");
    if (email) { email.textContent = p.contact.email; email.href = `mailto:${p.contact.email}`; }
    setText("[data-bind='location']", p.contact.location);

    const links = $("[data-bind='links']");
    if (links && Array.isArray(p.contact.links)) {
      links.innerHTML = "";
      p.contact.links.forEach(l => {
        const chip = el("a", "link-chip");
        chip.innerHTML = `<span>${esc(l.label)}</span><span class="arrow">&rarr;</span>`;
        if (l.url) { chip.href = l.url; chip.target = "_blank"; chip.rel = "noopener"; }
        else { chip.setAttribute("aria-disabled", "true"); chip.href = "#"; }
        links.appendChild(chip);
      });
    }
  }

  // Footer year + name
  setText("[data-bind='year']", new Date().getFullYear());
  setText("[data-bind='footer-name']", p.name);
  document.title = `${p.name} — Physics & Electronics`;
}

/* ============================================================
   RESEARCH — interests + publications
   ============================================================ */
function renderResearch(r) {
  if (!r) return;

  const interests = $("[data-bind='interests']");
  if (interests && Array.isArray(r.interests)) {
    interests.innerHTML = "";
    r.interests.forEach(i => {
      const card = el("div", "interest");
      card.appendChild(el("h3", null, esc(i.title)));
      card.appendChild(el("p", null, esc(i.description)));
      interests.appendChild(card);
    });
  }

  const pubs = $("[data-bind='publications']");
  if (pubs && Array.isArray(r.publications)) {
    pubs.innerHTML = "";
    r.publications.forEach(pub => {
      const row = el("div", "pub");
      row.appendChild(el("div", "yr", esc(pub.year)));
      const cite = el("div", "cite");
      cite.appendChild(el("div", "t", `${esc(pub.authors)} ${esc(pub.title)}.`));
      cite.appendChild(el("div", "m", esc(pub.venue)));
      if (pub.link) {
        const a = el("a", null, "View &rarr;");
        a.href = pub.link; a.target = "_blank"; a.rel = "noopener";
        cite.appendChild(a);
      }
      row.appendChild(cite);
      pubs.appendChild(row);
    });
  }
}

/* ============================================================
   PORTFOLIO — projects with category filtering
   ============================================================ */
let ALL_PROJECTS = [];

function renderProjects(data) {
  if (!data || !Array.isArray(data.projects)) return;
  ALL_PROJECTS = data.projects;

  // Build filter buttons from unique categories
  const cats = ["All", ...new Set(ALL_PROJECTS.map(p => p.category).filter(Boolean))];
  const filters = $("[data-bind='filters']");
  if (filters) {
    filters.innerHTML = "";
    cats.forEach((c, i) => {
      const b = el("button", "filter-btn" + (i === 0 ? " active" : ""), esc(c));
      b.dataset.cat = c;
      b.addEventListener("click", () => {
        $$(".filter-btn", filters).forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        drawProjects(c);
      });
      filters.appendChild(b);
    });
  }
  drawProjects("All");
}

function drawProjects(cat) {
  const grid = $("[data-bind='projects']");
  if (!grid) return;
  grid.innerHTML = "";
  const list = cat === "All" ? ALL_PROJECTS : ALL_PROJECTS.filter(p => p.category === cat);

  list.forEach(p => {
    const card = el("article", "project");

    const top = el("div", "project-top");
    top.appendChild(el("span", "project-year", esc(p.year)));
    if (p.status) {
      const s = el("span", "project-status", esc(p.status));
      s.dataset.s = p.status;
      top.appendChild(s);
    }
    card.appendChild(top);

    const body = el("div", "project-body");
    body.appendChild(el("h3", null, esc(p.title)));
    if (p.category) body.appendChild(el("div", "cat", esc(p.category)));
    if (p.summary)  body.appendChild(el("p", "desc", esc(p.summary)));

    if (Array.isArray(p.highlights) && p.highlights.length) {
      const ul = el("ul", "hl");
      p.highlights.forEach(h => ul.appendChild(el("li", null, esc(h))));
      body.appendChild(ul);
    }

    if (Array.isArray(p.tags) && p.tags.length) {
      const tr = el("div", "tag-row");
      p.tags.forEach(t => tr.appendChild(el("span", "tag", esc(t))));
      body.appendChild(tr);
    }

    if (p.link) {
      const a = el("a", "project-link", "View project &rarr;");
      a.href = p.link; a.target = "_blank"; a.rel = "noopener";
      body.appendChild(a);
    }

    card.appendChild(body);
    grid.appendChild(card);
  });
}

/* ============================================================
   Utilities: text binding, nav, oscilloscope, reveals
   ============================================================ */
function setText(sel, val) {
  const n = $(sel);
  if (n != null && val != null) n.textContent = val;
}

function initNav() {
  const toggle = $(".nav-toggle");
  const links = $(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$(".nav-links a").forEach(a =>
      a.addEventListener("click", () => links.classList.remove("open")));
  }
}

function initScope() {
  const path = $(".wave-path");
  if (!path) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Build a damped multi-tone waveform across a 0..600 x, 0..300 y box
  const W = 600, H = 300, mid = H / 2;
  let d = "";
  for (let x = 0; x <= W; x += 3) {
    const t = x / W;
    const y = mid
      + Math.sin(t * Math.PI * 6) * 70 * Math.exp(-t * 0.15)
      + Math.sin(t * Math.PI * 22) * 14;
    d += (x === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
  }
  path.setAttribute("d", d);

  if (!reduce) {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    path.getBoundingClientRect(); // reflow
    path.style.transition = "stroke-dashoffset 2.6s ease-out";
    path.style.strokeDashoffset = "0";
  }
}

function initReveals() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window) || !items.length) {
    items.forEach(i => i.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(i => io.observe(i));
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  initNav();
  initScope();

  const [profile, research, projects] = await Promise.all([
    loadJSON("data/profile.json"),
    loadJSON("data/research.json"),
    loadJSON("data/projects.json"),
  ]);

  renderProfile(profile);
  renderResearch(research);
  renderProjects(projects);

  initReveals();
});
