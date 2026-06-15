# Bintang Kecil ⭐

**🔗 Buka aplikasinya: <https://agasabot.github.io/bintang-kecil/>**
(buka di HP/tablet, lalu pilih **"Tambahkan ke Layar Utama"** agar seperti aplikasi sungguhan)

Aplikasi belajar **berbahasa Indonesia** untuk anak dengan **autisme dan kebutuhan khusus** —
terinspirasi oleh Otsimo, tetapi dibuat khusus untuk anak-anak Indonesia.

Tanpa iklan · tanpa tautan keluar · aman untuk anak · bisa dipakai **tanpa internet** ·
gratis di-host di **GitHub Pages** (sama seperti situs CYE).

Ini adalah **web app (PWA)**: dibuka lewat browser di HP/tablet mana pun, dan bisa
**"Tambahkan ke Layar Utama"** sehingga terasa seperti aplikasi sungguhan — tanpa biaya app store.

## Isi aplikasi

**🎒 Ayo Belajar** — permainan pilih-jawaban yang lembut, dengan suara bahasa Indonesia:
- **Warna** · **Bentuk** · **Angka** (berhitung) · **Hewan** (lengkap dengan bunyinya) ·
  **Kata** (kosakata sehari-hari) · **Perasaan** (emosi) · **Cari Pasangan** (kartu memori)

**💬 Ayo Bicara — Papan Bicara (AAC)**
Anak yang belum/sulit bicara mengetuk kartu gambar (mau, makan, minum, toilet, senang, sakit…),
kalimatnya tersusun di atas, lalu perangkat **mengucapkannya dengan suara Indonesia**.

**🌙 Kegiatan Harian — Rutinitas**
Cerita sosial langkah demi langkah: Cuci Tangan, Gosok Gigi, Waktu Tidur, Waktu Makan.

**👪 Untuk Orang Tua** (di balik gerbang soal hitung sederhana)
- Kemajuan per keterampilan, jumlah bintang & lencana
- Pengaturan: suara efek, suara bicara, animasi (bisa dimatikan untuk anak yang mudah terstimulasi),
  tingkat kesulitan (mudah/sedang), dan atur ulang kemajuan

**Penghargaan** — bintang ⭐ untuk setiap jawaban benar, lencana 🏅 untuk pencapaian,
dan perayaan kecil di akhir permainan (animasi bisa dimatikan).

## Dibuat ramah autisme

- Warna lembut & hangat, sedikit gangguan visual, satu tugas dalam satu layar
- Sasaran sentuh besar, navigasi yang dapat diprediksi
- Tidak ada nada keras/menakutkan — jawaban salah dijawab "coba lagi ya", tanpa hukuman
- Animasi & suara dapat dimatikan; menghormati pengaturan *reduce motion* perangkat
- Mendukung mode gelap perangkat

## Teknologi

Situs statis murni — **tanpa build step**, sama seperti situs CYE.

| Berkas | Fungsi |
|--------|--------|
| `index.html` | Kerangka halaman |
| `styles.css` | Sistem desain ramah anak |
| `data.js` | Semua materi (warna, hewan, kata, kartu AAC, rutinitas, lencana) dalam Bahasa Indonesia |
| `app.js` | Mesin aplikasi: navigasi, permainan, suara, bintang/lencana, dasbor |
| `audio/` | **Klip suara Bahasa Indonesia** (MP3) untuk tiap kata, perintah & kalimat |
| `tools/gen-audio.js` | Pembuat berkas `audio/` (dijalankan di macOS) |
| `manifest.webmanifest` · `sw.js` · `icon.svg` | Agar bisa di-*install* & dipakai offline (PWA) |

### Suara Bahasa Indonesia

Agar pelafalan benar dan **sama di semua perangkat**, aplikasi tidak mengandalkan suara
bawaan HP (yang sering jatuh ke suara Inggris bila suara Indonesia belum terpasang).
Sebagai gantinya, aplikasi **memutar klip MP3 berbahasa Indonesia** yang sudah disiapkan
(suara *Damayanti*, `id-ID`). Suara bawaan perangkat hanya dipakai sebagai cadangan.

Membuat ulang berkas suara (mis. setelah menambah kata di `data.js`) — butuh **macOS**
(memakai perintah `say` + `ffmpeg`):

```bash
node tools/gen-audio.js   # menulis ulang folder audio/ lalu commit
```

> Untuk kualitas suara terbaik di masa depan, klip bisa diganti dengan rekaman suara
> manusia atau TTS neural berlisensi — aplikasi hanya memutar berkas dari `audio/`,
> jadi penggantian cukup menimpa berkasnya.

## Jalankan secara lokal

```bash
cd bintang-kecil
python3 -m http.server 8000   # lalu buka http://localhost:8000
```

> Buka lewat `http://localhost` (bukan klik berkas langsung) agar service worker & suara aktif.

## Hosting (GitHub Pages)

Sama persis dengan alur situs CYE: buat repo, aktifkan **Pages** dari branch `main` (root).
Berkas `.nojekyll` sudah disertakan. Domain kustom bisa ditambahkan lewat berkas `CNAME`
dan DNS, lalu GitHub memberi sertifikat HTTPS gratis.

## Catatan

"Bintang Kecil" dipakai hanya sebagai **nama merek** aplikasi. Materi lagu apa pun tidak disertakan.
