const PASSWORD = "yourconstellationnowandforever";

let spilled = false;
let lastOpenedPaper = null;

const messages = [
   {
    preview: "I'm not responding and u miss me",
    text: "Hii babyy I’m sorryy I must be busy for you to be here, but scroll around here until I’m back?\n\nI put little bits of me in all of these, so this might as well count as my presence.\n\nEnjoy scrolling my love."
  },
   {
  preview: "you miss my AWESOME singing",
  text: `
    hey there miguel whats it liek in tekong camp im 22km away but man tonight you look so pretty yes you do, orchard cant shine half as bright as u my word is true.\nhey there migugu dont you worry about the distance im right here if you get lonely give this sog another listen close your eyes. listen to my voice its my disguise, im by your side.\ndont judge my singing i recorded this mid coding

    <audio controls class="noteAudio">
      <source src="hey there delilah.m4a" type="audio/mp4">
      <source src="hey there delilah.m4a" type="audio/x-m4a">
      Your browser does not support audio.
    </audio>
  `
},
     {
    preview: "Youre upset at me",
    text: "Aww baby im sorry. i dont know what i did but will you calm down and then talk to me? we can work it out when youre ready. you mean everything to me. if you need to calm down theres a letter right beside this to help you calm down. im sorry, well work this out. i love you okay?"
  },
    {
  preview: "you need to calm down",
  text: `
    hi baby, if you need to calm down, have some cold water and do some deep breathing. in for 5, hold for 1, out for 5.\nheres my breathing exercise, not perfect but it has background music and all hehe. repeat till calm!
    <audio controls class="noteAudio">
      <source src="breathing.m4a" type="audio/mp4">
      <source src="breathing.m4a" type="audio/x-m4a">
      Your browser does not support audio.
    </audio>
  `
},
      {
    preview: "You need a confidence boost",
    text: "things i love about you: \n-Your facial features\nyour strive to do better everytime you make a mistake\n-your kindness and genuineness\n-your face. 100%\nyour respectfullness to the people around you\nyour love for the important people in your life\nyour glorious countenance.\nthe list goes on. did i mention your face? okay but seriously thoug, come drop me a text i wanna understand what youre thinking or feeling. i love you."
  },
{
  preview: "you miss my voice",
  text: `
    im with you always

    <audio controls class="noteAudio">
      <source src="youmissmyvoice.m4a" type="audio/mp4">
      <source src="youmissmyvoice.m4a" type="audio/x-m4a">
      Your browser does not support audio.
    </audio>
yappidy yap yap yap
  `
},
{
  preview: "You need to know how much I love you",
  text: `
    The pinterest board I didnt let you see before. Go take a look? insert smiley hands clasped hampter
    <a href="https://docs.google.com/document/d/1nDylkNBM5skx9_QUa7gRSe1ndXSaihFN5Cc22zUaohA/edit?usp=sharing" target="_blank">
      temporary google doc replacement
    </a>
  `
},
  {
    preview: "You need a kiss",
    text: "A little kiss for u\nMwah, I love you.",
    img: "kisses.jpg"
  },


   
   {
    preview: "You angered me and dk what to do",
    text: "i know sometimes i over-flip out so you can fall back on this foolproof plan:\nstep 1, transfer me 10000 dollars\nstep 2, send sugary delights to my place\nstep 3, show up at my door and ask me to seesaw, perhaps with flowers(only if i havent received any recently)\nstep 5, beg on your knees. and done!\n baby dont worry itll all blow over easily. you know me, you know how to handle me. well get past this okay? give it time. i love you, no matter what nonsense angry me said. good luck!"
  },
   
   {
  preview: "i fell asleep without the jingle:(",
  text: `
    im sorry my love. i mustve been exhausted. or perhaps angry(lets hope im not petty enough to sleep without saying goodnight)\n anyways i hope this makes up for it for now:

    <audio controls class="noteAudio">
      <source src="goodnight.m4a" type="audio/mp4">
      <source src="goodnight.m4a" type="audio/x-m4a">
      Your browser does not support audio.
    </audio>
mwah
  `},

   {
    preview: "You feel like a bad bf/like i deserve better",
    text: "I know how you feel but just know ive never loved one like you. If you want to be better for me thats great but it doesnt make you a bad bf now. if you think i can do better youre wrong you ARE better. youre better for me than you were yesterday and tomorrow you will be better than today. current you will always be the best for me because you are someone who always improves day by day for me, and i love it. the fact that youre worried about being a bad bf shows u care that alone makes u a great bf. You mess up sometimes as do i and thats what it means to be human. i love you as you are."
  },

    {
    preview: "You feel yourself losing feelings",
    text: "how dare you open this. Insert angry fist up emoji.\nso this is just in case, im praying you dont ever find a reason to open it but anyways just talk to me about it. like right now. we will figure out where to go from here or how to fix it. remember that i will always love you, even if you no longer love me. Jeez im crying as i write this i dont wanna think about it:("
  },
   
    {
  preview: "someone paused the music",
  text: `
    need some music to get the vibes right? heres a playlist of the daily songs hehe
<a href="https://open.spotify.com/playlist/5nZUJj0xljpS5s5ePFDckg?si=4b45bc1df3cb457e" target="_blank">
      Cue the music!
    </a>
  `
},
   {
  preview: "you miss ur fire breathing gf",
  text: `
    rawr🔥

    <video controls playsinline class="noteVideo">
      <source src="firebreathing.m4v" type="video/mp4">
      Your browser does not support video.
    </video>
    can u tell im running out of things to include

  `
}
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
const openWhenText = document.getElementById("openWhenText");

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
    setTimeout(() => openWhenText.classList.add("show"), 50);
  }

  setTimeout(() => spillPhysicsThenOrganize(), 450);
});

