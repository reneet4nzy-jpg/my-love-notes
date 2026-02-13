const PASSWORD = "1234";

let spilled = false;
let lastOpenedPaper = null;

const messages = [
  "You are my favourite hello and my hardest goodbye.",
  "I love the way your eyes soften when you smile.",
  "You make ordinary days feel like magic.",

  "U miss me but I’m busy.\n\nHii babyy, I’m sorry. I must be busy for you to be here, but scroll around here until I’m back?\n\nI put little bits of me in all of these, so this might as well count as my presence.\n\nEnjoy scrolling, my love.",

  "Your laugh is my favourite sound."
];

/* ================= DOM ================= */

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

/* ================= PASSWORD ================= */

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

/* ================= JAR CLICK ================= */

jar.addEventListener("click", () => {
  if (spilled) return;
  spilled = true;

  if (jarTitle) jarTitle.style.display = "none";
  if (jarWrap) jarWrap.classList.add("tipped");

  if (openWhenText) {
    openWhenText.classList.remove("hidden");
    setTimeout(() => {
      openWhenText.classList.add("show");
    }, 50);
  }

  setTimeout(() => spillPhysicsThenOrganize(), 450);
});

/* ================= PHYSICS ================= */

function spillPhysicsThenOrganize() {
  papersWrap.innerHTML = "";

  const pool = [];
  while (pool.length < 100) pool.push(...messages);
  pool.length = 100;

  const papersRect = papersWrap.getBoundingClientRect();
  const jarRect = (jarWrap || jar).getBoundingClientRect();

  const mouthX = (jarRect.left + jarRect.width / 2) - papersRect.left + 45;
  const mouthY = (jarRect.top + jarRect.height / 2) - papersRect.top + 10;

  const temp = document.createElement("div");
  temp.className = "paper";
  temp.style.opacity = "0";
  temp.innerHTML = `<div class="preview">test</div>`;
  papersWrap.appendChild(temp);
  const PAPER_W = temp.offsetWidth || 140;
  const PAPER_H = temp.offsetHeight || 96;
  temp.remove();

  const gravity = 0.95;
  const friction = 0.988;
  const bounce = 0.9;

  const states = [];

  for (let i = 0; i < pool.length; i++) {
    const msg = pool[i];
    const preview = msg.slice(0, 22) + (msg.length > 22 ? "…" : "");

    const el = document.createElement("div");
    el.className = "paper flying";
    el.innerHTML = `<div class="preview">${escapeHtml(preview)}</div>`;

    const rot = rand(-25, 25);

    el.style.setProperty("--tx", `${mouthX}px`);
    el.style.setProperty("--ty", `${mouthY}px`);
    el.style.setProperty("--rot", `${rot}deg`);

    el.addEventListener("click", () => openMessage(msg, el));
    papersWrap.appendChild(el);

    states.push({
      el,
      rot,
      x: mouthX,
      y: mouthY,
      vx: rand(8, 18),
      vy: rand(-6, 8),
      locked: false
    });
  }

  const PHYS_DURATION = 2200;
  const start = performance.now();

  function tick(now) {
    const rect = papersWrap.getBoundingClientRect();
    const minX = 8;
    const maxX = rect.width - PAPER_W - 8;
    const minY = 8;
    const maxY = rect.height - PAPER_H - 8;

    for (const s of states) {
      if (s.locked) continue;

      s.vy += gravity;
      s.vx *= friction;
      s.vy *= friction;

      s.x += s.vx;
      s.y += s.vy;

      if (s.x < minX) { s.x = minX; s.vx *= -bounce; }
      if (s.x > maxX) { s.x = maxX; s.vx *= -bounce; }

      if (s.y < minY) { s.y = minY; s.vy *= -bounce; }

      if (s.y > maxY) {
        s.y = maxY;
        s.vy *= -bounce;
        if (Math.abs(s.vy) < 3) s.vy = -rand(6, 12);
      }

      s.el.style.setProperty("--tx", `${s.x}px`);
      s.el.style.setProperty("--ty", `${s.y}px`);
    }

    if (now - start < PHYS_DURATION) {
      requestAnimationFrame(tick);
    } else {
      organizeIntoGrid(states, PAPER_W, PAPER_H);
    }
  }

  requestAnimationFrame(tick);
}

/* ================= ORGANIZE NATURALLY ================= */

function organizeIntoGrid(states, PAPER_W, PAPER_H) {
  const gap = 14;

  const w = papersWrap.clientWidth;
  let cols = 6;
  if (w < 520) cols = 2;
  else if (w < 820) cols = 3;

  states.forEach((s, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);

    s.slotX = 18 + col * (PAPER_W + gap);
    s.slotY = 18 + row * (PAPER_H + gap);
  });

  const magnet = 0.08;
  const lockDist = 6;

  function magnetLoop() {
    let allLocked = true;

    for (const s of states) {
      if (s.locked) continue;

      const dx = s.slotX - s.x;
      const dy = s.slotY - s.y;

      const dist = Math.sqrt(dx * dx + dy * dy);

      s.vx += dx * magnet;
      s.vy += dy * magnet;

      s.x += s.vx;
      s.y += s.vy;

      s.vx *= 0.85;
      s.vy *= 0.85;

      s.el.style.setProperty("--tx", `${s.x}px`);
      s.el.style.setProperty("--ty", `${s.y}px`);

      if (dist < lockDist && Math.abs(s.vx) < 1 && Math.abs(s.vy) < 1) {
        s.x = s.slotX;
        s.y = s.slotY;
        s.vx = 0;
        s.vy = 0;
        s.locked = true;

        s.el.style.setProperty("--tx", `${s.x}px`);
        s.el.style.setProperty("--ty", `${s.y}px`);
      } else {
        allLocked = false;
      }
    }

    if (!allLocked) {
      requestAnimationFrame(magnetLoop);
    } else {
      enableScrollMode(states);
    }
  }

  requestAnimationFrame(magnetLoop);
}

/* ================= SCROLL ACTIVATION ================= */

function enableScrollMode(states) {
  papersWrap.classList.add("tray");

  const grid = document.createElement("div");
  grid.className = "papersGrid";

  states.forEach(s => {
    s.el.style.setProperty("--tx", "0px");
    s.el.style.setProperty("--ty", "0px");
    grid.appendChild(s.el);
  });

  papersWrap.innerHTML = "";
  papersWrap.appendChild(grid);
  papersWrap.scrollTop = 0;
}

/* ================= MODAL ================= */

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

/* ================= UTILS ================= */

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
