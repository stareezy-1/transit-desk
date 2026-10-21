# Skrip video implementasi Transit Desk

**Bahasa narasi:** Indonesia. **Target durasi:** sekitar 9 menit, dengan batas maksimal 10 menit sesuai tes. Timestamp adalah panduan latihan; sesuaikan tempo dengan waktu klik dan respons aplikasi.

Repo public: https://github.com/stareezy-1/transit-desk

Versi Inggris: [video-script.md](video-script.md).

Baca bagian **Narasi**. Bagian **Di layar** dan **Cue** merupakan petunjuk demo, tidak perlu diucapkan. Istilah tombol dan nama kode tetap mengikuti aplikasi agar mudah dicocokkan.

## Persiapan sebelum rekaman

- Jalankan `npm ci`, salin `.env.example` menjadi `.env.local`, lalu jalankan `npm run dev`.
- Buka `http://127.0.0.1:3000`. Pastikan ada kendaraan yang sedang melapor. Jumlah kendaraan berubah, jadi tunjukkan angka yang terlihat saat demo.
- Siapkan tampilan desktop dan mode responsif 390 px. Tutup notifikasi serta jendela yang tidak terkait.
- Buka file yang disebut pada setiap segmen di tab editor. Jangan tampilkan `.env.local`, token, atau pengaturan akun.
- Jalankan `npm test` dan `npm run build` sebelum merekam. Gunakan output yang benar-benar dihasilkan pada sesi tersebut.
- Pilih rute yang saat itu memiliki kendaraan. Catat ID trip dari salah satu popup detail. Daftar trip memuat jadwal, sehingga sebagian pilihan mungkin tidak memiliki kendaraan aktif.
- Latihan sekali dengan stopwatch. Jika mendekati 10 menit, persingkat perpindahan file dan bagian tambahan SEO. Pertahankan penjelasan pengambilan data, UI, dan pagination karena ketiganya wajib dalam video.

## 0:00–0:35 | Pembukaan

**Di layar:** Repo GitHub, lalu pindah ke halaman aplikasi.

**Narasi:**

> Halo, saya Bintang. Di video ini saya akan mendemokan Transit Desk, aplikasi yang saya buat untuk tes frontend sistem manajemen armada.
>
> Saya menggunakan Next.js App Router, React, TypeScript, dan Tailwind CSS. Data kendaraannya berasal dari REST API MBTA yang disebutkan dalam soal, jadi wilayah yang tampil di sini adalah Greater Boston.
>
> Saya mulai dari cara memakai aplikasinya, kemudian masuk ke pengambilan data, pagination, dan struktur kodenya.

## 0:35–1:25 | Membaca kartu dan membuka detail

**Di layar:** Gulir ke **The fleet**. Tunjuk label, status, koordinat, dan **Last signal**. Klik **Details**, tunjuk peta serta data rute dan trip. Tutup dengan Escape.

**Narasi:**

> Ini daftar kendaraannya. Setiap kartu menampilkan label kendaraan, status saat ini, latitude, longitude, dan waktu laporan terakhir sesuai kebutuhan tes.
>
> Saya buka salah satu detailnya. Di popup ini ada rute, trip, tujuan, halte, arah perjalanan, serta informasi tambahan kalau tersedia dari API.
>
> Untuk bonus peta, saya memakai Leaflet dengan tile OpenStreetMap. Posisi marker mengikuti koordinat kendaraan. Kalau koordinat tidak tersedia, aplikasi menampilkan keterangan dan tidak membuat marker perkiraan.
>
> Status seperti At stop menunjukkan posisi kendaraan terhadap halte. Dari status itu saja kita belum bisa menyimpulkan apakah kendaraannya terlambat.
>
> Saat popup ditutup, fokus kembali ke tombol kendaraan yang tadi dibuka.

## 1:25–2:30 | Alur pencarian dan filter