/* ================= PHYSICS ================= */

function spillPhysicsThenOrganize() {
  papersWrap.innerHTML = "";

  // Build exactly 100 notes (repeat messages)
 // Use only the messages you defined
const pool = [...messages];

  // Jar mouth position inside papers
  const papersRect = papersWrap.getBoundingClientRect();
  const jarRect = (jarWrap || jar).getBoundingClientRect();
  const mouthX = (jarRect.left + jarRect.width / 2) - papersRect.left + 45;
  const mouthY = (jarRect.top + jarRect.height / 2) - papersRect.top + 10;

  // Measure real paper size
  const temp = document.createElement("div");
  temp.className = "paper";
  temp.style.opacity = "0";
  temp.innerHTML = `<div class="preview">test</div>`;
  papersWrap.appendChild(temp);
  const PAPER_W = temp.offsetWidth || 140;
  const PAPER_H = temp.offsetHeight || 96;
  temp.remove();

  // Physics settings
  const gravity = 0.95;
  const friction = 0.988;
  const bounce = 0.9;

  const states = [];

  for (let i = 0; i < pool.length; i++) {
    const msg = pool[i];

    // ✅ preview works for strings AND objects
    const preview =
      typeof msg === "object"
        ? (msg.preview || "Open me…")
        : msg.slice(0, 22) + (msg.length > 22 ? "…" : "");

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

    if (now - start < PHYS_DURATION) requestAnimationFrame(tick);
    else organizeIntoGrid(states, PAPER_W, PAPER_H);
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

    if (!allLocked) requestAnimationFrame(magnetLoop);
    else enableScrollMode(states);
  }

  requestAnimationFrame(magnetLoop);
}

/* ================= SCROLL ACTIVATION ================= */

function enableScrollMode(states) {
  papersWrap.classList.add("tray");

  const grid = document.createElement("div");
  grid.className = "papersGrid";

  states.forEach((s) => {
    s.el.style.setProperty("--tx", "0px");
    s.el.style.setProperty("--ty", "0px");
    grid.appendChild(s.el);
  });

  papersWrap.innerHTML = "";
  papersWrap.appendChild(grid);
  papersWrap.scrollTop = 0;
}

/* ================= MODAL ================= */

function openMessage(message, paperEl) {
  if (lastOpenedPaper && lastOpenedPaper !== paperEl) {
    lastOpenedPaper.classList.remove("opened");
    lastOpenedPaper.style.opacity = 1;
  }

  lastOpenedPaper = paperEl;
  paperEl.classList.add("opened");
  paperEl.style.opacity = 0.9;

  modalText.innerHTML = "";

  // message can be STRING or OBJECT
  if (typeof message === "object") {

    const textEl = document.createElement("div");
    textEl.innerHTML = message.text || "";
    modalText.appendChild(textEl);

    if (message.img) {
      const imgEl = document.createElement("img");
      imgEl.src = message.img;
      imgEl.style.marginTop = "20px";
      imgEl.style.maxWidth = "80%";
      imgEl.style.borderRadius = "12px";
      imgEl.style.boxShadow = "0 10px 25px rgba(0,0,0,.2)";
      modalText.appendChild(imgEl);
    }

  } else {
    modalText.textContent = message;
  }

  modal.classList.remove("hidden");
}

closeModal.addEventListener("click", closeModalFn);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModalFn();
});

function closeModalFn() {
  modal.classList.add("hidden");
  modalText.querySelectorAll("audio").forEach(a => {
  a.pause();
  a.currentTime = 0;
});
  
  modalText.innerHTML = "";

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
