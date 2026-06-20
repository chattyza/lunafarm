import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCat } from '../api/cats'

const CAT_PLACEHOLDER = 'https://placehold.co/600x400/C9B3E8/3D1F6B?text=🐱'

const statusConfig = {
  available: { label: 'พร้อมรับเลี้ยง', color: 'bg-secondary-container text-on-secondary-container' },
  adopted: { label: 'มีเจ้าของแล้ว', color: 'bg-surface-container-high text-on-surface-variant' },
  reserved: { label: 'จองแล้ว', color: 'bg-tertiary-container text-on-tertiary-container' },
}

export default function CatDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cat, setCat] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCat(id)
      .then((res) => setCat(res.data))
      .catch(() => navigate('/cats'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-primary-container animate-spin block">refresh</span>
          <p className="text-on-surface-variant mt-3 font-quicksand">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!cat) return null

  const status = statusConfig[cat.status] || statusConfig.available
  const tags = cat.personality ? cat.personality.split(',').map((t) => t.trim()).filter(Boolean) : []
  const ageLabel = cat.age_months < 12
    ? `${cat.age_months} เดือน`
    : `${Math.floor(cat.age_months / 12)} ปี ${cat.age_months % 12 ? `${cat.age_months % 12} เดือน` : ''}`

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-10">
      <div className="max-w-container mx-auto">
        <Link to="/cats" className="flex items-center gap-1 text-on-surface-variant hover:text-primary mb-6 font-quicksand font-semibold transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          กลับ
        </Link>

        <div className="bg-surface-container-lowest rounded-lg overflow-hidden soft-depth">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="h-80 md:h-full relative min-h-[400px]">
              <img
                src={cat.image_url || CAT_PLACEHOLDER}
                alt={cat.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = CAT_PLACEHOLDER }}
              />
              <span className={`absolute top-4 left-4 text-sm font-quicksand font-bold px-4 py-1.5 rounded-full ${status.color}`}>
                {status.label}
              </span>
            </div>

            {/* Info */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-2">
                <h1 className="font-quicksand font-bold text-4xl text-on-surface">{cat.name}</h1>
                <span className="text-2xl">{cat.gender === 'male' ? '♂' : '♀'}</span>
              </div>
              <p className="text-primary font-quicksand font-semibold text-lg mb-6">{cat.breed}</p>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag) => (
                    <span key={tag} className="bg-tertiary-container/60 text-on-tertiary-container text-sm px-4 py-1.5 rounded-full font-quicksand font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { icon: 'cake', label: 'อายุ', value: ageLabel },
                  { icon: cat.gender === 'male' ? 'male' : 'female', label: 'เพศ', value: cat.gender === 'male' ? 'ชาย' : 'หญิง' },
                  { icon: 'palette', label: 'สี', value: cat.color || '-' },
                  { icon: 'monitor_weight', label: 'น้ำหนัก', value: cat.weight_kg ? `${cat.weight_kg} กก.` : '-' },
                ].map((item) => (
                  <div key={item.label} className="bg-surface-container-low p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-primary text-base">{item.icon}</span>
                      <span className="text-xs text-on-surface-variant font-quicksand font-semibold">{item.label}</span>
                    </div>
                    <span className="font-nunito text-on-surface">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Health */}
              <div className="flex gap-4 mb-6">
                <span className={`flex items-center gap-1.5 text-sm font-quicksand font-semibold px-3 py-1.5 rounded-full ${cat.vaccinated ? 'bg-secondary-container/60 text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: `'FILL' ${cat.vaccinated ? 1 : 0}` }}>vaccines</span>
                  {cat.vaccinated ? 'ฉีดวัคซีนแล้ว' : 'ยังไม่ฉีดวัคซีน'}
                </span>
                <span className={`flex items-center gap-1.5 text-sm font-quicksand font-semibold px-3 py-1.5 rounded-full ${cat.neutered ? 'bg-secondary-container/60 text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: `'FILL' ${cat.neutered ? 1 : 0}` }}>health_and_safety</span>
                  {cat.neutered ? 'ทำหมันแล้ว' : 'ยังไม่ทำหมัน'}
                </span>
              </div>

              {cat.description && (
                <p className="text-on-surface-variant font-nunito leading-relaxed mb-6 bg-surface-container-low p-4 rounded-lg">
                  {cat.description}
                </p>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
                {cat.price > 0 ? (
                  <span className="font-quicksand font-bold text-3xl text-primary">฿{cat.price.toLocaleString()}</span>
                ) : (
                  <span className="font-quicksand font-bold text-xl text-secondary">แจกฟรี / หาบ้าน</span>
                )}
                {cat.status === 'available' && (
                  <a
                    href="tel:0800000000"
                    className="btn-primary"
                  >
                    ติดต่อรับเลี้ยง
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
