"use client"

import { useCallback, useEffect, useState } from "react"
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
  title: string
  content: string
  status: string
  categoryId: number | null
  category: { id: number; name: string } | null
  author: { id: number; fullname: string } | null
}

type Kategori = { id: number; name: string }

export default function ArtikelPage() {
  const [data, setData] = useState<Artikel[]>([])
  const [kategori, setKategori] = useState<Kategori[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formTerbuka, setFormTerbuka] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [judul, setJudul] = useState("")
  const [isi, setIsi] = useState("")
  const [status, setStatus] = useState("draft")
  const [kategoriId, setKategoriId] = useState("")
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const muatData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const [resArtikel, resKategori] = await Promise.all([
        fetch("/api/artikel"),
        fetch("/api/categories"),
      ])

      if (resArtikel.status === 401 || resKategori.status === 401) {
        window.location.href = "/"
        return
      }

      const jsonArtikel = await resArtikel.json().catch(() => null)
      const jsonKategori = await resKategori.json().catch(() => null)

      if (!resArtikel.ok) {
        setError(jsonArtikel?.error ?? "Gagal memuat artikel.")
        return
      }

      setData(jsonArtikel.artikel)
      setKategori(resKategori.ok ? jsonKategori.categories : [])
    } catch {
      setError("Tidak bisa terhubung ke server.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    muatData()
  }, [muatData])

  function bukaTambah() {
    setEditId(null)
    setJudul("")
    setIsi("")
    setStatus("draft")
    setKategoriId("")
    setError("")
    setFormTerbuka(true)
  }

  function bukaEdit(a: Artikel) {
    setEditId(a.id)
    setJudul(a.title)
    setIsi(a.content)
    setStatus(a.status === "terbit" ? "terbit" : "draft")
    setKategoriId(a.categoryId ? String(a.categoryId) : "")
    setError("")
    setFormTerbuka(true)
  }

  function tutup() {
    setJudul("")
    setIsi("")
    setStatus("draft")
    setKategoriId("")
    setEditId(null)
    setError("")
    setFormTerbuka(false)
  }

  async function simpan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    if (!judul.trim() || !isi.trim()) {
      setError("Judul dan isi wajib diisi.")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(editId ? `/api/artikel/${editId}` : "/api/artikel", {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: judul.trim(),
          content: isi.trim(),
          status,
          categoryId: kategoriId ? Number(kategoriId) : null,
        }),
      })

      if (res.status === 401) {
        window.location.href = "/"
        return
      }

      const json = await res.json().catch(() => null)

      if (!res.ok) {
        setError(json?.error ?? "Gagal menyimpan artikel.")
        return
      }

      tutup()
      await muatData()
    } catch {
      setError("Tidak bisa terhubung ke server.")
    } finally {
      setSaving(false)
    }
  }

  async function hapus(a: Artikel) {
    const yakin = window.confirm(`Hapus artikel "${a.title}"?`)
    if (!yakin) return

    setDeletingId(a.id)
    setError("")
    try {
      const res = await fetch(`/api/artikel/${a.id}`, { method: "DELETE" })

      if (res.status === 401) {
        window.location.href = "/"
        return
      }

      const json = await res.json().catch(() => null)

      if (!res.ok) {
        setError(json?.error ?? "Gagal menghapus artikel.")
        return
      }

      await muatData()
    } catch {
      setError("Tidak bisa terhubung ke server.")
    } finally {
      setDeletingId(null)
    }
  }

  if (formTerbuka) {
    return (
      <div className="p-6">
        <Button variant="outline" size="sm" onClick={tutup}>
          ← Kembali
        </Button>
        <h1 className="mt-4 text-2xl font-bold">
          {editId ? "Edit Artikel" : "Tambah Artikel"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {editId
            ? "Ubah data artikel, lalu klik Simpan."
            : "Isi data artikel baru, lalu klik Simpan."}
        </p>

        <form onSubmit={simpan} className="mt-6 space-y-4 rounded-lg border p-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-sm font-medium">Judul</label>
            <Input value={judul} onChange={(e) => setJudul(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Kategori</label>
              <select
                value={kategoriId}
                onChange={(e) => setKategoriId(e.target.value)}
                className="h-9 w-full rounded-lg border bg-transparent px-3 text-sm"
              >
                <option value="">- Tanpa kategori -</option>
                {kategori.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-9 w-full rounded-lg border bg-transparent px-3 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="terbit">Terbit</option>
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
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
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
        <Button onClick={bukaTambah}>Tambah Artikel</Button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-lg border">
        <Table>
          <TableCaption>Daftar artikel.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  Belum ada artikel.
                </TableCell>
              </TableRow>
            ) : (
              data.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.id}</TableCell>
                  <TableCell>{a.title}</TableCell>
                  <TableCell>{a.category?.name ?? "-"}</TableCell>
                  <TableCell>{a.author?.fullname ?? "-"}</TableCell>
                  <TableCell>{a.status === "terbit" ? "Terbit" : "Draft"}</TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button size="sm" variant="outline" onClick={() => bukaEdit(a)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deletingId === a.id}
                      onClick={() => hapus(a)}
                    >
                      {deletingId === a.id ? "Menghapus..." : "Hapus"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}