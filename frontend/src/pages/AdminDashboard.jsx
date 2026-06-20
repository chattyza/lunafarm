import { useEffect, useState, useCallback } from 'react'
import { getCats, createCat, updateCat, deleteCat } from '../api/cats'
import CatFormModal from '../components/CatFormModal'
import Toast from '../components/Toast'
import { useWS } from '../context/WSContext'

const CAT_PLACEHOLDER = 'https://placehold.co/80x80/C9B3E8/3D1F6B?text=🐱'

const statusColors = {
  available: 'bg-secondary-container text-on-secondary-container',
  reserved: 'bg-tertiary-container text-on-tertiary-container',
  adopted: 'bg-surface-container-high text-on-surface-variant',
}
const statusLabels = {
  available: 'พร้อมรับเลี้ยง',
  reserved: 'จองแล้ว',
  adopted: 'มีเจ้าของแล้ว',
}

export default function AdminDashboard() {
  const [cats, setCats] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editCat, setEditCat] = useState(null)
  const [toast, setToast] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const { lastEvent } = useWS()

  const fetchCats = useCallback(() => {
    setLoading(true)
    getCats({ search: search || undefined, limit: 100 })
      .then((res) => { setCats(res.data.cats); setTotal(res.data.total) })
      .finally(() => setLoading(false))
  }, [search])

  useEffect(() => { fetchCats() }, [fetchCats])
  useEffect(() => { if (lastEvent) fetchCats() }, [lastEvent])

  const showToast = (message, type = 'success') => setToast({ message, type })

  const handleSubmit = async (data) => {
    try {
      if (editCat) {
        await updateCat(editCat.id, data)
        showToast(`แก้ไขข้อมูล ${data.name} เรียบร้อย`)
      } else {
        await createCat(data)
        showToast(`เพิ่มน้องแมว ${data.name} เรียบร้อย`)
      }
      setModalOpen(false)
      setEditCat(null)
      fetchCats()
    } catch (err) {
      showToast(err.response?.data?.detail || 'เกิดข้อผิดพลาด', 'error')
    }
  }

  const handleDelete = async (cat) => {
    try {
      await deleteCat(cat.id)
      showToast(`ลบข้อมูล ${cat.name} เรียบร้อย`)
      setDeleteConfirm(null)
      fetchCats()
    } catch (err) {
      showToast(err.response?.data?.detail || 'เกิดข้อผิดพลาด', 'error')
    }
  }

  const stats = {
    total: cats.length,
    available: cats.filter((c) => c.status === 'available').length,
    reserved: cats.filter((c) => c.status === 'reserved').length,
    adopted: cats.filter((c) => c.status === 'adopted').length,
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-10 bg-surface-container-low">
      <div className="max-w-container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-quicksand font-bold text-3xl text-on-surface">Admin Dashboard</h1>
            <p className="text-on-surface-variant font-nunito mt-1">จัดการข้อมูลแมวทั้งหมด</p>
          </div>
          <button
            onClick={() => { setEditCat(null); setModalOpen(true) }}
            className="btn-primary flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            เพิ่มแมวใหม่
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'แมวทั้งหมด', value: stats.total, icon: 'pets', color: 'text-primary' },
            { label: 'พร้อมรับเลี้ยง', value: stats.available, icon: 'favorite', color: 'text-secondary' },
            { label: 'จองแล้ว', value: stats.reserved, icon: 'bookmark', color: 'text-tertiary' },
            { label: 'มีเจ้าของแล้ว', value: stats.adopted, icon: 'home', color: 'text-outline' },
          ].map((s) => (
            <div key={s.label} className="bg-surface-container-lowest p-5 rounded-lg soft-depth">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-on-surface-variant text-sm font-quicksand font-semibold">{s.label}</p>
                  <p className={`font-quicksand font-bold text-3xl mt-1 ${s.color}`}>{s.value}</p>
                </div>
                <span className={`material-symbols-outlined text-2xl ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
          <input className="input-field pl-10" placeholder="ค้นหาชื่อหรือสายพันธุ์..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-lg overflow-hidden soft-depth">
          {loading ? (
            <div className="text-center py-16 text-on-surface-variant font-quicksand">กำลังโหลด...</div>
          ) : cats.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-outline-variant">pets</span>
              <p className="text-on-surface-variant mt-3 font-quicksand">ยังไม่มีข้อมูลแมว</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low">
                    {['แมว', 'สายพันธุ์', 'อายุ', 'เพศ', 'ราคา', 'สถานะ', ''].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-quicksand font-bold text-on-surface-variant uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {cats.map((cat) => (
                    <tr key={cat.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={cat.image_url || CAT_PLACEHOLDER}
                            alt={cat.name}
                            className="w-10 h-10 rounded-lg object-cover"
                            onError={(e) => { e.target.src = CAT_PLACEHOLDER }}
                          />
                          <span className="font-quicksand font-semibold text-on-surface">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant font-nunito text-sm">{cat.breed}</td>
                      <td className="px-4 py-3 text-on-surface-variant font-nunito text-sm">
                        {cat.age_months < 12 ? `${cat.age_months} เดือน` : `${Math.floor(cat.age_months / 12)} ปี`}
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant text-sm">{cat.gender === 'male' ? '♂' : '♀'}</td>
                      <td className="px-4 py-3 font-quicksand font-semibold text-primary text-sm">
                        {cat.price > 0 ? `฿${cat.price.toLocaleString()}` : 'ฟรี'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-quicksand font-bold px-3 py-1 rounded-full ${statusColors[cat.status]}`}>
                          {statusLabels[cat.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditCat(cat); setModalOpen(true) }}
                            className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                            title="แก้ไข"
                          >
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(cat)}
                            className="p-1.5 text-on-surface-variant hover:text-error transition-colors"
                            title="ลบ"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      <CatFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditCat(null) }}
        onSubmit={handleSubmit}
        initialData={editCat}
      />

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-surface-container-lowest rounded-lg p-6 w-full max-w-sm soft-depth text-center">
            <span className="material-symbols-outlined text-4xl text-error mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            <h3 className="font-quicksand font-bold text-xl text-on-surface mb-2">ยืนยันการลบ</h3>
            <p className="text-on-surface-variant font-nunito mb-6">
              ต้องการลบข้อมูลแมว <span className="font-bold text-on-surface">{deleteConfirm.name}</span> ใช่ไหม?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-outline flex-1">ยกเลิก</button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-error text-on-error px-6 py-3 rounded-full font-quicksand font-bold hover:opacity-90 transition-opacity"
              >
                ลบเลย
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
