import { Link } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { getCats } from '../api/cats'
import CatCard from '../components/CatCard'
import { useWS } from '../context/WSContext'

const SERVICES = [
  {
    icon: 'award_star',
    color: 'text-primary',
    bg: 'bg-primary-container/20',
    title: 'พ่อพันธุ์แม่พันธุ์คุณภาพ',
    desc: 'คัดสรรสายพันธุ์แท้ที่มีสุขภาพแข็งแรงและโครงสร้างที่สมบูรณ์แบบตามมาตรฐานสายพันธุ์',
  },
  {
    icon: 'medical_services',
    color: 'text-secondary',
    bg: 'bg-secondary-container/20',
    title: 'การดูแลสุขภาพระดับพรีเมียม',
    desc: 'ตรวจสุขภาพและทำวัคซีนโดยสัตวแพทย์ผู้เชี่ยวชาญสม่ำเสมอ พร้อมสมุดบันทึกสุขภาพประจำตัว',
  },
  {
    icon: 'psychology_alt',
    color: 'text-tertiary',
    bg: 'bg-tertiary-container/20',
    title: 'คำแนะนำการเลี้ยงดู',
    desc: 'บริการให้คำปรึกษาตลอดอายุขัยของน้องแมว เพื่อให้คุณและน้องมีความสุขที่สุดในการอยู่ร่วมกัน',
  },
]

const BREEDS = ['ทั้งหมด', 'Scottish Fold', 'British Shorthair', 'Persian', 'Maine Coon', 'Ragdoll', 'Siamese', 'Munchkin']

