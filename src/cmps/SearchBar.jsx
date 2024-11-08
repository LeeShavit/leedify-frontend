import React, { useState } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleClear = () => {
    setSearchTerm('')
  }

  return (
    <div className='search-bar'>
      <Search className='search-bar__icon' size={20} />
      <input
        type='text'
        className='search-bar__input'
        placeholder='What do you want to play?'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button className='search-bar__clear' onClick={handleClear} aria-label='Clear search'>
          <X size={20} />
        </button>
      )}
    </div>
  )
}