**Di layar:** Cari label kendaraan yang terlihat, lalu kosongkan pencarian. Buka **Routes**, pilih dua rute, gulir untuk lazy load. Buka **Trips** dan pilih lebih dari satu. Tunjuk chip pilihan, hapus salah satu, lalu ubah rute. Akhiri dengan **Reset**.

**Narasi:**

> Untuk mencari kendaraan tertentu, pengguna bisa mengetik label, ID, rute, atau tujuan di kolom ini.
>
> Kalau ingin mempersempit hasil, ada dropdown Routes dan Trips. Keduanya mendukung lebih dari satu pilihan. Opsi diambil dari endpoint masing-masing, dua puluh lima data per batch.
>
> Saat menu digulir mendekati bagian bawah, batch berikutnya dimuat. Ada juga tombol Load more. Pencarian di dalam dropdown hanya memeriksa opsi yang sudah dimuat, dan batasan itu dijelaskan di menunya.
>
> Dua pilihan rute berarti kendaraan boleh berasal dari salah satu rute tersebut. Kalau ditambahkan filter trip, kendaraan juga harus cocok dengan trip yang dipilih.
>
> Pilihan aktif terlihat di sini dan bisa dihapus satu per satu. Ketika rute diubah, pilihan trip dikosongkan supaya tidak menyimpan trip dari rute sebelumnya. Jika tidak ada kendaraan yang cocok, pengguna mendapat penjelasan dan tombol untuk menghapus filter.

**Cue:** Jika trip yang dipilih menghasilkan data kosong, gunakan itu untuk menjelaskan empty state. Tidak perlu mencari kombinasi baru berulang kali saat merekam.

## 2:30–3:15 | Pagination

**Di layar:** Tunjuk rentang data, total, dan jumlah halaman. Klik **Next page** atau nomor halaman. Ubah **Per page** menjadi 12, lalu kembalikan ke 6. Buka fungsi `paginate` di `src/modules/fleet/utils/vehicles.ts`.

**Narasi:**

> Di bawah daftar ada rentang data yang sedang tampil, total kendaraan yang cocok, dan jumlah halaman.
>
> Pagination saya buat dengan fungsi TypeScript sederhana. Input-nya daftar yang sudah difilter, nomor halaman, dan jumlah data per halaman. Fungsi ini menghitung potongan data beserta informasi rentangnya.
>
> Pengguna bisa memilih enam, dua belas, atau dua puluh empat kendaraan per halaman. Saat halaman diganti, tampilan diarahkan kembali ke hasil agar pengguna langsung melihat kartu yang baru.
>
> Perubahan filter mengembalikan posisi ke halaman pertama. Tombol Reset mempertahankan pilihan jumlah data per halaman. Kalau jumlah kendaraan berkurang setelah refresh, halaman yang dipilih juga disesuaikan.

## 3:15–4:25 | Cara mengambil dan mengolah data

**Di layar:** Buka berurutan:

1. `src/shared/api-client/index.ts` → `apiRequest`.
2. `src/modules/fleet/services/fleet.service.ts` → `mapVehicle` dan `getFleetSnapshot`.
3. `src/app/api/transit/[...path]/route.ts` → `GET`.

**Narasi:**

> Pengambilan data menggunakan fetch melalui satu API client yang memiliki tipe TypeScript. Di sini saya memasang timeout lima belas detik, mendukung pembatalan request, dan mengubah kegagalan menjadi pesan yang bisa dipahami pengguna.
>
> Saat render awal di server, request langsung menuju MBTA. Request dari browser melewati route handler Next.js di `/api/transit`. Kalau menggunakan API key, key tersebut tetap berada di server.
>
> Respons MBTA mengikuti JSON:API. Data kendaraan dan relasinya dibaca oleh service, lalu dirapikan menjadi model yang dipakai komponen. Service juga mengikuti link halaman berikutnya dan menghapus duplikasi ID kendaraan.
>
> Ada batasan API yang memengaruhi implementasi: filter trip pada endpoint kendaraan tidak boleh digabung dengan filter kendaraan lain. Karena itu, saya mengambil snapshot armada lengkap, lalu menggabungkan filter rute dan trip di client.
>
> Pagination dijalankan setelah filtering, jadi total yang ditampilkan sesuai dengan hasil snapshot tersebut. Kalau skala armadanya jauh lebih besar, penggabungan filter dan perhitungan total sebaiknya dipindahkan ke server.

