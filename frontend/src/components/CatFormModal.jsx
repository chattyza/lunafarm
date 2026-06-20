import { useState, useEffect, useRef } from 'react'
import { uploadImage } from '../api/cats'

const PERSONALITY_OPTIONS = ['ขี้อ้อน', 'ซน', 'กินเก่ง', 'เงียบ', 'เล่นเก่ง', 'ชอบคน', 'อิสระ', 'ขี้อาย']
const BREED_OPTIONS = ['British Shorthair', 'Scottish Fold', 'Persian', 'Maine Coon', 'Ragdoll', 'Siamese', 'Munchkin']

export default function CatFormModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: '', breed: 'British Shorthair', age_months: '', gender: 'male', color: '',
    weight_kg: '', status: 'available', personality: '', description: '',
    image_url: '', price: '', vaccinated: false, neutered: false,
  })
  const [selectedTags, setSelectedTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef()

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, price: initialData.price || '', weight_kg: initialData.weight_kg || '' })
      setSelectedTags(
        initialData.personality ? initialData.personality.split(',').map((t) => t.trim()).filter(Boolean) : []
      )
    } else {
      setForm({ name: '', breed: 'British Shorthair', age_months: '', gender: 'male', color: '', weight_kg: '', status: 'available', personality: '', description: '', image_url: '', price: '', vaccinated: false, neutered: false })
      setSelectedTags([])
    }
    setUploadError('')
  }, [initialData, open])

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('รองรับเฉพาะไฟล์รูปภาพ')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('ไฟล์ใหญ่เกิน 5 MB')
      return
    }
    setUploadError('')
    setUploading(true)
    try {
      const res = await uploadImage(file)
      setForm((f) => ({ ...f, image_url: res.data.url }))
    } catch {
      setUploadError('อัปโหลดไม่สำเร็จ ลองใหม่อีกครั้ง')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        ...form,
        age_months: parseInt(form.age_months) || 0,
        weight_kg: parseFloat(form.weight_kg) || null,
        price: parseFloat(form.price) || 0,
        personality: selectedTags.join(','),
      })
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  const previewUrl = form.image_url
    ? form.image_url.startsWith('/static')
      ? `http://localhost:8000${form.image_url}`
      : form.image_url
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-surface-container-lowest rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-card">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-outline-variant">
          <h2 className="font-quicksand font-bold text-xl text-on-surface">
            {initialData ? 'แก้ไขข้อมูลแมว' : 'เพิ่มแมวใหม่'}
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">

          {/* ─── Image Upload ─── */}
          <div className="col-span-2">
            <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-2">รูปภาพแมว</label>

            {/* Drop zone */}
            <div
              className={`relative border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                dragOver ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/60'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="relative h-48">
                  <img src={previewUrl} alt="preview" className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setForm((f) => ({ ...f, image_url: '' })) }}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-4xl animate-spin">refresh</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  {uploading ? (
                    <>
                      <span className="material-symbols-outlined text-primary text-4xl animate-spin">refresh</span>
                      <p className="text-sm text-on-surface-variant font-quicksand">กำลังอัปโหลด...</p>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-primary-container text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>add_photo_alternate</span>
                      <p className="text-sm font-quicksand font-semibold text-on-surface-variant">คลิกหรือลากรูปมาวางที่นี่</p>
                      <p className="text-xs text-outline font-nunito">JPG, PNG, WebP, GIF · ไม่เกิน 5 MB</p>
                    </>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>

            {uploadError && (
              <p className="text-xs text-error mt-1 font-nunito">{uploadError}</p>
            )}

            {/* URL fallback */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-outline font-nunito whitespace-nowrap">หรือใส่ URL:</span>
              <input
                className="input-field text-sm py-2"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* ─── Basic Info ─── */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-1">ชื่อแมว *</label>
            <input className="input-field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="เช่น มูมู่" />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-1">สายพันธุ์ *</label>
            <select className="input-field" required value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })}>
              {BREED_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-1">อายุ (เดือน) *</label>
            <input className="input-field" type="number" min="0" required value={form.age_months} onChange={(e) => setForm({ ...form, age_months: e.target.value })} placeholder="เช่น 6" />
          </div>

          <div>
            <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-1">เพศ *</label>
            <select className="input-field" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="male">ชาย ♂</option>
              <option value="female">หญิง ♀</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-1">สี</label>
            <input className="input-field" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="เช่น ขาว-ส้ม" />
          </div>

          <div>
            <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-1">น้ำหนัก (กก.)</label>
            <input className="input-field" type="number" step="0.1" min="0" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} placeholder="เช่น 3.5" />
          </div>

          <div>
            <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-1">ราคา (บาท)</label>
            <input className="input-field" type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0 = แจกฟรี" />
          </div>

          <div>
            <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-1">สถานะ</label>
            <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="available">พร้อมรับเลี้ยง</option>
              <option value="reserved">จองแล้ว</option>
              <option value="adopted">มีเจ้าของแล้ว</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-2">นิสัย</label>
            <div className="flex flex-wrap gap-2">
              {PERSONALITY_OPTIONS.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-sm font-quicksand font-semibold border-2 transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-container border-primary-container text-on-primary-container'
                      : 'border-outline-variant text-on-surface-variant hover:border-primary'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-1">คำอธิบาย</label>
            <textarea
              className="input-field"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="เล่าเรื่องน้องแมว..."
            />
          </div>

          <div className="col-span-2 flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary" checked={form.vaccinated} onChange={(e) => setForm({ ...form, vaccinated: e.target.checked })} />
              <span className="font-quicksand font-semibold text-sm text-on-surface">ฉีดวัคซีนแล้ว</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary" checked={form.neutered} onChange={(e) => setForm({ ...form, neutered: e.target.checked })} />
              <span className="font-quicksand font-semibold text-sm text-on-surface">ทำหมันแล้ว</span>
            </label>
          </div>

          <div className="col-span-2 flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">ยกเลิก</button>
            <button type="submit" disabled={loading || uploading} className="btn-primary flex-1 disabled:opacity-60">
              {loading ? 'กำลังบันทึก...' : initialData ? 'บันทึกการแก้ไข' : 'เพิ่มแมว'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
