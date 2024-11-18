import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Search, Library } from 'lucide-react'
import { useEffect } from 'react'

export function MobileNav({ setIsLibraryExpanded }) {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(()=>{
      window.addEventListener('resize', checkScreenSize)

      return ()=> window.removeEventListener('resize', checkScreenSize)
  },[])

  function checkScreenSize(){
    if (window.innerWidth < 500) setIsLibraryExpanded(false)
    else setIsLibraryExpanded(true)
  }

  return (
    <nav className='mobile-nav'>
      <button className={`mobile-nav__item ${location.pathname === '/' ? 'active' : ''}`} onClick={() => {navigate('/');setIsLibraryExpanded(false)}}>
        <Home size={24} />
        <span>Home</span>
      </button>

      <button
        className={`mobile-nav__item ${location.pathname === '/search' ? 'active' : ''}`}
        onClick={() => {navigate('/search');setIsLibraryExpanded(false)}}
      >
        <Search size={24} />
        <span>Search</span>
      </button>

      <button className='mobile-nav__item' onClick={()=>setIsLibraryExpanded(true)}>
        <Library size={24} />
        <span>Library</span>
      </button>
    </nav>
  )
}