export default function Home() {
  const [cats, setCats] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeBreed, setActiveBreed] = useState('ทั้งหมด')
  const [activeStatus, setActiveStatus] = useState('')
  const { lastEvent } = useWS()

  const fetchCats = useCallback(() => {
    setLoading(true)
    getCats({
      search: search || undefined,
      breed: activeBreed !== 'ทั้งหมด' ? activeBreed : undefined,
      status: activeStatus || undefined,
      limit: 100,
    })
      .then((res) => { setCats(res.data.cats); setTotal(res.data.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, activeBreed, activeStatus])

  useEffect(() => { fetchCats() }, [fetchCats])
  useEffect(() => { if (lastEvent) fetchCats() }, [lastEvent])

  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden px-4 md:px-10 py-20 md:py-32">
        <div className="absolute inset-0 hero-pattern opacity-10 -z-10" />
        <div className="max-w-container mx-auto grid md:grid-cols-2 items-center gap-12">
          <div className="order-2 md:order-1">
            <h1 className="font-quicksand font-bold text-3xl sm:text-4xl md:text-5xl text-primary mb-6 leading-tight">
              ฟาร์มแมวแห่งความสุข
              <br />
              <span className="text-primary-container text-2xl sm:text-3xl md:text-4xl">Lunar Parties Cattery</span>
            </h1>
            <p className="text-lg text-on-surface-variant mb-10 max-w-lg font-nunito leading-relaxed">
              สัมผัสความน่ารักและอบอุ่นจากสมาชิกใหม่ของครอบครัว เราคัดสรรแมวสายพันธุ์ดี เลี้ยงด้วยความรักและระบบมาตรฐานพรีเมียม
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#cats" className="btn-primary text-base px-10 py-4">
                ดูน้องแมวทั้งหมด
              </a>
              <a href="#contact" className="btn-outline text-base px-10 py-4">
                นัดเยี่ยมชม
              </a>
            </div>
          </div>

          <div className="order-1 md:order-2 relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary-container/40 rounded-full blur-3xl -z-10" />
            <div className="rounded-lg overflow-hidden shadow-2xl border-8 border-white transform rotate-2">
              <img
                src="/hero-cat.jpg"
                alt="แมวน่ารัก"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-card flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <span className="font-quicksand font-bold text-secondary">ดูแลด้วยรัก 100%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── All Cats ─── */}
      <section id="cats" className="py-20 px-4 md:px-10 bg-white">
        <div className="max-w-container mx-auto">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <h2 className="font-quicksand font-bold text-3xl md:text-4xl text-primary mb-1">น้องแมวพร้อมย้ายบ้าน</h2>
              <p className="text-on-surface-variant font-nunito">หาเพื่อนซี้สี่ขาที่เหมาะกับไลฟ์สไตล์ของคุณ ({total} ตัว)</p>
            </div>
          </div>

          {/* Search + filter */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Search bar */}
            <div className="relative max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
              <input
                className="input-field pl-10 text-center placeholder:text-center"
                placeholder="ค้นหาชื่อหรือสายพันธุ์..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Breed chips */}
            <div className="flex flex-wrap gap-2">
              {BREEDS.map((b) => (
                <button
                  key={b}
                  onClick={() => setActiveBreed(b)}
                  className={`px-4 py-1.5 rounded-full text-sm font-quicksand font-semibold border-2 transition-all ${
                    activeBreed === b
                      ? 'bg-primary-container border-primary-container text-on-primary-container'
                      : 'border-outline-variant text-on-surface-variant hover:border-primary'
                  }`}
                >
                  {b}
                </button>
              ))}
              <div className="w-px bg-outline-variant mx-1" />
              {[
                { value: '', label: 'ทุกสถานะ' },
                { value: 'available', label: '✅ พร้อมรับเลี้ยง' },
                { value: 'reserved', label: '🔖 จองแล้ว' },
              ].map((s) => (
                <button
                  key={s.value}
                  onClick={() => setActiveStatus(s.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-quicksand font-semibold border-2 transition-all ${
                    activeStatus === s.value
                      ? 'bg-secondary-container border-secondary-container text-on-secondary-container'
                      : 'border-outline-variant text-on-surface-variant hover:border-secondary'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <span className="material-symbols-outlined text-5xl text-primary-container animate-spin block">refresh</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cats.map((cat) => (
                <CatCard key={cat.id} cat={cat} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Services ─── */}
      <section className="py-20 px-4 md:px-10 bg-surface-container">
        <div className="max-w-container mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-quicksand font-bold text-3xl md:text-4xl text-primary mb-3">บริการและคุณภาพระดับพรีเมียม</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto font-nunito">เรามุ่งมั่นที่จะให้การดูแลที่ดีที่สุดแก่น้องแมวและทาสแมวทุกท่านด้วยมาตรฐานระดับสากล</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-white p-10 rounded-lg text-center soft-depth">
                <div className={`w-20 h-20 ${s.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <span className={`material-symbols-outlined text-4xl ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                </div>
                <h4 className="font-quicksand font-bold text-xl text-on-surface mb-3">{s.title}</h4>
                <p className="text-on-surface-variant font-nunito leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact / Location ─── */}
      <section id="contact" className="py-20 px-4 md:px-10 bg-white">
        <div className="max-w-container mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-quicksand font-bold text-3xl md:text-4xl text-primary mb-4">เยี่ยมชมฟาร์มของเรา</h2>
              <p className="text-on-surface-variant font-nunito leading-relaxed mb-8">
                เปิดบ้านต้อนรับทุกท่านที่ต้องการสัมผัสความน่ารักของน้องแมวตัวจริง กรุณานัดหมายล่วงหน้าเพื่อความเป็นส่วนตัวและสุขอนามัยที่ดีของน้องแมว
              </p>
              <div className="space-y-5">
                {[
                  { icon: 'location_on', label: 'ที่อยู่', value: '94/1 หมู่1 ถนนเศรษฐวิถี ซอย4 ต.สามง่าม อ.ดอนตูม จ.นครปฐม 73150' },
                  { icon: 'call', label: 'เบอร์โทรศัพท์', value: '095-4826562' },
                  { icon: 'schedule', label: 'เวลาทำการ', value: 'ทุกวัน 10:00 – 20:00' },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                    <div>
                      <p className="font-quicksand font-bold text-on-surface">{item.label}</p>
                      <p className="text-on-surface-variant font-nunito">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a href="tel:0954826562" className="btn-primary inline-flex items-center gap-2 mt-8">
                <span className="material-symbols-outlined text-xl">call</span>
                โทรนัดหมาย
              </a>
            </div>

            {/* Map placeholder */}
            <div className="rounded-lg overflow-hidden shadow-card h-[400px] border border-surface-variant relative bg-surface-container">
              <img
                src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&h=400&fit=crop"
                alt="แผนที่"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-primary text-6xl mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                <a
                  href="https://www.google.com/maps/place/13%C2%B057'24.2%22N+100%C2%B004'50.0%22E/@13.9567196,100.0779771,1472m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d13.9567196!4d100.080552"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white px-6 py-2.5 rounded-full font-quicksand font-bold shadow-card text-primary hover:scale-105 transition-transform"
                >
                  ดูบน Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-surface-container-high py-12 px-4 md:px-10">
        <div className="max-w-container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
              <span className="font-quicksand font-bold text-xl text-primary">Lunar Parties Cattery</span>
            </div>
            <p className="text-on-surface-variant font-nunito text-sm max-w-xs text-center md:text-left">
              สร้างความสุขผ่านเจ้าเหมียวตัวน้อย มอบสิ่งที่ดีที่สุดให้สมาชิกใหม่ของครอบครัวคุณ
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-6 text-sm text-on-surface-variant font-nunito">
              <a href="#" className="hover:text-primary transition-colors">นโยบายความเป็นส่วนตัว</a>
              <a href="#" className="hover:text-primary transition-colors">ข้อกำหนดการใช้งาน</a>
            </div>
            <div className="flex gap-3">
              {['face_nod', 'chat', 'photo_camera'].map((icon) => (
                <div key={icon} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary cursor-pointer hover:scale-110 transition-transform shadow-soft">
                  <span className="material-symbols-outlined text-xl">{icon}</span>
                </div>
              ))}
            </div>
            <p className="text-on-surface-variant text-sm font-nunito opacity-70">© 2025 Lunar Parties Cattery</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
