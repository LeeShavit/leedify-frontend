import {  useEffect, useRef , useState } from 'react'

import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PlayerControls } from './PlayerControls.jsx'


export function Player() {

    const playerRef = useRef(null)
    const [volume, setVolume] = useState(100)
    const currentSong = useSelector(state => state.stationModule.currentSong)
    useEffect(()=>{

    },[currentSong])

    function onAddToLikedSongs(songId) {

    }

    function handleVolumeClick (event){
            if (!playerRef.current) return
            
            const volumeBar = event.currentTarget
            const rect = volumeBar.getBoundingClientRect()
            const pos = (event.clientX - rect.left) / rect.width
            const newVolume = Math.round(pos * 100)
            
            setVolume(newVolume)
            playerRef.current.setVolume(newVolume)
      }

    return (
        <section className="player full">
            <div className='song-info'>
                <img className="cover-img" src={currentSong.imgUrl}></img>
                <div className='song-info-details'>
                    {/* <Link to={`/album/${nowPlayingSong.album._id}`}/> */}
                    {/* <Link to={`/artist/${nowPlayingSong.._id}`}/> */}
                    <p className='song-info-name'>{currentSong.name}</p>
                    <p className='song-info-artist'>
                        {currentSong.artists.map(artist => <Link key={artist._id} to={`/artist/${artist._id}`}>{artist.name}</Link>)}</p>
                </div>
                <button onClick={() => onAddToLikedSongs(currentSong._id)}>
                    <img src="/src/assets/img/like-icon-like-icon.svg" alt="" />
                </button>
            </div>
            <PlayerControls playerRef={playerRef} volume={volume}/>
            <div className='player-buttons'>
                <button>
                <img src='/src/assets/img/now-playing-view-icon.svg' alt='now-playing'/>
                </button>
                <button>
                <img src='/src/assets/img/lyrics-icon.svg' alt='lyrics'/>
                </button>
                <button>                
                    <img src='/src/assets/img/queue-icon.svg' alt='queue'/>
                </button>
                <button>
                <img src='/src/assets/img/connect-to-device-icon.svg' alt='connect'/>
                </button>
                {/* Volume */}
                <div className="volume">
                    <button>
                        <img src='/src/assets/img/volume-mid-icon.svg' alt='Volume'/>
                    </button>
                    <div
                        className="volume-slider"
                        onClick={handleVolumeClick}
                    >
                        <div
                            className="volume-slider-fill"
                            style={{ width: `${volume}%` }}
                        />
                        <div
                            className="volume-slider-btn"
                            style={{ left: `${volume}%` }}
                        />
                    </div>
                </div>
                <button>
                <img src="/src/assets/img/open-miniplayer-icon.svg"/>
                </button>
                <button>
                    <img src="/src/assets/img/full-screen-icon.svg"/>
                </button>
            </div>
        </section>
    )
}