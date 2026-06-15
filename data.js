/* ============================================================
   Bintang Kecil — konten pembelajaran (Bahasa Indonesia)
   Semua materi memakai emoji sebagai gambar agar ringan,
   tampil di semua perangkat, dan tetap berfungsi tanpa internet.
   Ejaan mengikuti KBBI (mis. "cokelat", bukan "coklat").
   ============================================================ */

const DATA = {

  /* ---- Angka 1–10 ---- */
  numberWords: {
    1: "satu", 2: "dua", 3: "tiga", 4: "empat", 5: "lima",
    6: "enam", 7: "tujuh", 8: "delapan", 9: "sembilan", 10: "sepuluh",
  },
  // objek yang lucu untuk dihitung
  countables: ["🍎", "🍌", "⭐", "🐥", "🎈", "🍓", "🚗", "🌸", "🐠", "🍪", "🦋", "🍊"],

  /* ---- Warna ---- */
  colors: [
    { id: "merah",       name: "merah",       hex: "#e84c4c" },
    { id: "biru",        name: "biru",        hex: "#3b7dea" },
    { id: "kuning",      name: "kuning",      hex: "#f5c518" },
    { id: "hijau",       name: "hijau",       hex: "#46b96a" },
    { id: "oranye",      name: "oranye",      hex: "#ff8c1a" },
    { id: "ungu",        name: "ungu",        hex: "#9b5de5" },
    { id: "merah_muda",  name: "merah muda",  hex: "#ff8fc7" },
    { id: "cokelat",     name: "cokelat",     hex: "#9a6b3f" },
    { id: "abu_abu",     name: "abu-abu",     hex: "#9aa3b2" },
    { id: "hitam",       name: "hitam",       hex: "#3a3a44" },
    { id: "putih",       name: "putih",       hex: "#ffffff" },
  ],

  /* ---- Bentuk (digambar dengan SVG di app.js) ---- */
  shapes: [
    { id: "lingkaran",       name: "lingkaran" },
    { id: "persegi",         name: "persegi" },
    { id: "segitiga",        name: "segitiga" },
    { id: "bintang",         name: "bintang" },
    { id: "hati",            name: "hati" },
    { id: "persegi_panjang", name: "persegi panjang" },
  ],

  /* ---- Hewan (nama + bunyi khas Indonesia). sound "" = tanpa bunyi ---- */
  animals: [
    { id: "kucing",   name: "kucing",   emoji: "🐱", sound: "meong meong" },
    { id: "anjing",   name: "anjing",   emoji: "🐶", sound: "guk guk" },
    { id: "sapi",     name: "sapi",     emoji: "🐮", sound: "moooo" },
    { id: "ayam",     name: "ayam",     emoji: "🐔", sound: "petok petok" },
    { id: "ayam_jago",name: "ayam jago",emoji: "🐓", sound: "kukuruyuk" },
    { id: "bebek",    name: "bebek",    emoji: "🦆", sound: "kwek kwek" },
    { id: "kambing",  name: "kambing",  emoji: "🐐", sound: "mbeeek" },
    { id: "domba",    name: "domba",    emoji: "🐑", sound: "mbeeek" },
    { id: "kuda",     name: "kuda",     emoji: "🐴", sound: "hiihiihii" },
    { id: "babi",     name: "babi",     emoji: "🐷", sound: "ngok ngok" },
    { id: "tikus",    name: "tikus",    emoji: "🐭", sound: "ciit ciit" },
    { id: "kelinci",  name: "kelinci",  emoji: "🐰", sound: "" },
    { id: "katak",    name: "katak",    emoji: "🐸", sound: "kwok kwok" },
    { id: "burung",   name: "burung",   emoji: "🐦", sound: "cuit cuit" },
    { id: "ayam_anak",name: "anak ayam",emoji: "🐥", sound: "ciap ciap" },
    { id: "lebah",    name: "lebah",    emoji: "🐝", sound: "nguuung" },
    { id: "harimau",  name: "harimau",  emoji: "🐯", sound: "aaaum" },
    { id: "singa",    name: "singa",    emoji: "🦁", sound: "aaaum" },
    { id: "beruang",  name: "beruang",  emoji: "🐻", sound: "grrr" },
    { id: "monyet",   name: "monyet",   emoji: "🐵", sound: "uuk uuk" },
    { id: "gajah",    name: "gajah",    emoji: "🐘", sound: "ngooong" },
    { id: "jerapah",  name: "jerapah",  emoji: "🦒", sound: "" },
    { id: "zebra",    name: "zebra",    emoji: "🦓", sound: "" },
    { id: "panda",    name: "panda",    emoji: "🐼", sound: "" },
    { id: "ular",     name: "ular",     emoji: "🐍", sound: "sssst" },
    { id: "ikan",     name: "ikan",     emoji: "🐟", sound: "" },
    { id: "kura",     name: "kura-kura",emoji: "🐢", sound: "" },
    { id: "kupu",     name: "kupu-kupu",emoji: "🦋", sound: "" },
    { id: "buaya",    name: "buaya",    emoji: "🐊", sound: "" },
    { id: "penguin",  name: "penguin",  emoji: "🐧", sound: "" },
  ],

  /* ---- Kosakata sehari-hari ---- */
  vocab: [
    // benda di rumah
    { id: "bola",       name: "bola",       emoji: "⚽" },
    { id: "mobil",      name: "mobil",      emoji: "🚗" },
    { id: "rumah",      name: "rumah",      emoji: "🏠" },
    { id: "buku",       name: "buku",       emoji: "📖" },
    { id: "baju",       name: "baju",       emoji: "👕" },
    { id: "sepatu",     name: "sepatu",     emoji: "👟" },
    { id: "topi",       name: "topi",       emoji: "🧢" },
    { id: "kunci",      name: "kunci",      emoji: "🔑" },
    { id: "payung",     name: "payung",     emoji: "☂️" },
    { id: "sendok",     name: "sendok",     emoji: "🥄" },
    { id: "garpu",      name: "garpu",      emoji: "🍴" },
    { id: "piring",     name: "piring",     emoji: "🍽️" },
    { id: "gelas",      name: "gelas",      emoji: "🥤" },
    { id: "jam",        name: "jam",        emoji: "🕐" },
    { id: "pensil",     name: "pensil",     emoji: "✏️" },
    { id: "tas",        name: "tas",        emoji: "🎒" },
    { id: "balon",      name: "balon",      emoji: "🎈" },
    { id: "boneka",     name: "boneka",     emoji: "🧸" },
    { id: "kacamata",   name: "kacamata",   emoji: "👓" },
    { id: "sabun",      name: "sabun",      emoji: "🧼" },
    // alam
    { id: "bunga",      name: "bunga",      emoji: "🌸" },
    { id: "pohon",      name: "pohon",      emoji: "🌳" },
    { id: "matahari",   name: "matahari",   emoji: "☀️" },
    { id: "bulan",      name: "bulan",      emoji: "🌙" },
    { id: "bintang",    name: "bintang",    emoji: "⭐" },
    { id: "awan",       name: "awan",       emoji: "☁️" },
    { id: "hujan",      name: "hujan",      emoji: "🌧️" },
    // makanan & minuman
    { id: "nasi",       name: "nasi",       emoji: "🍚" },
    { id: "roti",       name: "roti",       emoji: "🍞" },
    { id: "susu",       name: "susu",       emoji: "🥛" },
    { id: "air",        name: "air",        emoji: "💧" },
    { id: "telur",      name: "telur",      emoji: "🥚" },
    { id: "es_krim",    name: "es krim",    emoji: "🍦" },
  ],

  /* ---- Buah & Sayur ---- */
  fruits: [
    { id: "apel",     name: "apel",     emoji: "🍎" },
    { id: "pisang",   name: "pisang",   emoji: "🍌" },
    { id: "jeruk",    name: "jeruk",    emoji: "🍊" },
    { id: "semangka", name: "semangka", emoji: "🍉" },
    { id: "anggur",   name: "anggur",   emoji: "🍇" },
    { id: "stroberi", name: "stroberi", emoji: "🍓" },
    { id: "nanas",    name: "nanas",    emoji: "🍍" },
    { id: "mangga",   name: "mangga",   emoji: "🥭" },
    { id: "melon",    name: "melon",    emoji: "🍈" },
    { id: "alpukat",  name: "alpukat",  emoji: "🥑" },
    { id: "wortel",   name: "wortel",   emoji: "🥕" },
    { id: "jagung",   name: "jagung",   emoji: "🌽" },
    { id: "tomat",    name: "tomat",    emoji: "🍅" },
    { id: "brokoli",  name: "brokoli",  emoji: "🥦" },
    { id: "terong",   name: "terong",   emoji: "🍆" },
    { id: "kentang",  name: "kentang",  emoji: "🥔" },
  ],

  /* ---- Kendaraan ---- */
  vehicles: [
    { id: "mobil",      name: "mobil",      emoji: "🚗" },
    { id: "motor",      name: "motor",      emoji: "🏍️" },
    { id: "bus",        name: "bus",        emoji: "🚌" },
    { id: "kereta",     name: "kereta api", emoji: "🚆" },
    { id: "pesawat",    name: "pesawat",    emoji: "✈️" },
    { id: "kapal",      name: "kapal",      emoji: "🚢" },
    { id: "sepeda",     name: "sepeda",     emoji: "🚲" },
    { id: "truk",       name: "truk",       emoji: "🚚" },
    { id: "helikopter", name: "helikopter", emoji: "🚁" },
    { id: "perahu",     name: "perahu",     emoji: "🛶" },
    { id: "ambulans",   name: "ambulans",   emoji: "🚑" },
    { id: "taksi",      name: "taksi",      emoji: "🚕" },
  ],

  /* ---- Anggota tubuh ---- */
  body: [
    { id: "mata",    name: "mata",    emoji: "👁️" },
    { id: "telinga", name: "telinga", emoji: "👂" },
    { id: "hidung",  name: "hidung",  emoji: "👃" },
    { id: "mulut",   name: "mulut",   emoji: "👄" },
    { id: "tangan",  name: "tangan",  emoji: "✋" },
    { id: "kaki",    name: "kaki",    emoji: "🦶" },
    { id: "gigi",    name: "gigi",    emoji: "🦷" },
    { id: "lidah",   name: "lidah",   emoji: "👅" },
  ],

  /* ---- Keluarga ---- */
  family: [
    { id: "ibu",   name: "ibu",   emoji: "👩" },
    { id: "ayah",  name: "ayah",  emoji: "👨" },
    { id: "nenek", name: "nenek", emoji: "👵" },
    { id: "kakek", name: "kakek", emoji: "👴" },
    { id: "bayi",  name: "bayi",  emoji: "👶" },
    { id: "anak",  name: "anak",  emoji: "🧒" },
  ],

  /* ---- Emosi / perasaan ---- */
  emotions: [
    { id: "senang",    name: "senang",    emoji: "😊" },
    { id: "sedih",     name: "sedih",     emoji: "😢" },
    { id: "marah",     name: "marah",     emoji: "😠" },
    { id: "takut",     name: "takut",     emoji: "😨" },
    { id: "terkejut",  name: "terkejut",  emoji: "😮" },
    { id: "mengantuk", name: "mengantuk", emoji: "😴" },
    { id: "malu",      name: "malu",      emoji: "😳" },
    { id: "sakit",     name: "sakit",     emoji: "🤒" },
    { id: "tertawa",   name: "tertawa",   emoji: "😄" },
    { id: "menangis",  name: "menangis",  emoji: "😭" },
  ],

  /* ---- Rutinitas harian (cerita sosial langkah demi langkah) ---- */
  routines: [
    {
      id: "cuci_tangan", title: "Cuci Tangan", emoji: "🧼",
      steps: [
        { emoji: "💧", text: "Basahi tangan dengan air." },
        { emoji: "🧼", text: "Ambil sabun secukupnya." },
        { emoji: "👐", text: "Gosok kedua tangan sampai berbusa." },
        { emoji: "💦", text: "Bilas tangan dengan air bersih." },
        { emoji: "🧻", text: "Keringkan tangan. Selesai!" },
      ],
    },
    {
      id: "gosok_gigi", title: "Gosok Gigi", emoji: "🪥",
      steps: [
        { emoji: "🪥", text: "Ambil sikat gigimu." },
        { emoji: "🧴", text: "Beri sedikit pasta gigi." },
        { emoji: "😬", text: "Gosok gigi pelan-pelan." },
        { emoji: "💧", text: "Kumur dengan air." },
        { emoji: "😁", text: "Gigi bersih. Selesai!" },
      ],
    },
    {
      id: "berpakaian", title: "Berpakaian", emoji: "👕",
      steps: [
        { emoji: "🩲", text: "Pakai pakaian dalam." },
        { emoji: "👕", text: "Pakai baju." },
        { emoji: "👖", text: "Pakai celana." },
        { emoji: "🧦", text: "Pakai kaus kaki." },
        { emoji: "👟", text: "Pakai sepatu. Kamu rapi!" },
      ],
    },
    {
      id: "makan", title: "Waktu Makan", emoji: "🍽️",
      steps: [
        { emoji: "🧼", text: "Cuci tangan dahulu." },
        { emoji: "🪑", text: "Duduk di kursi." },
        { emoji: "🍚", text: "Makan pelan-pelan." },
        { emoji: "🥛", text: "Minum air." },
        { emoji: "🧽", text: "Bersihkan meja. Terima kasih!" },
      ],
    },
    {
      id: "rapikan", title: "Rapikan Mainan", emoji: "🧸",
      steps: [
        { emoji: "🧸", text: "Kumpulkan semua mainan." },
        { emoji: "📦", text: "Masukkan ke dalam kotak." },
        { emoji: "🧹", text: "Sapu lantai sebentar." },
        { emoji: "👏", text: "Kamar rapi. Hebat!" },
      ],
    },
    {
      id: "sekolah", title: "Siap ke Sekolah", emoji: "🎒",
      steps: [
        { emoji: "☀️", text: "Bangun pagi." },
        { emoji: "🛁", text: "Mandi sampai bersih." },
        { emoji: "👕", text: "Pakai seragam." },
        { emoji: "🍞", text: "Sarapan dahulu." },
        { emoji: "🎒", text: "Bawa tas. Berangkat sekolah!" },
      ],
    },
    {
      id: "tidur", title: "Waktu Tidur", emoji: "🌙",
      steps: [
        { emoji: "🛁", text: "Mandi sebelum tidur." },
        { emoji: "👕", text: "Pakai baju tidur." },
        { emoji: "🪥", text: "Gosok gigi." },
        { emoji: "📖", text: "Baca buku cerita." },
        { emoji: "😴", text: "Tidur nyenyak. Selamat malam!" },
      ],
    },
  ],

  /* ---- Papan Bicara (AAC) ---- */
  aac: [
    {
      id: "inti", label: "Inti", emoji: "💬",
      cards: [
        { text: "aku",          emoji: "🧒" },
        { text: "kamu",         emoji: "👉" },
        { text: "mau",          emoji: "🙌" },
        { text: "tidak mau",    emoji: "🙅" },
        { text: "ya",           emoji: "👍" },
        { text: "tidak",        emoji: "👎" },
        { text: "tolong",       emoji: "🤲" },
        { text: "terima kasih", emoji: "🙏" },
        { text: "lagi",         emoji: "🔁" },
        { text: "selesai",      emoji: "✅" },
        { text: "suka",         emoji: "❤️" },
        { text: "lihat",        emoji: "👀" },
      ],
    },
    {
      id: "makan", label: "Makan", emoji: "🍚",
      cards: [
        { text: "makan",   emoji: "🍽️" },
        { text: "minum",   emoji: "🥤" },
        { text: "air",     emoji: "💧" },
        { text: "susu",    emoji: "🥛" },
        { text: "nasi",    emoji: "🍚" },
        { text: "roti",    emoji: "🍞" },
        { text: "buah",    emoji: "🍎" },
        { text: "kue",     emoji: "🧁" },
        { text: "lapar",   emoji: "😋" },
        { text: "haus",    emoji: "😓" },
        { text: "kenyang", emoji: "🤗" },
        { text: "enak",    emoji: "😍" },
      ],
    },
    {
      id: "perasaan", label: "Perasaan", emoji: "😊",
      cards: [
        { text: "senang", emoji: "😊" },
        { text: "sedih",  emoji: "😢" },
        { text: "marah",  emoji: "😠" },
        { text: "takut",  emoji: "😨" },
        { text: "sakit",  emoji: "🤒" },
        { text: "lelah",  emoji: "😴" },
        { text: "bosan",  emoji: "😐" },
        { text: "kaget",  emoji: "😮" },
        { text: "sayang", emoji: "🥰" },
      ],
    },
    {
      id: "aktivitas", label: "Aktivitas", emoji: "🎈",
      cards: [
        { text: "main",        emoji: "🧸" },
        { text: "baca",        emoji: "📖" },
        { text: "jalan-jalan", emoji: "🚶" },
        { text: "nonton",      emoji: "📺" },
        { text: "musik",       emoji: "🎵" },
        { text: "belajar",     emoji: "✏️" },
        { text: "gambar",      emoji: "🖍️" },
        { text: "tidur",       emoji: "🛏️" },
        { text: "mandi",       emoji: "🛁" },
      ],
    },
    {
      id: "orang", label: "Orang", emoji: "👪",
      cards: [
        { text: "ibu",    emoji: "👩" },
        { text: "ayah",   emoji: "👨" },
        { text: "kakak",  emoji: "🧑" },
        { text: "adik",   emoji: "🧒" },
        { text: "nenek",  emoji: "👵" },
        { text: "kakek",  emoji: "👴" },
        { text: "guru",   emoji: "🧑‍🏫" },
        { text: "teman",  emoji: "🤝" },
        { text: "dokter", emoji: "🧑‍⚕️" },
      ],
    },
    {
      id: "tempat", label: "Tempat", emoji: "🏠",
      cards: [
        { text: "rumah",       emoji: "🏠" },
        { text: "sekolah",     emoji: "🏫" },
        { text: "kamar",       emoji: "🛏️" },
        { text: "kamar mandi", emoji: "🚽" },
        { text: "taman",       emoji: "🌳" },
        { text: "toko",        emoji: "🏪" },
        { text: "pasar",       emoji: "🛒" },
        { text: "rumah sakit", emoji: "🏥" },
      ],
    },
    {
      id: "kebutuhan", label: "Kebutuhan", emoji: "🆘",
      cards: [
        { text: "toilet",    emoji: "🚽" },
        { text: "minum",     emoji: "🥤" },
        { text: "istirahat", emoji: "🛋️" },
        { text: "pelukan",   emoji: "🤗" },
        { text: "bantuan",   emoji: "🙋" },
        { text: "sakit",     emoji: "🤕" },
        { text: "gendong",   emoji: "👐" },
        { text: "pulang",    emoji: "🏠" },
      ],
    },
  ],

  /* ---- Lencana (badge) ---- */
  badges: [
    { id: "bintang_pertama", emoji: "⭐", title: "Bintang Pertama", desc: "Dapat bintang pertamamu." },
    { id: "pengumpul",       emoji: "🌟", title: "Pengumpul Bintang", desc: "Kumpulkan 25 bintang." },
    { id: "rajin",           emoji: "🎖️", title: "Rajin Belajar", desc: "Kumpulkan 50 bintang." },
    { id: "juara",           emoji: "🏆", title: "Juara Kecil", desc: "Kumpulkan 100 bintang." },
    { id: "pelangi",         emoji: "🌈", title: "Pelangi", desc: "Main semua permainan belajar." },
    { id: "sahabat_hewan",   emoji: "🐾", title: "Sahabat Hewan", desc: "Dengar suara di Suara Hewan." },
    { id: "penyayang",       emoji: "💖", title: "Anak Mandiri", desc: "Selesaikan satu rutinitas." },
    { id: "jagoan_bicara",   emoji: "🗣️", title: "Jagoan Bicara", desc: "Gunakan Papan Bicara." },
  ],
};
