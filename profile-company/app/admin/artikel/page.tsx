"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Artikel = {
  id: number
  judul: string
  kategori: string
  status: string
  isi: string
}

export default function ArtikelPage() {
  const [data, setData] = useState<Artikel[]>([
    { id: 1, judul: "PPDB 2026/2027 Resmi Dibuka", kategori: "Pengumuman", status: "Terbit", isi: "" },
    { id: 2, judul: "Siswa RPL Juara Lomba Web Design", kategori: "Prestasi", status: "Draft", isi: "" },
  ])
  const [tambah, setTambah] = useState(false)
  const [judul, setJudul] = useState("")
  const [kategori, setKategori] = useState("Berita")
  const [status, setStatus] = useState("Draft")
  const [isi, setIsi] = useState("")

  function tutup() {
    setJudul("")
    setKategori("Berita")
    setStatus("Draft")
    setIsi("")
    setTambah(false)
  }

  function simpan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!judul.trim()) return
    const id = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1
    setData([...data, { id, judul, kategori, status, isi }])
    tutup()
  }

  if (tambah) {
    return (
      <div className="p-6">
        <Button variant="outline" size="sm" onClick={tutup}>
          ← Kembali
        </Button>
        <h1 className="mt-4 text-2xl font-bold">Tambah Artikel</h1>
        <p className="mt-1 text-muted-foreground">
          Tulis artikel baru, lalu klik Simpan.
        </p>

        <form onSubmit={simpan} className="mt-6 space-y-4 rounded-lg border p-6">
          <div className="space-y-1">
            <label className="text-sm font-medium">Judul</label>
            <Input value={judul} onChange={(e) => setJudul(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Kategori</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="h-9 w-full rounded-lg border bg-transparent px-3 text-sm"
              >
                <option>Berita</option>
                <option>Pengumuman</option>
                <option>Prestasi</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-9 w-full rounded-lg border bg-transparent px-3 text-sm"
              >
                <option>Draft</option>
                <option>Terbit</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Isi Artikel</label>
            <textarea
              rows={10}
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">Simpan</Button>
            <Button type="button" variant="outline" onClick={tutup}>
              Batal
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Artikel</h1>
          <p className="mt-1 text-muted-foreground">
            Tulis dan kelola berita, pengumuman, dan prestasi.
          </p>
        </div>
        <Button onClick={() => setTambah(true)}>Tambah Artikel</Button>
      </div>

      <div className="mt-6 rounded-lg border">
        <Table>
          <TableCaption>Daftar artikel.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.id}</TableCell>
                <TableCell>{a.judul}</TableCell>
                <TableCell>{a.kategori}</TableCell>
                <TableCell>{a.status}</TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="destructive">Hapus</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}