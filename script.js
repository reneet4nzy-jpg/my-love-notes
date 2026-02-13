const PASSWORD = "1234";

let spilled = false;
let lastOpenedPaper = null;

const messages = [
  "You are my favourite hello and my hardest goodbye.",
  "I love the way your eyes soften when you smile.",
  "You make ordinary days feel like magic.",
  "Thank you for choosing me.",
  "You are my calm in every storm.",
  "I still get excited every time I see your name.",
  "You feel like home.",
  "I would choose you in every lifetime.",
  "You make my world warmer.",
  "Your laugh is my favourite sound."
];

// DOM
const gate = document.getElementById("gate");
const app = document.getElementById("app");
const pw = document.getElementById("pw");
const enterBtn = document.getElementById("enterBtn");
const gateMsg = document.getElementById("gateMsg");

const jar = document.getElementById("jar");
const jarWrap = document.getElementById("jarWrap");
const jarTitle = document.getElementById("jarTitle");

const papersWrap = document.getElementById("papers");

const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

modal.classList.add("hidden");

// Password gate
enterBtn.addEventListener("click", () => {
  if (pw.value === PASSWORD) {
    gate.classList.add("hidden");
    app.classList.remove("hidden");
  } else {
    gateMsg.textContent = "typo perchance? insert sad hampter";
  }
});
pw.addEventListener("keydown", (e) => {
  if (e.key === "Enter") enterBtn.click();
});

// Jar click
jar.addEventListener("click", () => {
  if (spilled) return;
  spilled = true;

  if (jarTitle) jarTitle.style.display = "none";
  if (jarWrap) jarWrap.classList.add("tipped");

  setTimeout(() => spillPhysicsThenSettle(), 450);
});

function spillPhysicsThenSettle() {
  papersWrap.innerHTML = "";

  // Build exactly 100 notes (repeat demo messages for now)
  const pool = [];
  while (pool.length < 100) pool.push(...messages);
  pool.length = 100;

  // Container size
  const W = papersWrap.clientWidth;
  const H = papersWrap.clientHeight;

  // Jar mouth position INSIDE papers (container coords)
  const papersRect = papersWrap.getBoundingClientRect();
  const jarRect = (jarWrap || jar).getBoundingClientRect();
  const mouthX = (jarRect.left + jarRect.width / 2) - papersRect.left + 45;
  const mouthY = (jarRect.top + jarRect.height / 2) - papersRect.top + 10;

  // Measure real paper size
  const temp = document.createElement("div");
  temp.className = "paper";
  temp.style.left = "0px";
  temp.style.top = "0px";
  temp.style.opacity = "0";
  temp.innerHTML = `<div class="preview">test</div>`;
  papersWrap.appendChild(temp);
  const PAPER_W = temp.offsetWidth || 140;
  const PAPER_H = temp.offsetHeight || 96;
  temp.remove();

  // Physics (container coords: x,y are absolute inside papers)
  const gravity = 0.95;
  const friction = 0.988;
  const bounce = 0.90;

  const states = [];

  for (let i = 0; i < pool.length; i++) {
    const msg = pool[i];
    const preview = msg.slice(0, 22) + (msg.length > 22 ? "…" : "");

    const el = document.createElement("div");
    el.className = "paper flying";
    el.innerHTML = `<div class="preview">${escapeHtml(preview)}</div>`;

    // IMPORTANT: we now position papers using absolute container coords,
    // so left/top of element is 0,0 and we move with --tx/--ty only.
    el.style.left = "0px";
    el.style.top = "0px";

    const rot = rand(-25, 25);
    el.style.setProperty("--rot", `${rot}deg`);
    el.style.setProperty("--tx", `${mouthX}px`);
    el.style.setProperty("--ty", `${mouthY}px`);

    el.addEventListener("click", () => openMessage(msg, el));
    papersWrap.appendChild(el);

    states.push({
      el,
      rot,
      msg,
      x: mouthX,
      y: mouthY,
      vx: rand(8, 18) + Math.random(),
      vy: rand(-6, 8) + Math.random(),
      startAt: performance.now() + i * 8
    });
  }

  const start = performance.now();
  const PHYS_MS = 2600;

  function tick(now) {
    const t = now - start;

    for (const s of states) {
      if (now < s.startAt) continue;

      s.vy += gravity;

      s.vx *= friction;
      s.vy *= friction;

      s.x += s.vx;
      s.y += s.vy;

      // Recalculate actual box size every frame
const rect = papersWrap.getBoundingClientRect();
const minX = 8;
const maxX = rect.width - PAPER_W - 8;
const minY = 8;
const maxY = rect.height - PAPER_H - 8;

// Wall bounce
if (s.x < minX) { s.x = minX; s.vx *= -bounce; }
if (s.x > maxX) { s.x = maxX; s.vx *= -bounce; }

// Ceiling bounce
if (s.y < minY) { s.y = minY; s.vy *= -bounce; }

// TRUE bottom bounce
if (s.y > maxY) {
  s.y = maxY;
  s.vy *= -bounce;

  // stronger visible bounce
  if (Math.abs(s.vy) < 3) s.vy = -rand(6, 12);
}

        // pop so it visibly bounces
        if (Math.abs(s.vy) < 2.2) s.vy = -rand(4, 10);

        // scatter
        s.vx += rand(-3, 3);
      }

      s.el.style.setProperty("--tx", `${s.x}px`);
      s.el.style.setProperty("--ty", `${s.y}px`);
      s.el.style.setProperty("--rot", `${s.rot}deg`);
    }

    if (t < PHYS_MS) requestAnimationFrame(tick);
    else settleIntoGrid(states, PAPER_W, PAPER_H);
  }

  requestAnimationFrame(tick);
}

