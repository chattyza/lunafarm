import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-soft">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 max-w-container mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            pets
          </span>
          <span className="font-quicksand font-bold text-xl text-primary hidden sm:block">
            Lunar Parties Cattery
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`font-quicksand font-semibold transition-colors ${
              isActive('/') ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            หน้าแรก
          </Link>
          <Link
            to="/cats"
            className={`font-quicksand font-semibold transition-colors ${
              isActive('/cats') ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            น้องแมวของเรา
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className={`font-quicksand font-semibold transition-colors ${
                location.pathname.startsWith('/admin') ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:block text-sm text-on-surface-variant font-quicksand">
                สวัสดี, <span className="font-bold text-primary">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="btn-outline text-sm px-5 py-2"
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm px-6 py-2.5">
              เข้าสู่ระบบ
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-on-surface"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-outline-variant px-4 py-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="font-quicksand font-semibold text-on-surface-variant">หน้าแรก</Link>
          <Link to="/cats" onClick={() => setMenuOpen(false)} className="font-quicksand font-semibold text-on-surface-variant">น้องแมวของเรา</Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="font-quicksand font-semibold text-on-surface-variant">Admin</Link>
          )}
        </div>
      )}
    </nav>
  )
}
