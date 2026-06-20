import { useEffect, useState, useCallback } from 'react'
import { getCats } from '../api/cats'
import CatCard from '../components/CatCard'
import { useWS } from '../context/WSContext'

const BREEDS = ['Scottish Fold', 'British Shorthair', 'Persian', 'Maine Coon', 'Ragdoll', 'Siamese', 'Munchkin']

export default function CatList() {
  const [cats, setCats] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [breed, setBreed] = useState('')
  const { lastEvent } = useWS()

  const fetchCats = useCallback(() => {
    setLoading(true)
    getCats({ search: search || undefined, status: status || undefined, breed: breed || undefined, limit: 30 })
      .then((res) => {
        setCats(res.data.cats)
        setTotal(res.data.total)
      })
      .finally(() => setLoading(false))
  }, [search, status, breed])

  useEffect(() => {
    fetchCats()
  }, [fetchCats])

  // Refresh on WebSocket events
  useEffect(() => {
    if (lastEvent) fetchCats()
  }, [lastEvent])

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-10">
      <div className="max-w-container mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-quicksand font-bold text-3xl md:text-4xl text-primary mb-2">น้องแมวของเรา</h1>
          <p className="text-on-surface-variant font-nunito">พบกับน้องแมวน่ารัก {total} ตัวที่รอเจ้าของ</p>
        </div>

        {/* Filters */}
        <div className="bg-surface-container-lowest rounded-lg p-4 mb-8 soft-depth flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
            <input
              className="input-field pl-10"
              placeholder="ค้นหาชื่อหรือสายพันธุ์..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input-field sm:w-44" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">สถานะทั้งหมด</option>
            <option value="available">พร้อมรับเลี้ยง</option>
            <option value="reserved">จองแล้ว</option>
            <option value="adopted">มีเจ้าของแล้ว</option>
          </select>
          <select className="input-field sm:w-52" value={breed} onChange={(e) => setBreed(e.target.value)}>
            <option value="">สายพันธุ์ทั้งหมด</option>
            {BREEDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <span className="material-symbols-outlined text-5xl text-primary-container animate-spin" style={{ display: 'block' }}>refresh</span>
              <p className="text-on-surface-variant mt-3 font-quicksand">กำลังโหลด...</p>
            </div>
          </div>
        ) : cats.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline-variant">sentiment_dissatisfied</span>
            <p className="text-on-surface-variant mt-4 font-quicksand font-semibold text-lg">ไม่พบน้องแมว</p>
            <p className="text-on-surface-variant text-sm mt-1 font-nunito">ลองเปลี่ยนตัวกรองดูนะ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cats.map((cat) => (
              <CatCard key={cat.id} cat={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
