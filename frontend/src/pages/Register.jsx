import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }
    setLoading(true)
    try {
      await register({ username: form.username, email: form.email, password: form.password })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 bg-surface-container-low">
      <div className="w-full max-w-sm">
        <div className="bg-surface-container-lowest rounded-lg p-8 soft-depth">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
            <h1 className="font-quicksand font-bold text-2xl text-on-surface mt-2">สมัครสมาชิก</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-1">Username</label>
              <input className="input-field" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="username" />
            </div>
            <div>
              <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-1">Email</label>
              <input className="input-field" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-1">Password</label>
              <input className="input-field" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="อย่างน้อย 6 ตัวอักษร" minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-1">ยืนยัน Password</label>
              <input className="input-field" type="password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="••••••••" />
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container text-sm rounded-lg px-4 py-3 font-nunito">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-3.5 disabled:opacity-60">
              {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-6 font-nunito">
            มีบัญชีแล้ว?{' '}
            <Link to="/login" className="text-primary font-quicksand font-semibold hover:underline">เข้าสู่ระบบ</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
