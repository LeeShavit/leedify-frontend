import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { SearchIcon, ExploreIcon, ExploreIconFull } from '../assets/img/app-header/icons'
import debounce from 'lodash/debounce'

export function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const debouncedSearch = debounce((term) => {
    if (term) {
      navigate(`/search?q=${term}`)
    }
  }, 300)

  const handleSearchChange = (ev) => {
    const value = ev.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  const handleSearchFocus = () => {
    if (location.pathname !== '/search') {
      navigate('/search')
    }
  }

  return (
    <div className='app-header__search'>
      <button className='app-header__search-icon'>
        <SearchIcon className='text-[#b3b3b3] hover:text-white transition-colors' />
      </button>
      <input
        type='text'
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={handleSearchFocus}
        placeholder='What do you want to play?'
        className='app-header__search-input'
      />
      <button onClick={() => navigate('/search')} className='app-header__search__collection-button'>
        {location.pathname === '/search' ? (
          <ExploreIconFull className='text-[#b3b3b3] hover:text-white transition-colors' />
        ) : (
          <ExploreIcon className='text-[#b3b3b3] hover:text-white transition-colors' />
        )}
      </button>
    </div>
  )
}
