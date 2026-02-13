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

  // build 100 notes (repeat demo messages for now)
  const pool = [];
  while (pool.length < 100) pool.push(...messages);
  pool.length = 100;

  // get container size
  const W = papersWrap.clientWidth;
  const H = papersWrap.clientHeight;

  // jar mouth position inside papers
  const papersRect = papersWrap.getBoundingClientRect();
  const jarRect = jarWrap.getBoundingClientRect();
  const mouthX = (jarRect.left + jarRect.width / 2) - papersRect.left + 45;
  const mouthY = (jarRect.top + jarRect.height / 2) - papersRect.top + 10;

  // Create ONE temp paper to measure real size
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

  // Physics settings (bouncy!)
  const gravity = 0.95;
  const friction = 0.988;
  const bounce = 0.90;

  // IMPORTANT: floor/ceiling based on REAL paper size
  const minX = -mouthX + 8;
  const maxX = (W - PAPER_W) - mouthX - 8;
  const minY = -mouthY + 8;
  const maxY = (H - PAPER_H) - mouthY - 8;

  const states = [];

  for (let i = 0; i < pool.length; i++) {
    const msg = pool[i];
    const preview = msg.slice(0, 22) + (msg.length > 22 ? "…" : "");

    const el = document.createElement("div");
    el.className = "paper flying";
    el.innerHTML = `<div class="preview">${escapeHtml(preview)}</div>`;
    el.style.left = mouthX + "px";
    el.style.top = mouthY + "px";

    const rot = rand(-25, 25);

    el.style.setProperty("--tx", `0px`);
    el.style.setProperty("--ty", `0px`);
    el.style.setProperty("--rot", `${rot}deg`);

    el.addEventListener("click", () => openMessage(msg, el));
    papersWrap.appendChild(el);

    states.push({
      el,
      rot,
      x: 0,
      y: 0,
      vx: rand(8, 18) + Math.random(),   // more push out of jar
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

      // wall bounce
      if (s.x < minX) { s.x = minX; s.vx *= -bounce; }
      if (s.x > maxX) { s.x = maxX; s.vx *= -bounce; }

      // ceiling bounce
      if (s.y < minY) { s.y = minY; s.vy *= -bounce; }

      // FLOOR bounce (real bottom!)
      if (s.y > maxY) {
        s.y = maxY;
        s.vy *= -bounce;

        // give it a pop if it would “die” on the floor
        if (Math.abs(s.vy) < 2.2) s.vy = -rand(4, 10);

        // sideways scatter so they don’t pile
        s.vx += rand(-3, 3);
      }

      s.el.style.setProperty("--tx", `${s.x}px`);
      s.el.style.setProperty("--ty", `${s.y}px`);
      s.el.style.setProperty("--rot", `${s.rot}deg`);
    }

    if (t < PHYS_MS) requestAnimationFrame(tick);
    else settleIntoGrid(states, mouthX, mouthY);
  }

  requestAnimationFrame(tick);
}

function settleIntoGrid(states, mouthX, mouthY) {
  const gap = 14;
  const tileW = 150;
  const tileH = 110;

const w = papersWrap.clientWidth;

// phone/tablet/desktop column rules
let cols = 6;
if (w < 520) cols = 2;       // phones
else if (w < 820) cols = 3;  // small tablets
else cols = 6;               // desktop

  states.forEach((s, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const tx = 18 + col * (tileW + gap);
    const ty = 18 + row * (tileH + gap);

    const finalRot = rand(-7, 7);
    s.finalRotation = finalRot;

    setTimeout(() => {
      s.el.classList.remove("flying");
      s.el.style.setProperty("--tx", `${tx - mouthX}px`);
      s.el.style.setProperty("--ty", `${ty - mouthY}px`);
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
