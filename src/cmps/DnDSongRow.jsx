import React from 'react'
import { Link } from 'react-router-dom'
import { Draggable } from 'react-beautiful-dnd'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Button } from '@mui/material'
import { PlayIcon, PauseIcon } from '../assets/img/player/icons'
import { Like, Liked } from '../assets/img/playlist-details/icons'
import { formatDuration, getRelativeTime } from '../services/util.service'
import SongMenu from '../cmps/SongMenu'
import { useState } from 'react'

export function DraggableSongRow({
  song,
  index,
  currentSong,
  isPlaying,
  likedSongsIds,
  onPlaySong,
  onPauseSong,
  onLikeDislikeSong,
  handleClick,
}) {
  const [songMenuAnchor, setSongMenuAnchor] = useState(null)
  const songMenuOpen = Boolean(songMenuAnchor)
  const [stationMenuAnchor, setStationMenuAnchor] = useState(null)
  const stationMenuOpen = Boolean(stationMenuAnchor)

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
                {song.artists.map((artist) => (
                  <Link key={artist._id} to={`/artist/${artist._id}`}>
                    {artist.name}
                  </Link>
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
            onClick={(event) => handleClick(event, 'song')}
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
            onClose={() => handleClose('song')}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
          />
        </div>
      )}
    </Draggable>
  )
}
