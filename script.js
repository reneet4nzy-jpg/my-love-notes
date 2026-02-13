const PASSWORD = "1234";

let spilled = false;
let lastOpenedPaper = null;

// Demo messages (repeat to 100). Replace with your real 100 later.
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

// PASSWORD
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

// JAR
jar.addEventListener("click", () => {
  if (spilled) return;
  spilled = true;

  if (jarTitle) jarTitle.style.display = "none";
  if (jarWrap) jarWrap.classList.add("tipped");

  setTimeout(() => {
    spillPhysicsThenPerfectLand();
  }, 450);
});

function spillPhysicsThenPerfectLand() {
  papersWrap.innerHTML = "";

  // make exactly 100 notes (repeat if needed)
  const pool = [];
  while (pool.length < 100) pool.push(...messages);
  pool.length = 100;

  const W = papersWrap.clientWidth;
  const H = papersWrap.clientHeight;

  // jar mouth position inside papers
  const papersRect = papersWrap.getBoundingClientRect();
  const jarRect = (jarWrap || jar).getBoundingClientRect();
  const mouthX = (jarRect.left + jarRect.width / 2) - papersRect.left + 45;
  const mouthY = (jarRect.top + jarRect.height / 2) - papersRect.top + 10;

  // measure real paper size (so floor is correct)
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

  // physics bounds relative to the “anchor point” (mouth)
  const minX = -mouthX + 10;
  const maxX = (W - PAPER_W) - mouthX - 10;
  const minY = -mouthY + 10;
  const maxY = (H - PAPER_H) - mouthY - 10;

  // physics settings (bouncy + lively)
  const gravity = 0.9;
  const friction = 0.986;
  const bounce = 0.88;

  const states = [];

  for (let i = 0; i < pool.length; i++) {
    const msg = pool[i];
    const preview = msg.slice(0, 22) + (msg.length > 22 ? "…" : "");

    const el = document.createElement("div");
    el.className = "paper flying";
    el.innerHTML = `<div class="preview">${escapeHtml(preview)}</div>`;

    // anchor at mouth
    el.style.left = mouthX + "px";
    el.style.top = mouthY + "px";

    // permanent tilt
    const tilt = rand(-8, 8);
    el.style.setProperty("--rot", `${tilt}deg`);
    el.style.setProperty("--tx", `0px`);
    el.style.setProperty("--ty", `0px`);

    el.addEventListener("click", () => openMessage(msg, el));
    papersWrap.appendChild(el);

    states.push({
      el,
      msg,
      rot: tilt,
      x: 0,
      y: 0,
      // pour out to the right with some variety
      vx: rand(7, 18) + Math.random(),
      vy: rand(-6, 6) + Math.random(),
      startAt: performance.now() + i * 8
    });
  }

  // Run physics for a while, then “magnet” into perfect grid slots
  const start = performance.now();
  const PHYS_MS = 2400;

  function tick(now) {
    const t = now - start;

    for (const s of states) {
      if (now < s.startAt) continue;

      s.vy += gravity;
      s.vx *= friction;
      s.vy *= friction;

      s.x += s.vx;
      s.y += s.vy;

      // bounce walls
      if (s.x < minX) { s.x = minX; s.vx *= -bounce; }
      if (s.x > maxX) { s.x = maxX; s.vx *= -bounce; }

      // bounce ceiling
      if (s.y < minY) { s.y = minY; s.vy *= -bounce; }

      // bounce floor (with a little “pop” so it visibly bounces)
      if (s.y > maxY) {
        s.y = maxY;
        s.vy *= -bounce;
        if (Math.abs(s.vy) < 2.2) s.vy = -rand(4, 10);
        s.vx += rand(-3, 3);
      }

      s.el.style.setProperty("--tx", `${s.x}px`);
      s.el.style.setProperty("--ty", `${s.y}px`);
      // keep tilt
      s.el.style.setProperty("--rot", `${s.rot}deg`);
    }

    if (t < PHYS_MS) {
      requestAnimationFrame(tick);
    } else {
      // perfect “landing” into grid slots
      magnetToGrid(states, mouthX, mouthY, PAPER_W, PAPER_H);
    }
  }

  requestAnimationFrame(tick);
}

function magnetToGrid(states, mouthX, mouthY, PAPER_W, PAPER_H) {
  // make scroll mode after landing (like before)
  // but we animate to the positions FIRST (so it looks perfect), then we swap to grid

  const gap = 14;

  // Choose column count:
  // - Desktop will naturally fit ~6
  // - If you want to FORCE 6 always, change cols = 6
  const cols = Math.max(2, Math.min(6, Math.floor((papersWrap.clientWidth - 36 + gap) / (PAPER_W + gap))));

  // Targets inside the papers box (top-left padding 18)
  const targets = states.map((s, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const tx = 18 + col * (PAPER_W + gap);
    const ty = 18 + row * (PAPER_H + gap);

    return {
      s,
      x: tx - mouthX,
      y: ty - mouthY
    };
  });

  // Smooth “magnet” slide into exact slots (still absolute)
  targets.forEach(({ s, x, y }, i) => {
    const delay = i * 6;
    setTimeout(() => {
      s.el.classList.remove("flying");
      // keep tilt
      s.el.style.setProperty("--tx", `${x}px`);
      s.el.style.setProperty("--ty", `${y}px`);
      s.el.style.setProperty("--rot", `${s.rot}deg`);
    }, delay);
  });

  // After they’re in place, switch to tray/grid for scrolling (no visual jump)
  setTimeout(() => {
    papersWrap.classList.add("tray");

    const grid = document.createElement("div");
    grid.className = "papersGrid";

    states.forEach((s) => {
      // grid handles position; keep tilt
      s.el.style.setProperty("--tx", "0px");
      s.el.style.setProperty("--ty", "0px");
      s.el.style.setProperty("--rot", `${s.rot}deg`);
      grid.appendChild(s.el);
    });

    papersWrap.innerHTML = "";
    papersWrap.appendChild(grid);
    papersWrap.scrollTop = 0;
  }, 1100);
}

// MODAL
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

// utils
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
