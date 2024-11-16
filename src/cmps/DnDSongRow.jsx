import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Draggable } from 'react-beautiful-dnd'
import { Button } from '@mui/material'
import { PlayIcon, PauseIcon } from '../assets/img/player/icons'
import { Like, Liked } from '../assets/img/playlist-details/icons'

import SongMenu from '../cmps/SongMenu'
import { setCurrentSong, setIsPlaying, addToQueue } from '../store/actions/player.actions'
import { formatDuration, getRelativeTime } from '../services/util.service'

export function DraggableSongRow({
  song,
  index,
  likedSongsIds,
  onLikeDislikeSong,
  isUserStation,
  onRemoveSong,
  onAddToQueue,
}) {
  const [songMenuAnchor, setSongMenuAnchor] = useState(null)
  const songMenuOpen = Boolean(songMenuAnchor)

  const currentSong = useSelector((state) => state.playerModule.currentSong)
  const isPlaying = useSelector((state) => state.playerModule.isPlaying)

  function onPlaySong(song) {
    if (currentSong._id !== song._id) {
      setCurrentSong(song)
      onAddToQueue()
    }
    setIsPlaying(true)
  }

  function onPauseSong() {
    setIsPlaying(false)
  }

  function handleClick(event) {
    setSongMenuAnchor(event.currentTarget)
  }
  function handleClose() {
    setSongMenuAnchor(null)
  }

  return (
    <Draggable draggableId={song._id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`station-song-row ${currentSong._id === song._id ? 'current-song' : ''} 
            ${snapshot.isDragging ? 'is-dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {isPlaying && currentSong._id === song._id ? (
            <div className='station-song-row__icon playing'>
              <div className='bar'></div>
              <div className='bar'></div>
              <div className='bar'></div>
              <div className='bar'></div>
            </div>
          ) : (
            <div className='station-song-row__number'>{index + 1}</div>
          )}

          <div
            className='station-song-row__playPause'
            onClick={isPlaying && currentSong._id === song._id ? () => onPauseSong() : () => onPlaySong(song)}
          >
            {isPlaying && currentSong._id === song._id ? <PauseIcon /> : <PlayIcon />}
          </div>

          <div className='station-song-row__title'>
            <img src={typeof song.imgUrl === 'string' ? song.imgUrl : song.imgUrl[2].url} alt={song.name} />
            <div>
              <div className='song-title'>{song.name}</div>
              <div className='song-artist'>
                {song.artists.map((artist, index) => (
                  <React.Fragment key={artist._id || index}>
                    <Link to={`/artist/${artist._id}`}>{artist.name}</Link>
                    {index < song.artists.length - 1 && ', '}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className='station-song-row__album'>{song.album.name}</div>
          <div className='station-song-row__date'>{getRelativeTime(song.addedAt)}</div>

          <div className='station-song-row__duration'>
            <button
              className={`like-song ${likedSongsIds.includes(song._id) ? 'liked' : ''}`}
              onClick={() => onLikeDislikeSong(song)}
            >
              {likedSongsIds.includes(song._id) ? <Liked /> : <Like />}
            </button>
            <div>{formatDuration(song.duration)}</div>
          </div>

          <Button
            className='list-icon'
            onClick={(event) => handleClick(event)}
            aria-controls='basic-menu'
            aria-haspopup='true'
            sx={{ textTransform: 'none', fontFamily: 'Spotify-mix, sans-serif' }}
          >
            <MoreHorizIcon sx={{ fontSize: '24px', opacity: 0.7 }} />
          </Button>
          <SongMenu
            id='basic-menu'
            anchorEl={songMenuAnchor}
            open={songMenuOpen}
            onClose={() => handleClose()}
            isUserStation={isUserStation}
            isLiked={likedSongsIds.includes(song._id)}
            onLikeDislike={() => onLikeDislikeSong(song)}
            onRemoveSong={() => onRemoveSong(song._id)}
            onAddToQueue={() => addToQueue(song)}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
          />
        </div>
      )}
    </Draggable>
  )
}