function settleIntoGrid(states, PAPER_W, PAPER_H) {
  const gap = 14;

  // --- Column rules (NO 5->6 jump on laptop) ---
  // Desktop/laptop: 6 columns always
  // Phones: 2 cols, small tablets: 3 cols
  const w = papersWrap.clientWidth;
  let cols = 6;
  if (w < 520) cols = 2;
  else if (w < 820) cols = 3;
  else cols = 6;

  states.forEach((s, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const tx = 18 + col * (PAPER_W + gap);
    const ty = 18 + row * (PAPER_H + gap);

    const finalRot = rand(-7, 7);
    s.finalRotation = finalRot;

    setTimeout(() => {
      s.el.classList.remove("flying");
      s.el.style.setProperty("--tx", `${tx}px`);
      s.el.style.setProperty("--ty", `${ty}px`);
      s.el.style.setProperty("--rot", `${finalRot}deg`);
    }, i * 6);
  });

  setTimeout(() => convertToScrollableGrid(states), 1200);
}

function convertToScrollableGrid(states) {
  papersWrap.classList.add("tray");

  const grid = document.createElement("div");
  grid.className = "papersGrid";

  states.forEach((s) => {
    s.el.style.setProperty("--tx", `0px`);
    s.el.style.setProperty("--ty", `0px`);
    s.el.style.setProperty("--rot", `${s.finalRotation ?? rand(-7, 7)}deg`);
    grid.appendChild(s.el);
  });

  papersWrap.innerHTML = "";
  papersWrap.appendChild(grid);
  papersWrap.scrollTop = 0;
}

// Modal
function openMessage(text, paperEl) {
  if (lastOpenedPaper && lastOpenedPaper !== paperEl) {
    lastOpenedPaper.classList.remove("opened");
    lastOpenedPaper.style.opacity = 1;
  }

  lastOpenedPaper = paperEl;
  paperEl.classList.add("opened");
  paperEl.style.opacity = 0.9;

  modalText.textContent = text;
  modal.classList.remove("hidden");
}

closeModal.addEventListener("click", closeModalFn);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModalFn();
});

function closeModalFn() {
  modal.classList.add("hidden");
  modalText.textContent = "";
  if (lastOpenedPaper) {
    lastOpenedPaper.classList.remove("opened");
    lastOpenedPaper.style.opacity = 1;
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    "\"":"&quot;",
    "'":"&#39;"
  }[c]));
}