## 4:25–5:10 | Cache, refresh, loading, dan error

**Di layar:** Buka `src/modules/fleet/hooks/useFleetQueries.ts` dan `src/app/providers.tsx`. Kembali ke aplikasi, klik **Refresh feed**, lalu coba pencarian tanpa hasil dan reset.

**Narasi:**

> Untuk data dari server, saya menggunakan TanStack Query. Query key membedakan snapshot armada, detail kendaraan, dan halaman opsi filter.
>
> Snapshot diperbarui setiap tiga puluh detik saat halaman aktif. Pengguna juga bisa menekan Refresh feed. Waktu sinkronisasi halaman dibedakan dari waktu laporan tiap kendaraan, karena laporan kendaraan bisa lebih lama.
>
> Selama pengambilan data, ada skeleton atau indikator loading. Jika refresh gagal, data terakhir yang berhasil diambil tetap ditampilkan bersama pesan error dan tombol coba lagi.
>
> Kegagalan sementara dicoba ulang satu kali. Respons seperti bad request, data tidak ditemukan, dan rate limit tidak otomatis diulang.

## 5:10–6:20 | Struktur kode dan pembagian state

**Di layar:** Tampilkan folder `src`, lalu buka `src/modules/fleet/index.ts`, `src/modules/fleet/stores/fleet.store.tsx`, `src/app/page.tsx`, dan `src/app/guide/page.tsx`.

**Narasi:**

> Struktur kode saya susun berdasarkan fitur. Modul fleet memiliki halaman, komponen, hooks, service, tipe data, utility, dan store sendiri. Halaman panduan ada di modul guide.
>
> Route mengakses modul lewat file index sebagai pintu masuknya. Komponen membaca data melalui hooks, sementara request dan pengolahan respons ditangani service. Dengan pembagian ini, logika API tidak tersebar di komponen tampilan.
>
> State UI disimpan di Zustand, misalnya filter, pencarian, halaman aktif, dan ID kendaraan yang sedang dibuka. Respons API tetap dikelola TanStack Query. Store dibuat per provider agar state tidak terbagi antar-request server.
>
> Untuk rendering, data armada awal diambil dan dirender di server setiap request. Interaksi filter, pagination, dan popup berjalan di client. Leaflet dimuat secara dinamis di browser saat dibutuhkan.
>
> Halaman guide dibuat statis saat build karena isinya berupa penjelasan yang tidak bergantung pada posisi kendaraan terbaru.

## 6:20–7:15 | Implementasi UI dan pengalaman mobile

**Di layar:** Buka `src/app/globals.css`, `VehicleCard.styles.ts`, dan `TransitBusScene.tsx`. Kembali ke browser, ganti tema dan aktifkan viewport 390 px. Tunjuk kontrol halaman mobile.

**Narasi:**

> Styling menggunakan Tailwind CSS versi empat. Warna ditentukan lewat semantic token, jadi light dan dark mode memakai komponen yang sama. Class untuk tiap komponen disimpan di file styles di sebelahnya.
>
> Popup dan dropdown memakai Radix, sedangkan ikon memakai Phosphor. Animasi bus dibuat khusus dengan SVG dan CSS. Ada kontrol Pause dan Play, serta dukungan reduced motion. Ilustrasinya diberi keterangan supaya tidak dianggap sebagai kendaraan yang sedang dipantau.
>
> Tema awal mengikuti pengaturan sistem. Jika pengguna memilih Light atau Dark, pilihannya disimpan untuk kunjungan berikutnya.
>
> Di mobile, nama tujuan bisa turun baris, tombol memiliki area sentuh lebih besar, dan pagination memakai pemilih halaman langsung. Saat pengguna mengganti halaman, fokus diarahkan ke hasil baru.

