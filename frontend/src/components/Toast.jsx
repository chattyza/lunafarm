import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  const colors = {
    success: 'bg-secondary-container text-on-secondary-container',
    error: 'bg-error-container text-on-error-container',
    info: 'bg-primary-container text-on-primary-container',
  }

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-card font-quicksand font-semibold text-sm animate-bounce ${colors[type]}`}
      style={{ animationIterationCount: 1, animationDuration: '0.3s' }}
    >
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
        {icons[type]}
      </span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  )
}
