import React from 'react'

export function SectionHeader({ title, onShowAll }) {
  return (
    <div className='section-header'>
      <h2 className='section-header__title'>{title}</h2>
      <button onClick={onShowAll} className='section-header__show-all'>
        Show all
      </button>
    </div>
  )
}
