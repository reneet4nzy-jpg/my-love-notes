// ===== PASSWORD =====
const PASSWORD = "1234";

// ===== MESSAGES (sample 100) =====
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
  "Your laugh is my favourite sound.",
  "I love how your mind works.",
  "You make everything brighter.",
  "You are the safest place I know.",
  "I love the way you look at me.",
  "You are my once in a lifetime.",
  "You make my heart feel full.",
  "I’m grateful for you every single day.",
  "You are my favourite chapter.",
  "You are my soft place to land.",
  "You make love feel easy.",
  "I adore your kindness.",
  "You make my worst days better.",
  "You are my favourite person.",
  "I love the way you think.",
  "You make my heart race.",
  "I love your quiet strength.",
  "You are my constant.",
  "I love how you care so deeply.",
  "You make me feel understood.",
  "You are my favourite adventure.",
  "You are everything I hoped for.",
  "I love the way you hold my hand.",
  "You are my light.",
  "You make me brave.",
  "You are my best decision.",
  "I love how safe you make me feel.",
  "You are my sweetest thought.",
  "You make the future exciting.",
  "I love your heart.",
  "You are my favourite place.",
  "You make my world feel bigger.",
  "I love how you see me.",
  "You are my gentle comfort.",
  "You are my favourite surprise.",
  "I love the way you laugh.",
  "You make love feel steady.",
  "You are my peace.",
  "I love growing with you.",
  "You are my favourite story.",
  "You make everything softer.",
  "I love the way you care.",
  "You are my always.",
  "You are my best friend.",
  "I love how you listen.",
  "You make me better.",
  "You are my heart’s home.",
  "I love your warmth.",
  "You make everything worth it.",
  "You are my quiet joy.",
  "I love the way you think about the world.",
  "You are my comfort.",
  "You make the little things matter.",
  "I love your honesty.",
  "You are my favourite memory.",
  "You make me feel chosen.",
  "I love how we fit together.",
  "You are my steady hand.",
  "You make love feel certain.",
  "I love how patient you are.",
  "You are my sunrise.",
  "You make my heart soft.",
  "I love how you try.",
  "You are my favourite habit.",
  "You make me feel seen.",
  "I love how you support me.",
  "You are my deep breath.",
  "You make my world quieter.",
  "I love the way you show up.",
  "You are my constant comfort.",
  "You make me smile without trying.",
  "I love how real you are.",
  "You are my sweetest reality.",
  "You make everything better just by being here.",
  "I love your presence.",
  "You are my safe space.",
  "You make my life brighter.",
  "I love how gentle you are.",
  "You are my favourite feeling.",
  "You make love feel warm.",
  "I love the way you exist.",
  "You are my forever person.",
  "You make my heart steady.",
  "I love how you care for me.",
  "You are my anchor.",
  "You make my world make sense.",
  "I love how we are together.",
  "You are my quiet happiness.",
  "You make love feel effortless.",
  "You are my constellation now and forever."
];

// ===== DOM =====
const gate = document.getElementById("gate");
const app = document.getElementById("app");
const pw = document.getElementById("pw");
const enterBtn = document.getElementById("enterBtn");
const gateMsg = document.getElementById("gateMsg");

const jar = document.getElementById("jar");
const papersWrap = document.getElementById("papers");

const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

// 🔥 FORCE modal hidden on load (fix)
modal.classList.add("hidden");

let lastOpenedPaper = null;
let spilled = false;

// ===== PASSWORD LOGIC =====
enterBtn.addEventListener("click", () => {
  if (pw.value === PASSWORD) {
    gate.classList.add("hidden");
    app.classList.remove("hidden");
  } else {
    gateMsg.textContent = "typo perhaps? insert sad hampter";
  }
});

pw.addEventListener("keydown", (e) => {
  if (e.key === "Enter") enterBtn.click();
});

// ===== JAR CLICK =====
jar.addEventListener("click", () => {
  if (spilled) return;
  spilled = true;
  jar.textContent = "🫙✨";
  spillPapers();
});

// ===== SPILL =====
function spillPapers() {
  const W = papersWrap.clientWidth;
  const H = papersWrap.clientHeight;

  const pool = [...messages].sort(() => Math.random() - 0.5);

  for (let i = 0; i < pool.length; i++) {
    const msg = pool[i];
    const preview = msg.slice(0, 22) + (msg.length > 22 ? "…" : "");

    const p = document.createElement("div");
    p.className = "paper";
    p.innerHTML = `<div class="preview">${preview}</div>`;

    const startX = W * 0.5;
    const startY = 30;

    const endX = Math.random() * (W - 100);
    const endY = 80 + Math.random() * (H - 120);
    const rot = Math.floor(Math.random() * 80 - 40);

    p.style.setProperty("--rot", rot + "deg");
    p.style.left = startX + "px";
    p.style.top = startY + "px";
    p.style.opacity = 0;

    p.addEventListener("click", () => openMessage(msg, p));
    papersWrap.appendChild(p);

    requestAnimationFrame(() => {
      p.style.opacity = 1;
      p.animate(
        [
          { transform: `translate(0,0) rotate(${rot}deg)` },
          { transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(${rot}deg)` }
        ],
        { duration: 800, easing: "ease-out", fill: "forwards" }
      );
    });
  }
}

// ===== OPEN MESSAGE =====
function openMessage(text, paperEl) {
  if (lastOpenedPaper && lastOpenedPaper !== paperEl) {
    lastOpenedPaper.classList.remove("opened");
  }

  lastOpenedPaper = paperEl;
  paperEl.classList.add("opened");
  paperEl.style.opacity = 0.6;

  modalText.textContent = text;
  modal.classList.remove("hidden");
}

// ===== CLOSE MODAL =====
closeModal.addEventListener("click", closeModalFn);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModalFn();
});

function closeModalFn() {
  modal.classList.add("hidden");
  if (lastOpenedPaper) lastOpenedPaper.classList.remove("opened");
}
