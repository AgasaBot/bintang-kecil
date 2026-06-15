/* ============================================================
   Bintang Kecil — mesin aplikasi
   Aplikasi belajar untuk anak dengan autisme & kebutuhan khusus.
   Tanpa iklan, tanpa tautan keluar, aman untuk anak.
   ============================================================ */
"use strict";

/* ---------- State tersimpan ---------- */
const SAVE_KEY = "bintangkecil.v1";

const defaultState = () => ({
  stars: 0,
  badges: {},                 // id -> true
  progress: {},               // key -> { played, correct }
  playedGames: {},            // key -> true (untuk lencana pelangi)
  usedAac: false,
  finishedRoutine: false,
  settings: { sfx: true, tts: true, motion: true, level: "mudah" },
});

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const s = Object.assign(defaultState(), JSON.parse(raw));
    s.settings = Object.assign(defaultState().settings, s.settings || {});
    return s;
  } catch (e) { return defaultState(); }
}
function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {}
}

/* ---------- Util ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const app = () => document.getElementById("app");
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rand = () => Math.random();
const pick = (a) => a[Math.floor(rand() * a.length)];
const sample = (a, n) => shuffle(a).slice(0, n);
const motionOK = () => state.settings.motion && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Suara: klip Bahasa Indonesia + cadangan TTS ----------
   Aplikasi memutar klip suara Indonesia (folder /audio, suara
   "Damayanti") agar pelafalan benar & SAMA di semua perangkat.
   Bila sebuah klip tidak ada, dipakai Text-to-Speech bawaan
   perangkat sebagai cadangan. */
const AUDIO = new Set();              // slug klip yang tersedia
function slugify(t) {
  return String(t).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
async function loadAudioIndex() {
  try {
    const res = await fetch("audio/index.json", { cache: "force-cache" });
    (await res.json()).forEach(s => AUDIO.add(s));
  } catch (e) {}
}

// pemutar klip (satu elemen Audio dipakai ulang)
let clipEl = null;
function clip() { if (!clipEl) { clipEl = new Audio(); clipEl.preload = "auto"; } return clipEl; }
function stopClip() { try { const a = clip(); a.onended = null; a.pause(); } catch (e) {} }

// Text-to-Speech cadangan
let idVoice = null;
function loadVoices() {
  const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  idVoice = voices.find(v => /damayanti/i.test(v.name)) ||
            voices.find(v => /id[-_]ID/i.test(v.lang) && /natural|neural|enhanced|google/i.test(v.name)) ||
            voices.find(v => /id[-_]ID/i.test(v.lang)) ||
            voices.find(v => /indones/i.test(v.name)) || null;
}
if (window.speechSynthesis) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
function ttsSpeak(text, rate = 0.84) {
  if (!window.speechSynthesis) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "id-ID"; u.rate = rate; u.pitch = 1.05;
    if (idVoice) u.voice = idVoice;
    speechSynthesis.speak(u);
  } catch (e) {}
}

// ucapkan satu teks (klip bila ada, kalau tidak TTS)
function speak(text) {
  if (!state.settings.tts || !text) return;
  stopClip();
  if (window.speechSynthesis) speechSynthesis.cancel();
  const s = slugify(text);
  if (AUDIO.has(s)) {
    const a = clip(); a.onended = null;
    a.src = "audio/" + s + ".mp3"; a.currentTime = 0;
    a.play().catch(() => ttsSpeak(text));
  } else {
    ttsSpeak(text);
  }
}

// ucapkan rangkaian kata berurutan (Papan Bicara)
function speakSequence(words) {
  if (!state.settings.tts || !words || !words.length) return;
  stopClip();
  if (window.speechSynthesis) speechSynthesis.cancel();
  if (!words.every(w => AUDIO.has(slugify(w)))) { ttsSpeak(words.join(" ")); return; }
  const a = clip(); let i = 0;
  const next = () => {
    if (i >= words.length) { a.onended = null; return; }
    a.onended = next;
    a.src = "audio/" + slugify(words[i++]) + ".mp3"; a.currentTime = 0;
    a.play().catch(() => { a.onended = null; });
  };
  next();
}

// info suara untuk dasbor orang tua
function voiceInfo() {
  loadVoices();
  return { clips: AUDIO.size, ttsFound: !!idVoice, ttsName: idVoice ? idVoice.name : null };
}

