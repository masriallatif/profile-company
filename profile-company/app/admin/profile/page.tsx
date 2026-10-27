"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ProfilePage() {
  const [nama, setNama] = useState("SMK MVP ARS Internasional")
  const [alamat, setAlamat] = useState("")
  const [telepon, setTelepon] = useState("")
  const [email, setEmail] = useState("")
  const [pesan, setPesan] = useState("")

  function simpan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPesan("Tersimpan (sementara).")
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Profil Sekolah</h1>

      <form
        onSubmit={simpan}
        className="mt-4 w-full max-w-md space-y-3 rounded-lg border p-4"
      >
        <div className="space-y-1">
          <label className="text-xs font-medium">Nama Sekolah</label>
          <Input value={nama} onChange={(e) => setNama(e.target.value)} />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Alamat</label>
          <Input value={alamat} onChange={(e) => setAlamat(e.target.value)} />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Telepon</label>
          <Input value={telepon} onChange={(e) => setTelepon(e.target.value)} />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" size="sm">
            Simpan
          </Button>
          {pesan && <span className="text-xs text-green-600">{pesan}</span>}
        </div>
      </form>
    </div>
  )
}