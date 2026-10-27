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

type Jurusan = { id: number; singkatan: string; nama: string; deskripsi: string }

export default function JurusanPage() {
  const [data, setData] = useState<Jurusan[]>([
    { id: 1, singkatan: "TKJ", nama: "Teknik Komputer dan Jaringan", deskripsi: "Jaringan, server, dan infrastruktur IT." },
    { id: 2, singkatan: "RPL", nama: "Rekayasa Perangkat Lunak", deskripsi: "Pemrograman web, mobile, dan aplikasi." },
    { id: 3, singkatan: "AK", nama: "Akuntansi", deskripsi: "Pencatatan keuangan dan perpajakan." },
    { id: 4, singkatan: "MM", nama: "Multimedia", deskripsi: "Desain grafis, video, dan animasi." },
  ])
  const [tambah, setTambah] = useState(false)
  const [singkatan, setSingkatan] = useState("")
  const [nama, setNama] = useState("")
  const [deskripsi, setDeskripsi] = useState("")

  function tutup() {
    setSingkatan("")
    setNama("")
    setDeskripsi("")
    setTambah(false)
  }

  function simpan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!singkatan.trim() || !nama.trim()) return
    const id = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1
    setData([...data, { id, singkatan: singkatan.toUpperCase(), nama, deskripsi }])
    tutup()
  }

  if (tambah) {
    return (
      <div className="p-6">
        <Button variant="outline" size="sm" onClick={tutup}>
          ← Kembali
        </Button>
        <h1 className="mt-4 text-2xl font-bold">Tambah Jurusan</h1>
        <p className="mt-1 text-muted-foreground">
          Isi data jurusan baru, lalu klik Simpan.
        </p>

        <form onSubmit={simpan} className="mt-6 space-y-4 rounded-lg border p-6">
          <div className="space-y-1">
            <label className="text-sm font-medium">Singkatan</label>
            <Input value={singkatan} onChange={(e) => setSingkatan(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Nama Jurusan</label>
            <Input value={nama} onChange={(e) => setNama(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Deskripsi</label>
            <textarea
              rows={4}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
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
          <h1 className="text-2xl font-bold">Jurusan</h1>
          <p className="mt-1 text-muted-foreground">
            Kelola program keahlian sekolah.
          </p>
        </div>
        <Button onClick={() => setTambah(true)}>Tambah Jurusan</Button>
      </div>

      <div className="mt-6 rounded-lg border">
        <Table>
          <TableCaption>Daftar jurusan.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Singkatan</TableHead>
              <TableHead>Nama Jurusan</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((j) => (
              <TableRow key={j.id}>
                <TableCell className="font-medium">{j.id}</TableCell>
                <TableCell>{j.singkatan}</TableCell>
                <TableCell>{j.nama}</TableCell>
                <TableCell>{j.deskripsi}</TableCell>
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