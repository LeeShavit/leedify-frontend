import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PlayerControls } from './PlayerControls.jsx'
import { DEFAULT_IMG } from '../services/station/station.service.local.js'
import {
  ConnectToDevice,
  FullScreen,
  Lyrics,
  Minimize,
  NowPlayingView,
  OpenMiniplayer,
  QueueIcon,
  VolumeHigh,
  VolumeLow,
  VolumeMid,
  VolumeMute,
} from '../assets/img/player/icons.jsx'
import { likeSong, dislikeSong } from '../store/actions/user.actions'
import { getItemsIds } from '../services/util.service'
import { Like, Liked } from '../assets/img/playlist-details/icons'
import { Loader } from '../assets/img/library/icons.jsx'
import { ArrowDown, ChevronDown } from 'lucide-react'
import { FastAverageColor } from 'fast-average-color'

export function Player() {
  const playerRef = useRef(null)
  const [volume, setVolume] = useState(100)
  const user = useSelector((state) => state.userModule.user)

  const currentSong = useSelector((state) => state.playerModule.currentSong)
  const [likedSongsIds, setLikedSongsIds] = useState(getItemsIds(user.likedSongs))

  const fac = new FastAverageColor()
  const [isFullScreen, setIfFullScreen] = useState(false)

  useEffect(() => {
    if (currentSong) {
      loadBackgroundColor()
    }
  }, [currentSong])

  function handleVolumeClick({ target }) {
    if (!playerRef.current) return
    setVolume(target.value)
    playerRef.current.setVolume(target.value)
  }

  async function onLikeDislikeSong() {
    try {
      const likedSongs = !likedSongsIds.includes(currentSong._id)
        ? await likeSong(currentSong)
        : await dislikeSong(currentSong._id)
      setLikedSongsIds(getItemsIds(likedSongs))
    } catch (err) {
      console.error('Failed to like/dislike song:', err)
    }
  }

  async function loadBackgroundColor() {
    try {
      const song = await currentSong
      if (!song) return
      const img = typeof song.imgUrl === 'string' ? song.imgUrl :song.imgUrl[0].url
      const color = await fac.getColorAsync(img)
      document.documentElement.style.setProperty(
        '--dynamic-background',
        `rgb(${color.value[0]}, ${color.value[1]}, ${color.value[2]})`
      )
    } catch (err) {
      console.log('Error getting average color:', err)
      document.documentElement.style.setProperty('--dynamic-background', 'rgb(18, 18, 18)')
    }
  }

  if (!currentSong || !user) return <Loader />

  return (
    <section className={`player full ${isFullScreen ? 'full-screen' : 'minimized'} dynamic-bg`}>
      <button className='minimize' onClick={() => setIfFullScreen(false)}><ChevronDown /></button>
      <div className='song-info' onClick={() => setIfFullScreen(true)}>
        <img
          className='cover-img'
          src={
            currentSong?.imgUrl && Array.isArray(currentSong.imgUrl)
              ? currentSong.imgUrl[1]?.url
              : typeof currentSong?.imgUrl === 'string'
                ? currentSong.imgUrl
                : DEFAULT_IMG
          }
          alt={currentSong?.name || 'Song cover'}
        />
        <div className='song-info-details'>
          {/* <Link to={`/album/${nowPlayingSong.album._id}`}/> */}
          {/* <Link to={`/artist/${nowPlayingSong.._id}`}/> */}
          <p className='song-info-name'>{currentSong?.name}</p>
          <p className='song-info-artist'>
            {currentSong?.artists?.map((artist) => (
              <Link key={artist._id} to={`/artist/${artist._id}`}>
                {artist.name}
              </Link>
            ))}
          </p>
        </div>
        <button
          onClick={() => onLikeDislikeSong()}
          className={`like-song ${likedSongsIds?.includes(currentSong?._id) ? 'liked' : ''}`}
        >
          {likedSongsIds?.includes(currentSong?._id) ? <Liked /> : <Like />}
        </button>
      </div>
      <PlayerControls playerRef={playerRef} volume={volume} className={isFullScreen ? 'full-screen' : ''} />
      <div className='player-buttons '>
        <button>
          <NowPlayingView />
        </button>
        <button>
          <Lyrics />
        </button>
        <button className='queue'>
          <QueueIcon />
        </button>
        <button>
          <ConnectToDevice />
        </button>
        {/* Volume */}
        <div className='volume'>
          <button>
            <VolumeIcon volume={volume} />
          </button>
          <input
            type='range'
            min='0'
            max='100'
            value={volume}
            onChange={handleVolumeClick}
            style={{ '--slider-value': `${volume}%` }}
          ></input>
        </div>
        <button>
          <OpenMiniplayer />
        </button>
        <button>
          <FullScreen />
        </button>
      </div>
    </section>
  )
}

function VolumeIcon({ volume }) {
  if (volume > 65) return <VolumeHigh />
  if (volume > 33) return <VolumeMid />
  if (volume > 0) return <VolumeLow />
  return <VolumeMute />
}