/* ---------- Suara: efek nada lembut (Web Audio) ---------- */
let actx = null;
function audio() {
  if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (actx && actx.state === "suspended") actx.resume();
  return actx;
}
function tone(freqs, dur = 0.16, gainPeak = 0.12) {
  if (!state.settings.sfx) return;
  const ctx = audio(); if (!ctx) return;
  let t = ctx.currentTime;
  freqs.forEach((f, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine"; o.frequency.value = f;
    o.connect(g); g.connect(ctx.destination);
    const start = t + i * dur;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(gainPeak, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.start(start); o.stop(start + dur);
  });
}
const soundCorrect = () => tone([523.25, 659.25, 783.99], 0.13);   // C–E–G ceria
const soundTry     = () => tone([392.0, 329.63], 0.18, 0.08);       // turun lembut, tidak menakutkan
const soundTap     = () => tone([440], 0.08, 0.06);

/* unlock audio + voices saat sentuhan pertama */
function primeAudio() {
  audio(); loadVoices();
  // buka kunci pemutaran klip MP3 (butuh gestur pengguna di seluler)
  try { const a = clip(); a.src = "audio/_silence.mp3"; a.play().then(() => a.pause()).catch(() => {}); } catch (e) {}
  window.removeEventListener("pointerdown", primeAudio);
}
window.addEventListener("pointerdown", primeAudio);

/* ---------- Bintang & Lencana ---------- */
function addStars(n) {
  state.stars += n;
  if (state.stars >= 1) awardBadge("bintang_pertama");
  if (state.stars >= 25) awardBadge("pengumpul");
  if (state.stars >= 50) awardBadge("rajin");
  if (state.stars >= 100) awardBadge("juara");
  save();
  updateStarCount();
}
function updateStarCount() {
  document.querySelectorAll("[data-starcount]").forEach(e => e.textContent = state.stars);
}
let badgeQueue = [];
function awardBadge(id) {
  if (state.badges[id]) return;
  state.badges[id] = true; save();
  const b = DATA.badges.find(x => x.id === id);
  if (b) { badgeQueue.push(b); }
}
function recordPlay(key, correct) {
  const p = state.progress[key] || { played: 0, correct: 0 };
  p.played += 1; if (correct) p.correct += 1;
  state.progress[key] = p; save();
}

/* ---------- Penggambar bentuk (SVG) ---------- */
function shapeSVG(id, color = "currentColor") {
  const wrap = (inner) => `<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">${inner}</svg>`;
  const f = `fill="${color}"`;
  switch (id) {
    case "lingkaran":       return wrap(`<circle cx="50" cy="50" r="40" ${f}/>`);
    case "persegi":         return wrap(`<rect x="14" y="14" width="72" height="72" rx="10" ${f}/>`);
    case "segitiga":        return wrap(`<polygon points="50,12 90,86 10,86" ${f}/>`);
    case "bintang":         return wrap(`<polygon points="50,8 61,38 93,38 67,58 77,90 50,70 23,90 33,58 7,38 39,38" ${f}/>`);
    case "hati":            return wrap(`<path d="M50 84 L18 52 A18 18 0 0 1 50 30 A18 18 0 0 1 82 52 Z" ${f}/>`);
    case "persegi_panjang": return wrap(`<rect x="8" y="28" width="84" height="44" rx="10" ${f}/>`);
    default: return "";
  }
}

/* ---------- Router ---------- */
function go(screen, params) {
  if (window.speechSynthesis) speechSynthesis.cancel();
  window.scrollTo(0, 0);
  ROUTES[screen] ? ROUTES[screen](params) : renderHome();
}

/* ---------- Bilah atas permainan ---------- */
function topBar(title) {
  return `
    <div class="topbar">
      <button class="iconbtn" onclick="go('home')" aria-label="Beranda">🏠</button>
      <h2 class="topbar-title">${title}</h2>
      <div class="star-chip"><span class="star-ic">⭐</span><span data-starcount>${state.stars}</span></div>
    </div>`;
}

/* ============================================================
   BERANDA
   ============================================================ */
function renderHome() {
  flushBadges();
  const tile = (screen, arg, emoji, label, cls) =>
    `<button class="tile ${cls}" onclick="go('${screen}'${arg ? `,'${arg}'` : ""})">
       <span class="tile-emoji">${emoji}</span><span class="tile-label">${label}</span>
     </button>`;

  app().innerHTML = `
    <header class="home-head">
      <div class="brand"><span class="brand-star">⭐</span>
        <div><div class="brand-name">Bintang Kecil</div>
        <div class="brand-sub">Belajar sambil bermain</div></div></div>
      <div class="star-chip big"><span class="star-ic">⭐</span><span data-starcount>${state.stars}</span></div>
    </header>

    <main class="home">
      <h3 class="group-title">🎒 Ayo Belajar</h3>
      <div class="grid">
        ${tile("game", "warna",     "🎨", "Warna",      "t-pink")}
        ${tile("game", "bentuk",    "🔷", "Bentuk",     "t-blue")}
        ${tile("game", "angka",     "🔢", "Angka",      "t-green")}
        ${tile("game", "hewan",     "🐱", "Hewan",      "t-yellow")}
        ${tile("explore", "",       "🐾", "Suara Hewan","t-teal")}
        ${tile("game", "kosakata",  "🧩", "Kata",       "t-orange")}
        ${tile("game", "buah",      "🍓", "Buah Sayur", "t-pink")}
        ${tile("game", "kendaraan", "🚗", "Kendaraan",  "t-blue")}
        ${tile("game", "tubuh",     "🧍", "Tubuh",      "t-green")}
        ${tile("game", "keluarga",  "👪", "Keluarga",   "t-yellow")}
        ${tile("game", "emosi",     "😊", "Perasaan",   "t-purple")}
        ${tile("match", "",         "🃏", "Pasangan",   "t-teal")}
      </div>

      <h3 class="group-title">💬 Ayo Bicara</h3>
      <div class="grid">
        ${tile("aac", "", "🗣️", "Papan Bicara", "t-blue")}
      </div>

      <h3 class="group-title">🌙 Kegiatan Harian</h3>
      <div class="grid">
        ${tile("routines", "", "📋", "Rutinitas", "t-green")}
      </div>
    </main>

    <footer class="home-foot">
      <button class="parent-btn" onclick="go('parentGate')">👪 Untuk Orang Tua</button>
    </footer>`;
}

/* ============================================================
   PERMAINAN PILIH-JAWABAN (generik)
   ============================================================ */
let game = null;

const GAMES = {
  warna: {
    key: "warna", title: "Warna", rounds: 5,
    pool: () => DATA.colors,
    promptText: (t) => `Mana warna ${t.name}?`,
    optionHTML: (it) => `<span class="swatch" style="background:${it.hex};${it.id === "putih" ? "border:3px solid #d9d4c8" : ""}"></span>`,
    say: (t) => t.name,
  },
  bentuk: {
    key: "bentuk", title: "Bentuk", rounds: 5,
    pool: () => DATA.shapes,
    promptText: (t) => `Mana ${t.name}?`,
    optionHTML: (it) => `<span class="shape">${shapeSVG(it.id, "#4b9e8f")}</span>`,
    say: (t) => t.name,
  },
  hewan: {
    key: "hewan", title: "Hewan", rounds: 6,
    pool: () => DATA.animals,
    promptText: (t) => `Mana ${t.name}?`,
    optionHTML: (it) => `<span class="emoji-big">${it.emoji}</span>`,
    say: (t) => t.name,
    onCorrect: (t) => setTimeout(() => speak(`${t.name}. ${t.sound}`), 450),
  },
  kosakata: {
    key: "kosakata", title: "Kata", rounds: 6,
    pool: () => DATA.vocab,
    promptText: (t) => `Mana ${t.name}?`,
    optionHTML: (it) => `<span class="emoji-big">${it.emoji}</span>`,
    say: (t) => t.name,
  },
  emosi: {
    key: "emosi", title: "Perasaan", rounds: 5,
    pool: () => DATA.emotions,
    promptText: (t) => `Mana wajah yang ${t.name}?`,
    optionHTML: (it) => `<span class="emoji-big">${it.emoji}</span>`,
    say: (t) => t.name,
  },
  tubuh: {
    key: "tubuh", title: "Tubuh", rounds: 5,
    pool: () => DATA.body,
    promptText: (t) => `Mana ${t.name}?`,
    optionHTML: (it) => `<span class="emoji-big">${it.emoji}</span>`,
    say: (t) => t.name,
  },
  buah: {
    key: "buah", title: "Buah & Sayur", rounds: 6,
    pool: () => DATA.fruits,
    promptText: (t) => `Mana ${t.name}?`,
    optionHTML: (it) => `<span class="emoji-big">${it.emoji}</span>`,
    say: (t) => t.name,
  },
  kendaraan: {
    key: "kendaraan", title: "Kendaraan", rounds: 6,
    pool: () => DATA.vehicles,
    promptText: (t) => `Mana ${t.name}?`,
    optionHTML: (it) => `<span class="emoji-big">${it.emoji}</span>`,
    say: (t) => t.name,
  },
  keluarga: {
    key: "keluarga", title: "Keluarga", rounds: 5,
    pool: () => DATA.family,
    promptText: (t) => `Mana ${t.name}?`,
    optionHTML: (it) => `<span class="emoji-big">${it.emoji}</span>`,
    say: (t) => t.name,
  },
  angka: {
    key: "angka", title: "Angka", rounds: 5,
    isCount: true,
    promptText: () => `Ada berapa? Ayo hitung!`,
  },
};

function renderGame(id) {
  const cfg = GAMES[id];
  if (!cfg) return renderHome();
  state.playedGames[cfg.key] = true;
  // lencana pelangi: semua 6 permainan belajar dimainkan
  const learn = ["warna", "bentuk", "angka", "hewan", "kosakata", "emosi"];
  if (learn.every(k => state.playedGames[k])) awardBadge("pelangi");
  save();

  game = { cfg, round: 0, earned: 0, busy: false };
  app().innerHTML = `
    ${topBar(cfg.title)}
    <div class="game">
      <div class="prompt"><button class="prompt-say" id="sayBtn" aria-label="Ulangi">🔊</button>
        <p id="promptText" class="prompt-text"></p></div>
      <div id="stage" class="stage"></div>
      <div id="options" class="options"></div>
      <div class="rounds" id="rounds"></div>
    </div>`;
  nextRound();
}

function nextRound() {
  const g = game, cfg = g.cfg;
  g.busy = false;
  if (g.round >= cfg.rounds) return celebrate(g.earned);

  const level = state.settings.level;
  const optCount = level === "sedang" ? 4 : 3;

  let target, options, stageHTML = "";

  if (cfg.isCount) {
    const max = level === "sedang" ? 9 : 5;
    const n = 1 + Math.floor(rand() * max);
    const emoji = pick(DATA.countables);
    target = { id: String(n) };
    stageHTML = `<div class="count-area">${Array.from({ length: n }).map(() => `<span class="count-item">${emoji}</span>`).join("")}</div>`;
    // opsi angka: jawaban benar + tetangga
    const set = new Set([n]);
    while (set.size < optCount) { const d = Math.max(1, Math.min(max, n + (Math.floor(rand() * 5) - 2))); set.add(d); }
    options = shuffle([...set]).map(v => ({
      id: String(v),
      html: `<span class="num">${v}</span>`,
      correct: v === n,
    }));
    g.countN = n;
    g.prompt = cfg.promptText();
  } else {
    const pool = cfg.pool();
    target = pick(pool);
    const distract = sample(pool.filter(x => x.id !== target.id), optCount - 1);
    options = shuffle([target, ...distract]).map(it => ({
      id: it.id,
      html: cfg.optionHTML(it),
      correct: it.id === target.id,
    }));
    g.prompt = cfg.promptText(target);
    g.sayWord = cfg.say(target);
    g.target = target;
  }

  $("#promptText").textContent = g.prompt;
  $("#stage").innerHTML = stageHTML;
  $("#stage").style.display = stageHTML ? "" : "none";
  $("#options").className = "options" + (options.length > 3 ? " four" : "");
  $("#options").innerHTML = options.map((o, i) =>
    `<button class="opt" data-i="${i}" data-correct="${o.correct}">${o.html}</button>`).join("");
  $("#rounds").innerHTML = Array.from({ length: cfg.rounds })
    .map((_, i) => `<span class="dot ${i < g.round ? "on" : ""}"></span>`).join("");

  $("#options").querySelectorAll(".opt").forEach(btn =>
    btn.addEventListener("click", () => onPick(btn)));
  $("#sayBtn").onclick = () => speak(g.prompt);

  // ucapkan instruksi
  setTimeout(() => speak(g.prompt), 250);
}

function onPick(btn) {
  const g = game;
  if (g.busy) return;
  const correct = btn.dataset.correct === "true";
  if (correct) {
    g.busy = true;
    btn.classList.add("right");
    soundCorrect();
    if (motionOK()) btn.classList.add("pop");
    if (g.cfg.isCount) speak(DATA.numberWords[g.countN]);
    else if (g.cfg.onCorrect && g.target) g.cfg.onCorrect(g.target);
    else speak(pick(["Hebat!", "Bagus!", "Pintar!", "Benar!", "Keren!"]));
    g.earned += 1; g.round += 1;
    addStars(1);
    recordPlay(g.cfg.key, true);
    setTimeout(nextRound, 1150);
  } else {
    soundTry();
    btn.classList.add("wrong");
    if (motionOK()) { btn.classList.add("shake"); setTimeout(() => btn.classList.remove("shake"), 500); }
    setTimeout(() => btn.classList.remove("wrong"), 600);
    speak("Coba lagi ya");
  }
}

/* ============================================================
   PERAYAAN
   ============================================================ */
function celebrate(stars) {
  flushBadges();
  if (motionOK()) confetti();
  const faces = ["🎉", "🌟", "🥳", "🦄", "🌈"];
  // tentukan tombol "Main Lagi" sesuai jenis permainan
  const key = game && game.cfg ? game.cfg.key : null;
  let again;
  if (key && GAMES[key]) again = `go('game','${key}')`;
  else if (key === "mencocokkan") again = `go('match')`;
  else if (key === "rutinitas") again = `go('routines')`;
  else again = `go('home')`;

  app().innerHTML = `
    <div class="celebrate">
      <div class="cele-face">${pick(faces)}</div>
      <h2 class="cele-title">Hebat!</h2>
      <p class="cele-sub">Kamu dapat <b>${stars}</b> ⭐</p>
      <div class="cele-actions">
        <button class="big-btn primary" onclick="${again}">🔁 Main Lagi</button>
        <button class="big-btn ghost" onclick="go('home')">🏠 Beranda</button>
      </div>
    </div>`;
  speak("Hebat!");
}

function confetti() {
  const layer = document.getElementById("overlay");
  const colors = ["#ffc94d", "#5bb8a6", "#ff8fc7", "#7ec4e6", "#9b5de5", "#46b96a"];
  for (let i = 0; i < 36; i++) {
    const p = document.createElement("span");
    p.className = "confetti";
    p.style.left = rand() * 100 + "vw";
    p.style.background = pick(colors);
    p.style.animationDelay = (rand() * 0.5) + "s";
    p.style.transform = `rotate(${rand() * 360}deg)`;
    layer.appendChild(p);
    setTimeout(() => p.remove(), 2600);
  }
}

/* ============================================================
   MENCOCOKKAN (kartu pasangan / memori)
   ============================================================ */
function renderMatch() {
  flushBadges();
  const level = state.settings.level;
  const pairs = level === "sedang" ? 6 : 4;
  const chosen = sample(DATA.vocab.concat(DATA.animals), pairs);
  let cards = shuffle(chosen.concat(chosen).map((it, i) => ({ uid: i, id: it.id, emoji: it.emoji, name: it.name })));
  const mstate = { open: [], matched: 0, busy: false, pairs };

  app().innerHTML = `
    ${topBar("Cari Pasangan")}
    <div class="game">
      <p class="prompt-text center">Buka dua kartu yang sama 🔎</p>
      <div class="match-grid ${pairs > 4 ? "cols4" : ""}" id="mgrid">
        ${cards.map((c, i) => `
          <button class="card" data-i="${i}" data-id="${c.id}">
            <span class="card-back">⭐</span>
            <span class="card-front">${c.emoji}</span>
          </button>`).join("")}
      </div>
    </div>`;

  $("#mgrid").querySelectorAll(".card").forEach(btn => {
    btn.addEventListener("click", () => {
      if (mstate.busy || btn.classList.contains("flip") || btn.classList.contains("done")) return;
      btn.classList.add("flip"); soundTap();
      const c = cards[+btn.dataset.i];
      speak(c.name);
      mstate.open.push({ btn, c });
      if (mstate.open.length === 2) {
        mstate.busy = true;
        const [a, b] = mstate.open;
        if (a.c.id === b.c.id) {
          setTimeout(() => {
            a.btn.classList.add("done"); b.btn.classList.add("done");
            soundCorrect(); addStars(1); mstate.matched++; mstate.open = []; mstate.busy = false;
            if (mstate.matched === pairs) { recordPlay("mencocokkan", true); setTimeout(() => celebrate(pairs), 600); }
          }, 500);
        } else {
          setTimeout(() => {
            a.btn.classList.remove("flip"); b.btn.classList.remove("flip");
            mstate.open = []; mstate.busy = false;
          }, 900);
        }
      }
    });
  });
  game = { cfg: { key: "mencocokkan" } };
}

/* ============================================================
   PAPAN BICARA (AAC)
   ============================================================ */
function renderAAC() {
  flushBadges();
  let strip = [];
  let activeCat = DATA.aac[0].id;

  const draw = () => {
    const cat = DATA.aac.find(c => c.id === activeCat);
    app().innerHTML = `
      ${topBar("Papan Bicara")}
      <div class="aac">
        <div class="strip">
          <div class="strip-words" id="stripWords">
            ${strip.length ? strip.map((w, i) => `<button class="chip" data-i="${i}">${w.emoji} ${w.text}</button>`).join("")
              : `<span class="strip-hint">Ketuk kartu untuk membuat kalimat…</span>`}
          </div>
          <div class="strip-actions">
            <button class="rbtn say" id="sayStrip" aria-label="Bicara">🔊 Bicara</button>
            <button class="rbtn del" id="delStrip" aria-label="Hapus satu">⌫</button>
            <button class="rbtn clr" id="clrStrip" aria-label="Hapus semua">🗑️</button>
          </div>
        </div>

        <div class="aac-tabs">
          ${DATA.aac.map(c => `<button class="aac-tab ${c.id === activeCat ? "on" : ""}" data-cat="${c.id}">${c.emoji} ${c.label}</button>`).join("")}
        </div>

        <div class="aac-cards">
          ${cat.cards.map(card => `<button class="aac-card" data-text="${card.text}" data-emoji="${card.emoji}">
              <span class="emoji-big">${card.emoji}</span><span class="aac-word">${card.text}</span></button>`).join("")}
        </div>
      </div>`;

    $("#sayStrip").onclick = () => {
      if (!strip.length) return;
      speakSequence(strip.map(w => w.text));
      state.usedAac = true; awardBadge("jagoan_bicara"); save(); flushBadges();
    };
    $("#delStrip").onclick = () => { strip.pop(); draw(); };
    $("#clrStrip").onclick = () => { strip = []; draw(); };
    document.querySelectorAll(".aac-tab").forEach(t =>
      t.onclick = () => { activeCat = t.dataset.cat; soundTap(); draw(); });
    document.querySelectorAll(".aac-card").forEach(c =>
      c.onclick = () => {
        const text = c.dataset.text, emoji = c.dataset.emoji;
        strip.push({ text, emoji });
        speak(text);
        if (motionOK()) { c.classList.add("pop"); setTimeout(() => c.classList.remove("pop"), 250); }
        draw();
      });
    document.querySelectorAll(".strip-words .chip").forEach(ch =>
      ch.onclick = () => { strip.splice(+ch.dataset.i, 1); draw(); });
  };
  draw();
}

/* ============================================================
   RUTINITAS HARIAN
   ============================================================ */
function renderRoutines() {
  flushBadges();
  app().innerHTML = `
    ${topBar("Rutinitas")}
    <div class="game">
      <p class="prompt-text center">Pilih kegiatan 🌟</p>
      <div class="grid">
        ${DATA.routines.map(r => `<button class="tile t-green" onclick="go('routine','${r.id}')">
          <span class="tile-emoji">${r.emoji}</span><span class="tile-label">${r.title}</span></button>`).join("")}
      </div>
    </div>`;
}

function renderRoutine(id) {
  const r = DATA.routines.find(x => x.id === id);
  if (!r) return renderRoutines();
  let step = 0;

  const draw = () => {
    const s = r.steps[step];
    app().innerHTML = `
      ${topBar(r.title)}
      <div class="routine">
        <div class="routine-dots">${r.steps.map((_, i) => `<span class="dot ${i <= step ? "on" : ""}"></span>`).join("")}</div>
        <div class="routine-card">
          <div class="routine-emoji">${s.emoji}</div>
          <p class="routine-text">${s.text}</p>
        </div>
        <div class="routine-nav">
          <button class="rbtn" id="prev" ${step === 0 ? "disabled" : ""}>⬅️</button>
          <button class="rbtn say" id="say">🔊</button>
          ${step < r.steps.length - 1
            ? `<button class="rbtn next" id="next">Lanjut ➡️</button>`
            : `<button class="rbtn done" id="done">Selesai ✅</button>`}
        </div>
      </div>`;
    speak(s.text);
    const prev = $("#prev"); if (prev) prev.onclick = () => { if (step > 0) { step--; draw(); } };
    const say = $("#say"); if (say) say.onclick = () => speak(s.text);
    const next = $("#next"); if (next) next.onclick = () => { step++; draw(); };
    const done = $("#done"); if (done) done.onclick = () => {
      state.finishedRoutine = true; awardBadge("penyayang"); addStars(2); save();
      recordPlay("rutinitas", true);
      game = { cfg: { key: "rutinitas" } };
      celebrate(2);
    };
  };
  draw();
}

/* ============================================================
   GERBANG ORANG TUA + DASBOR
   ============================================================ */
function renderParentGate() {
  if (window.speechSynthesis) speechSynthesis.cancel();
  const a = 3 + Math.floor(rand() * 6), b = 4 + Math.floor(rand() * 6);
  const ans = a + b;
  const opts = shuffle([ans, ans + 2, Math.max(2, ans - 3)]);
  app().innerHTML = `
    ${topBar("Untuk Orang Tua")}
    <div class="gate">
      <div class="gate-lock">🔒</div>
      <p class="gate-q">Untuk orang tua. Berapa <b>${a} + ${b}</b>?</p>
      <div class="gate-opts">
        ${opts.map(o => `<button class="gate-opt" data-ok="${o === ans}">${o}</button>`).join("")}
      </div>
      <p class="gate-hint">Bagian ini hanya untuk orang tua.</p>
    </div>`;
  document.querySelectorAll(".gate-opt").forEach(btn =>
    btn.onclick = () => {
      if (btn.dataset.ok === "true") renderParent();
      else { btn.classList.add("wrong"); setTimeout(() => btn.classList.remove("wrong"), 500); }
    });
}

function renderParent() {
  flushBadges();
  const s = state.settings;
  const vi = voiceInfo();
  const learnKeys = [
    ["warna", "🎨 Warna"], ["bentuk", "🔷 Bentuk"], ["angka", "🔢 Angka"],
    ["hewan", "🐱 Hewan"], ["kosakata", "🧩 Kata"], ["buah", "🍓 Buah & Sayur"],
    ["kendaraan", "🚗 Kendaraan"], ["tubuh", "🧍 Tubuh"], ["keluarga", "👪 Keluarga"],
    ["emosi", "😊 Perasaan"], ["mencocokkan", "🃏 Pasangan"], ["rutinitas", "📋 Rutinitas"],
  ];
  const totalPlayed = Object.values(state.progress).reduce((n, p) => n + p.played, 0);

  app().innerHTML = `
    ${topBar("Untuk Orang Tua")}
    <div class="parent">
      <div class="p-stats">
        <div class="p-stat"><div class="p-num">${state.stars}</div><div class="p-lab">⭐ Bintang</div></div>
        <div class="p-stat"><div class="p-num">${Object.keys(state.badges).length}</div><div class="p-lab">🏅 Lencana</div></div>
        <div class="p-stat"><div class="p-num">${totalPlayed}</div><div class="p-lab">🎮 Latihan</div></div>
      </div>

      <h3 class="p-h">Kemajuan Keterampilan</h3>
      <div class="p-progress">
        ${learnKeys.map(([k, label]) => {
          const p = state.progress[k] || { played: 0, correct: 0 };
          const pct = p.played ? Math.round((p.correct / p.played) * 100) : 0;
          return `<div class="p-row">
            <div class="p-row-top"><span>${label}</span><span class="p-pct">${p.played ? pct + "%" : "—"}</span></div>
            <div class="p-bar"><span style="width:${pct}%"></span></div>
            <div class="p-meta">${p.played} latihan</div>
          </div>`;
        }).join("")}
      </div>

      <h3 class="p-h">Lencana</h3>
      <div class="p-badges">
        ${DATA.badges.map(b => `<div class="p-badge ${state.badges[b.id] ? "got" : ""}">
          <div class="p-badge-ic">${b.emoji}</div><div class="p-badge-t">${b.title}</div>
          <div class="p-badge-d">${b.desc}</div></div>`).join("")}
      </div>

      <h3 class="p-h">Pengaturan</h3>
      <div class="p-settings">
        ${toggleRow("sfx", "🔔 Suara efek", s.sfx)}
        ${toggleRow("tts", "🗣️ Suara bicara", s.tts)}
        ${toggleRow("motion", "✨ Animasi", s.motion)}
        <div class="p-set-row">
          <span>🎚️ Tingkat kesulitan</span>
          <div class="seg">
            <button class="seg-btn ${s.level === "mudah" ? "on" : ""}" data-level="mudah">Mudah</button>
            <button class="seg-btn ${s.level === "sedang" ? "on" : ""}" data-level="sedang">Sedang</button>
          </div>
        </div>
      </div>

      <h3 class="p-h">Suara Bahasa Indonesia</h3>
      <div class="p-voice">
        <div class="p-voice-status ${vi.clips ? "ok" : "warn"}">
          ${vi.clips ? "✅ Suara Indonesia bawaan aplikasi" : "⏳ Memuat suara…"}
        </div>
        <div class="p-voice-note">
          Aplikasi memakai rekaman suara Bahasa Indonesia sendiri${vi.clips ? ` (${vi.clips} kata &amp; kalimat)` : ""},
          sehingga pelafalannya benar dan sama di setiap perangkat — tidak bergantung pada suara bawaan HP.
          ${vi.ttsFound ? `<br>Cadangan suara perangkat: <b>${vi.ttsName}</b>.` : ""}
        </div>
        <button class="test-voice-btn" id="testVoice">🔊 Tes Suara</button>
      </div>

      <h3 class="p-h">Tips untuk Orang Tua</h3>
      <ul class="p-tips">
        <li>Dampingi anak dan beri pujian saat ia berhasil.</li>
        <li>Main sebentar tapi rutin lebih baik daripada lama sekaligus.</li>
        <li>Gunakan <b>Papan Bicara</b> untuk membantu anak menyampaikan keinginannya.</li>
        <li>Pilih tempat yang tenang agar anak lebih fokus.</li>
      </ul>

      <button class="reset-btn" id="resetBtn">↺ Atur Ulang Kemajuan</button>
      <p class="p-about">Bintang Kecil — aplikasi belajar untuk anak dengan autisme & kebutuhan khusus. Tanpa iklan. Bisa dipakai tanpa internet.</p>
    </div>`;

  document.querySelectorAll("[data-toggle]").forEach(t =>
    t.onclick = () => { const k = t.dataset.toggle; state.settings[k] = !state.settings[k]; save(); renderParent(); });
  document.querySelectorAll("[data-level]").forEach(b =>
    b.onclick = () => { state.settings.level = b.dataset.level; save(); renderParent(); });
  $("#testVoice").onclick = () => {
    const wasOff = !state.settings.tts;
    if (wasOff) state.settings.tts = true;      // pastikan tes selalu berbunyi
    speak("Halo! Selamat belajar bersama Bintang Kecil.");
    if (wasOff) state.settings.tts = false;
  };
  $("#resetBtn").onclick = () => {
    if (confirm("Atur ulang semua bintang, lencana, dan kemajuan?")) {
      state = defaultState(); save(); renderParent();
    }
  };
}
function toggleRow(key, label, on) {
  return `<div class="p-set-row"><span>${label}</span>
    <button class="switch ${on ? "on" : ""}" data-toggle="${key}" role="switch" aria-checked="${on}"><span class="knob"></span></button></div>`;
}

/* ---------- Tampilkan lencana baru (popup) ---------- */
function flushBadges() {
  if (!badgeQueue.length) return;
  const b = badgeQueue.shift();
  const layer = document.getElementById("overlay");
  const pop = document.createElement("div");
  pop.className = "badge-pop";
  pop.innerHTML = `<div class="badge-pop-inner"><div class="badge-pop-ic">${b.emoji}</div>
    <div class="badge-pop-t">Lencana Baru!</div><div class="badge-pop-n">${b.title}</div></div>`;
  layer.appendChild(pop);
  soundCorrect();
  setTimeout(() => { pop.classList.add("out"); setTimeout(() => { pop.remove(); flushBadges(); }, 400); }, 2000);
}

/* ============================================================
   SUARA HEWAN (papan bermain bebas — tanpa kuis)
   ============================================================ */
function renderExplore() {
  state.usedExplore = true; awardBadge("sahabat_hewan"); save();
  app().innerHTML = `
    ${topBar("Suara Hewan")}
    <div class="game">
      <p class="prompt-text center">Ketuk hewan untuk mendengar suaranya 🔊</p>
      <div class="explore-grid">
        ${DATA.animals.map(a => `<button class="ex-card" data-id="${a.id}">
          <span class="emoji-big">${a.emoji}</span><span class="ex-name">${a.name}</span></button>`).join("")}
      </div>
    </div>`;
  document.querySelectorAll(".ex-card").forEach(c =>
    c.onclick = () => {
      const a = DATA.animals.find(x => x.id === c.dataset.id);
      if (!a) return;
      soundTap();
      speak(a.sound ? `${a.name}. ${a.sound}` : a.name);
      if (motionOK()) { c.classList.add("pop"); setTimeout(() => c.classList.remove("pop"), 300); }
    });
  flushBadges();
}

/* ---------- Tabel rute ---------- */
const ROUTES = {
  home: renderHome,
  game: renderGame,
  match: renderMatch,
  explore: renderExplore,
  aac: renderAAC,
  routines: renderRoutines,
  routine: renderRoutine,
  parentGate: renderParentGate,
  parent: renderParent,
};

/* ---------- Mulai ---------- */
window.addEventListener("DOMContentLoaded", () => {
  loadAudioIndex();          // muat daftar klip suara Indonesia
  renderHome();
  // daftarkan service worker untuk mode offline
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
});
