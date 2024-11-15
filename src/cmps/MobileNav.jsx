import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Search, Library } from 'lucide-react'

export function MobileNav({ onLibraryClick }) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className='mobile-nav'>
      <button className={`mobile-nav__item ${location.pathname === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>
        <Home size={24} />
        <span>Home</span>
      </button>

      <button
        className={`mobile-nav__item ${location.pathname === '/search' ? 'active' : ''}`}
        onClick={() => navigate('/search')}
      >
        <Search size={24} />
        <span>Search</span>
      </button>

      <button className='mobile-nav__item' onClick={onLibraryClick}>
        <Library size={24} />
        <span>Library</span>
      </button>
    </nav>
  )
}
