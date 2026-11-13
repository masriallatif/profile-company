import Image from "next/image"
import { MenuLandingPage } from "./components/landing-page-hero/landing-page-hero"

const jurusan = [
  { nama: "Teknik Komputer dan Jaringan", singkat: "TKJ", desc: "Jaringan, server, dan infrastruktur IT." },
  { nama: "Rekayasa Perangkat Lunak", singkat: "RPL", desc: "Pemrograman web, mobile, dan aplikasi." },
  { nama: "Akuntansi", singkat: "AK", desc: "Pencatatan keuangan dan perpajakan." },
  { nama: "Multimedia", singkat: "MM", desc: "Desain grafis, video, dan animasi." },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b-4 border-orange-500 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <a href="/" className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Logo SMK MVP ARS Internasional"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
              priority
            />
            <div className="leading-tight">
              <p className="text-lg font-extrabold text-blue-800">SMK MVP ARS</p>
              <p className="text-xs font-semibold tracking-widest text-orange-500">
                INTERNASIONAL
              </p>
            </div>
          </a>
          <MenuLandingPage />
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <span className="inline-block rounded-full bg-orange-500 px-4 py-1 text-sm font-semibold">
            Penerimaan Peserta Didik Baru
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            SMK MVP ARS INTERNASIONAL
          </h1>
          <p className="mt-6 text-lg text-blue-100">
            Mencetak lulusan yang kompeten, berkarakter, dan siap bersaing di
            dunia kerja maupun global.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="/"
              className="rounded-full bg-orange-500 px-8 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Daftar Sekarang
            </a>
            <a
              href="#jurusan"
              className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-800"
            >
              Lihat Jurusan
            </a>
          </div>
        </div>
      </section>

      {/* JURUSAN */}
      <section id="jurusan" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-extrabold text-blue-800">
          Program Keahlian
        </h2>
        <div className="mx-auto mt-2 h-1 w-20 rounded bg-orange-500" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {jurusan.map((j) => (
            <div
              key={j.singkat}
              className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-800 text-lg font-bold text-white">
                {j.singkat}
              </div>
              <h3 className="mt-4 font-bold text-blue-800">{j.nama}</h3>
              <p className="mt-2 text-sm text-slate-600">{j.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-4 border-orange-500 bg-blue-900 py-8 text-center text-sm text-blue-100">
        © {new Date().getFullYear()} SMK MVP ARS Internasional. All rights reserved.
      </footer>
    </div>
  )
}