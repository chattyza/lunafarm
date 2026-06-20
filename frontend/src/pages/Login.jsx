import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(form)
      loginUser(res.data.access_token, res.data.user)
      navigate(res.data.user.role === 'admin' ? '/admin' : '/')
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
            <h1 className="font-quicksand font-bold text-2xl text-on-surface mt-2">เข้าสู่ระบบ</h1>
            <p className="text-on-surface-variant text-sm mt-1 font-nunito">Lunar Parties Cattery</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-1">Username</label>
              <input
                className="input-field"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="username"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-quicksand font-semibold text-on-surface-variant mb-1">Password</label>
              <input
                className="input-field"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container text-sm rounded-lg px-4 py-3 font-nunito">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-3.5 disabled:opacity-60">
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-6 font-nunito">
            ยังไม่มีบัญชี?{' '}
            <Link to="/register" className="text-primary font-quicksand font-semibold hover:underline">
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