## 7:15–8:10 | Pengujian dan perbaikan UX

**Di layar:** Output terbaru `npm test` dan `npm run build`. Tampilkan `docs/pdf-audit.md` serta `docs/ux-review.md`.

**Narasi:**

> Untuk pengujian, unit test mencakup filtering, pagination, perubahan state, pemisahan store, normalisasi respons, dan penanganan error API. Ini hasil test dan build yang saya jalankan sebelum rekaman.
>
> Saya juga menyiapkan fixture lokal agar kondisi seperti request lambat, error, data kosong, koordinat hilang, dan respons rusak bisa diperiksa secara konsisten.
>
> Hasil review UX menghasilkan beberapa perbaikan: fokus kembali ke kendaraan setelah popup ditutup, filter aktif bisa dihapus satu per satu, Reset mempertahankan ukuran halaman, dan opsi pencarian dropdown tetap terlihat pada layar pendek.
>
> Cakupan serta batasan pengujian dicatat di dokumen audit. Pengujian responsif dilakukan di browser pada beberapa ukuran layar dan kedua tema.

## 8:10–8:55 | SEO dan penutup

**Di layar:** Halaman guide, `src/app/layout.tsx`, `src/app/sitemap.ts`, lalu README repo public. Akhiri pada aplikasi.

**Narasi:**

> Sebagai tambahan, aplikasi memiliki metadata halaman, canonical URL, Open Graph, sitemap, dan aturan robots.
>
> Halaman guide berisi jawaban tentang sumber data, filter, status, dan waktu laporan. Structured data untuk FAQ dibuat dari konten yang sama dengan yang terlihat di halaman. Ini membantu mesin pencari dan sistem jawaban memahami konteks aplikasi, tanpa menjanjikan ranking tertentu.
>
> Sebelum deployment, alamat situs perlu diatur agar canonical dan sitemap mengarah ke domain yang benar.
>
> Source code sudah tersedia di repo public ini. README menjelaskan cara menjalankan aplikasi, struktur kode, dan alasan pemilihan implementasinya. Sekian demo Transit Desk dari saya. Terima kasih.

## 8:55–9:30 | Cadangan waktu

Gunakan sisa waktu untuk respons API, perpindahan tab, atau jeda saat menunjukkan kode. Jika sudah mendekati sepuluh menit, langsung tutup setelah segmen terakhir.

## Demonstrasi error tambahan, jika diperlukan

Segmen ini **menggantikan** sebagian penjelasan pengujian. Jangan menambahkannya jika membuat durasi melewati sepuluh menit.

```bash
# Terminal pertama
node tests/support/fixture-server.mjs

# Terminal kedua
TRANSIT_QA=1 TRANSIT_TEST_API_ORIGIN=http://127.0.0.1:4319 npm run dev -- --port 3002
```

Buka kontrol fixture di `http://127.0.0.1:4319/__control` dan aplikasi pengujian di `http://127.0.0.1:3002`.

**Narasi:**

> Untuk memperlihatkan kondisi gagal, saya pindah ke lingkungan pengujian lokal dengan data yang sudah disiapkan.
>
> Saya pilih vehicles-error, lalu tekan Refresh feed. Data terakhir masih terlihat, dan pengguna mendapat pesan serta tombol untuk mencoba lagi.
>
> Sekarang saya kembalikan ke normal dan tekan Try again. Datanya berhasil dimuat kembali.

