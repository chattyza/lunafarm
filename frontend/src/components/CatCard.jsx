import { Link } from 'react-router-dom'

const CAT_PLACEHOLDER = 'https://placehold.co/400x300/C9B3E8/3D1F6B?text=🐱'

const statusConfig = {
  available: { label: 'พร้อมรับเลี้ยง', color: 'bg-secondary-container text-on-secondary-container' },
  adopted: { label: 'มีเจ้าของแล้ว', color: 'bg-surface-container-high text-on-surface-variant' },
  reserved: { label: 'จองแล้ว', color: 'bg-tertiary-container text-on-tertiary-container' },
}

export default function CatCard({ cat }) {
  const status = statusConfig[cat.status] || statusConfig.available
  const tags = cat.personality ? cat.personality.split(',').map((t) => t.trim()).filter(Boolean) : []
  const ageLabel = cat.age_months < 12
    ? `${cat.age_months} เดือน`
    : `${Math.floor(cat.age_months / 12)} ปี ${cat.age_months % 12 ? `${cat.age_months % 12} เดือน` : ''}`

  return (
    <Link to={`/cats/${cat.id}`} className="block">
      <div className="bg-surface-container-lowest rounded-lg overflow-hidden cat-card">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={cat.image_url || CAT_PLACEHOLDER}
            alt={cat.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = CAT_PLACEHOLDER }}
          />
          <span className={`absolute top-3 right-3 text-xs font-quicksand font-bold px-3 py-1 rounded-full ${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-quicksand font-bold text-xl text-on-surface">{cat.name}</h3>
            <span className="text-sm text-on-surface-variant font-nunito">{cat.gender === 'male' ? '♂ ชาย' : '♀ หญิง'}</span>
          </div>
          <p className="text-on-surface-variant text-sm mb-3 font-nunito">{cat.breed} · {ageLabel}</p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="bg-tertiary-container/60 text-on-tertiary-container text-xs px-3 py-1 rounded-full font-quicksand font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-xs text-on-surface-variant font-nunito">
              {cat.vaccinated && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-secondary">vaccines</span>ฉีดวัคซีน
                </span>
              )}
              {cat.neutered && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-secondary">health_and_safety</span>ทำหมัน
                </span>
              )}
            </div>
            {cat.price > 0 && (
              <span className="font-quicksand font-bold text-primary">
                ฿{cat.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
