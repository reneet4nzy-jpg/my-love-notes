// ===== REPLACE YOUR ENTIRE script.js WITH THIS =====

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
  jarWrap.classList.add("tipped");

  setTimeout(() => spillPhysicsThenSettle(), 450);
});

function spillPhysicsThenSettle() {
  papersWrap.innerHTML = "";

  // build exactly 100 notes (repeat demo messages if needed)
  const pool = [];
  while (pool.length < 100) pool.push(...messages);
  pool.length = 100;

  const W = papersWrap.clientWidth;
  const H = papersWrap.clientHeight;

  // jar mouth position inside papers
  const papersRect = papersWrap.getBoundingClientRect();
  const jarRect = jarWrap.getBoundingClientRect();
  const mouthX = (jarRect.left + jarRect.width / 2) - papersRect.left + 45;
  const mouthY = (jarRect.top + jarRect.height / 2) - papersRect.top + 10;

  const PAPER_W = 140;
  const PAPER_H = 96;

  const states = [];

  for (let i = 0; i < pool.length; i++) {
    const msg = pool[i];
    const preview = msg.slice(0, 22) + (msg.length > 22 ? "…" : "");

    const p = document.createElement("div");
    p.className = "paper flying";
    p.innerHTML = `<div class="preview">${escapeHtml(preview)}</div>`;

    p.style.left = mouthX + "px";
    p.style.top = mouthY + "px";

    // initial CSS vars
    p.style.setProperty("--tx", `0px`);
    p.style.setProperty("--ty", `0px`);

    p.addEventListener("click", () => openMessage(msg, p));
    papersWrap.appendChild(p);

    const rot = rand(-25, 25);

    const s = {
      el: p,
      rot,
      x: 0,
      y: 0,
      vx: rand(5, 12) + Math.random(),
      vy: rand(-3, 4) + Math.random(),
      startAt: performance.now() + i * 12
    };

    // set initial rotation var
    p.style.setProperty("--rot", `${rot}deg`);

    states.push(s);
  }

  const gravity = 0.38;
  const friction = 0.992;
  const bounce = 0.72;

  const minX = -mouthX + 10;
  const maxX = (W - PAPER_W) - mouthX - 10;
  const minY = -mouthY + 10;
  const maxY = (H - PAPER_H) - mouthY - 10;

  const start = performance.now();
  const PHYS_MS = 2200;

  function physicsTick(now) {
    const t = now - start;

    for (const s of states) {
      if (now < s.startAt) continue;

      s.vy += gravity;
      s.vx *= friction;
      s.vy *= friction;

      s.x += s.vx;
      s.y += s.vy;

      if (s.x < minX) { s.x = minX; s.vx *= -bounce; }
      if (s.x > maxX) { s.x = maxX; s.vx *= -bounce; }
      if (s.y < minY) { s.y = minY; s.vy *= -bounce; }
      if (s.y > maxY) { s.y = maxY; s.vy *= -bounce; }

      // update CSS vars (keeps tilt!)
      s.el.style.setProperty("--tx", `${s.x}px`);
      s.el.style.setProperty("--ty", `${s.y}px`);
      s.el.style.setProperty("--rot", `${s.rot}deg`);
    }

    if (t < PHYS_MS) {
      requestAnimationFrame(physicsTick);
    } else {
      settleIntoGrid(states, mouthX, mouthY);
    }
  }

  requestAnimationFrame(physicsTick);
}

function settleIntoGrid(states, mouthX, mouthY) {
  const gap = 14;
  const tileW = 140;
  const tileH = 96;

  const usableW = papersWrap.clientWidth - 36;
  const cols = Math.max(1, Math.floor((usableW + gap) / (tileW + gap)));

  const targets = states.map((s, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const tx = 18 + col * (tileW + gap);
    const ty = 18 + row * (tileH + gap);

    const finalRot = rand(-7, 7);

    return { s, x: tx - mouthX, y: ty - mouthY, rot: finalRot };
  });

  for (const { s } of targets) {
    s.el.classList.remove("flying");
    s.el.classList.add("settling");
    s.el.style.opacity = 1;
  }

  targets.forEach(({ s, x, y, rot }, i) => {
    const delay = i * 6;
    setTimeout(() => {
      s.el.style.setProperty("--tx", `${x}px`);
      s.el.style.setProperty("--ty", `${y}px`);
      s.el.style.setProperty("--rot", `${rot}deg`);
      s.finalRotation = rot;
    }, delay);
  });

  setTimeout(() => convertToScrollableGrid(states), 1050);
}

function convertToScrollableGrid(states) {
  papersWrap.classList.add("tray");

  const grid = document.createElement("div");
  grid.className = "papersGrid";

  states.forEach(({ el, finalRotation }) => {
    el.classList.remove("settling");

    const rot = (typeof finalRotation === "number") ? finalRotation : rand(-7, 7);
    el.style.setProperty("--tx", `0px`);
    el.style.setProperty("--ty", `0px`);
    el.style.setProperty("--rot", `${rot}deg`);

    grid.appendChild(el);
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
  paperEl.style.opacity = 0.85;

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