Untuk loading, pilih `slow`, lalu buka dropdown atau detail yang belum tersimpan di cache. Sebutkan bahwa data ini adalah fixture pengujian. Setelah selesai, hentikan kedua proses terminal.

## Catatan saat demo tidak berjalan sesuai rencana

| Kondisi                               | Respons yang bisa diucapkan                                                                                                                                      |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Filter trip menghasilkan data kosong  | “Trip ini ada di jadwal, tetapi belum tentu memiliki kendaraan yang sedang melapor. Karena itu hasil kosong tetap ditangani dengan penjelasan dan tombol reset.” |
| Peta lambat memuat tile               | “Tile peta berasal dari OpenStreetMap. Koordinat kendaraan tetap tersedia di bawahnya saat tile belum selesai dimuat.”                                           |
| Nilai kecepatan atau occupancy kosong | “Field ini tidak dilaporkan oleh API untuk kendaraan tersebut, jadi aplikasi menampilkan Not reported.”                                                          |
| Jumlah kendaraan berubah saat demo    | “Daftar ini diperbarui berkala, sehingga jumlah kendaraan dapat berubah selama demo.”                                                                            |
| API publik tidak dapat diakses        | “Feed publik sedang tidak tersedia. Saya gunakan fixture lokal untuk memperlihatkan alur aplikasinya dan penanganan error secara konsisten.”                     |

## Checklist sebelum mengirim video

- [ ] Durasi akhir 5–10 menit dan suara terdengar jelas.
- [ ] Metode pengambilan data dijelaskan: fetch, service, route handler, dan TanStack Query.
- [ ] Teknologi UI dijelaskan: React/Next.js, Tailwind, Radix, dan peta.
- [ ] Cara kerja pagination dijelaskan beserta alasan filtering dilakukan sebelum pagination.
- [ ] Kartu kendaraan, multi-select Routes/Trips, lazy loading, detail, dan peta diperlihatkan.
- [ ] Struktur modul, pembagian state, serta SSR/CSR/SSG dijelaskan.
- [ ] Data fixture disebut sebagai data pengujian jika digunakan.
- [ ] Repo public dan README ditampilkan; tidak ada secret atau informasi akun yang ikut terekam.

## Panduan cepat perpindahan file

| Topik                    | File yang dibuka                                                          | Bagian yang ditunjuk                   |
| ------------------------ | ------------------------------------------------------------------------- | -------------------------------------- |
| Pagination               | `src/modules/fleet/utils/vehicles.ts`                                     | `paginate`                             |
| Fetch dan error          | `src/shared/api-client/index.ts`                                          | `apiRequest`                           |
| Normalisasi dan snapshot | `src/modules/fleet/services/fleet.service.ts`                             | `mapVehicle`, `getFleetSnapshot`       |
| Gateway browser          | `src/app/api/transit/[...path]/route.ts`                                  | `GET`                                  |
| Cache dan refresh        | `src/modules/fleet/hooks/useFleetQueries.ts`                              | `useFleetSnapshot`, `useFilterOptions` |
| Retry dan tema           | `src/app/providers.tsx`                                                   | `QueryClient`, `ThemeProvider`         |
| State UI                 | `src/modules/fleet/stores/fleet.store.tsx`                                | `createFleetStore`, `clearFilters`     |
| SSR                      | `src/app/page.tsx`                                                        | `force-dynamic`, data awal             |
| SSG                      | `src/app/guide/page.tsx`                                                  | `force-static`                         |
| Token tema               | `src/app/globals.css`                                                     | Token Light/Dark                       |
| Styles komponen          | `src/modules/fleet/pages/fleet-overview/components/VehicleCard.styles.ts` | Layout responsif                       |
| Animasi                  | `src/modules/fleet/pages/fleet-overview/components/TransitBusScene.tsx`   | SVG dan kontrol Pause/Play             |
| Audit                    | `docs/pdf-audit.md`, `docs/ux-review.md`                                  | Cakupan, hasil, dan batasan            |
