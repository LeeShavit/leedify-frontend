import { lightGreen } from '@mui/material/colors'
import React from 'react'

import { useNavigate } from 'react-router'

export function SectionHeader({ title, categoryId }) {
  const navigate = useNavigate()

  function onShowAll() {
    if (categoryId) {
      navigate(`/genre/${categoryId}`)
    }
  }
  return (
    <div className='section-header'>
      <h2 className='section-header__title'>{title}</h2>
      <button onClick={onShowAll} className='section-header__show-all'>
        Show all
      </button>
    </div>
  )
}
