import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
// import { loadStation, addStationMsg } from '../store/actions/station.actions'

export function StationDetails() {
  return (
    <div className='station-page'>
      <header className='station-header'>
        <div className='station-header__cover'>
          <img
            src='https://i.scdn.co/image/ab67706f000000021bf9baf065347914ebd54be6'
            alt='Liked Songs'
            className='station-header__cover-img'
          />
        </div>

        <div className='station-header__info'>
          <span className='station-header__type'>STATION</span>
          <h1 className='station-header__title'>Liked Songs</h1>
          <div className='station-header__meta'>
            <span className='station-header__owner'>lidornissim</span>
            <span className='station-header__songs-count'>2,644 songs</span>
          </div>
        </div>
      </header>

      <div className='station-controls'>
        <div className='station-controls__left'>
          <button className='station-controls__play'>
            <span className='station-controls__play-icon'>▶</span>
          </button>
          <button className='station-controls__add'>+</button>
        </div>

        <div className='station-controls__right'>
          <button className='station-controls__list'>List</button>
        </div>
      </div>

      <div className='station-table-header'>
        <div className='station-table-header__number'>#</div>
        <div className='station-table-header__title'>Title</div>
        <div className='station-table-header__album'>Album</div>
        <div className='station-table-header__date'>Date added</div>
        <div className='station-table-header__duration'></div>
      </div>
    </div>
  )
}
