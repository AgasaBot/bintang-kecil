/* ============================================================
   Bintang Kecil — pembuat berkas suara (audio)
   Merender setiap kata & kalimat yang diucapkan aplikasi
   memakai suara Bahasa Indonesia "Damayanti" (macOS `say`),
   lalu menyimpannya sebagai MP3 di folder /audio.

   Tujuan: anak mendengar suara Indonesia yang SAMA & benar di
   semua perangkat, tanpa bergantung pada suara bawaan HP.

   Jalankan ulang bila konten berubah:
     node tools/gen-audio.js
   Lalu commit folder /audio.
   ============================================================ */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "audio");
const VOICE = "Damayanti";          // suara id_ID bawaan macOS
const TMP = "/tmp/bk_clip.aiff";

// ---- muat DATA dari data.js ----
const code = fs.readFileSync(path.join(ROOT, "data.js"), "utf8");
const box = {};
new Function(code + "\nthis.DATA = DATA;").call(box);
const DATA = box.DATA;

// ---- slugify: HARUS identik dengan yang ada di app.js ----
function slug(t) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

// ---- kumpulkan semua teks yang diucapkan aplikasi ----
const texts = new Set();
const add = (t) => { if (t && String(t).trim()) texts.add(String(t)); };

DATA.colors.forEach((c) => { add(`Mana warna ${c.name}?`); add(c.name); });
DATA.shapes.forEach((s) => { add(`Mana ${s.name}?`); add(s.name); });
["animals", "vocab", "fruits", "vehicles", "body", "family"].forEach((k) => {
  DATA[k].forEach((it) => { add(`Mana ${it.name}?`); add(it.name); });
});
DATA.emotions.forEach((e) => { add(`Mana wajah yang ${e.name}?`); add(e.name); });
add("Ada berapa? Ayo hitung!");
Object.values(DATA.numberWords).forEach(add);                 // satu..sepuluh
DATA.animals.forEach((a) => { if (a.sound) add(`${a.name}. ${a.sound}`); });
["Hebat!", "Bagus!", "Pintar!", "Benar!", "Keren!", "Coba lagi ya",
 "Halo! Selamat belajar bersama Bintang Kecil."].forEach(add);
DATA.aac.forEach((cat) => cat.cards.forEach((c) => add(c.text)));
DATA.routines.forEach((r) => r.steps.forEach((s) => add(s.text)));

// ---- dedup berdasarkan slug ----
const bySlug = new Map();
for (const t of texts) { const s = slug(t); if (!bySlug.has(s)) bySlug.set(s, t); }

fs.mkdirSync(OUT, { recursive: true });

// klip senyap untuk "membuka kunci" audio pada sentuhan pertama
try {
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi",
    "-i", "anullsrc=r=22050:cl=mono", "-t", "0.18",
    "-b:a", "32k", path.join(OUT, "_silence.mp3")]);
} catch (e) { console.error("silence FAIL", e.message); }

// ---- render tiap klip ----
const slugs = [];
let i = 0;
const total = bySlug.size;
for (const [s, t] of bySlug) {
  i++;
  const mp3 = path.join(OUT, s + ".mp3");
  try {
    execFileSync("say", ["-v", VOICE, "-o", TMP, t]);
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", TMP,
      "-ac", "1", "-ar", "22050", "-b:a", "48k", mp3]);
    slugs.push(s);
    if (i % 25 === 0) console.log(`  ${i}/${total}`);
  } catch (e) {
    console.error("FAIL", s, "<=", JSON.stringify(t), e.message);
  }
}

fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(slugs.sort()));
console.log(`Selesai: ${slugs.length}/${total} klip → ${OUT}`);
