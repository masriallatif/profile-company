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

type Kategori = { id: number; nama: string; slug: string; deskripsi: string }

export default function CategoryPage() {
  const [data, setData] = useState<Kategori[]>([
    { id: 1, nama: "Berita", slug: "berita", deskripsi: "Kabar terbaru sekolah" },
    { id: 2, nama: "Pengumuman", slug: "pengumuman", deskripsi: "Informasi resmi sekolah" },
    { id: 3, nama: "Prestasi", slug: "prestasi", deskripsi: "Prestasi siswa dan guru" },
  ])
  const [tambah, setTambah] = useState(false)
  const [nama, setNama] = useState("")
  const [slug, setSlug] = useState("")
  const [deskripsi, setDeskripsi] = useState("")

  function tutup() {
    setNama("")
    setSlug("")
    setDeskripsi("")
    setTambah(false)
  }

  function simpan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!nama.trim()) return
    const id = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1
    const slugFinal =
      slug.trim() || nama.trim().toLowerCase().replace(/\s+/g, "-")
    setData([...data, { id, nama, slug: slugFinal, deskripsi }])
    tutup()
  }

  if (tambah) {
    return (
      <div className="p-6">
        <Button variant="outline" size="sm" onClick={tutup}>
          ← Kembali
        </Button>
        <h1 className="mt-4 text-2xl font-bold">Tambah Kategori</h1>
        <p className="mt-1 text-muted-foreground">
          Isi data kategori baru, lalu klik Simpan.
        </p>

        <form onSubmit={simpan} className="mt-6 space-y-4 rounded-lg border p-6">
          <div className="space-y-1">
            <label className="text-sm font-medium">Nama</label>
            <Input value={nama} onChange={(e) => setNama(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Slug (kosongkan = otomatis)
            </label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
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
          <h1 className="text-2xl font-bold">Kategori</h1>
          <p className="mt-1 text-muted-foreground">
            Kelompokkan artikel berdasarkan kategori.
          </p>
        </div>
        <Button onClick={() => setTambah(true)}>Tambah Kategori</Button>
      </div>

      <div className="mt-6 rounded-lg border">
        <Table>
          <TableCaption>Daftar kategori.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((k) => (
              <TableRow key={k.id}>
                <TableCell className="font-medium">{k.id}</TableCell>
                <TableCell>{k.nama}</TableCell>
                <TableCell>{k.slug}</TableCell>
                <TableCell>{k.deskripsi}</TableCell>
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