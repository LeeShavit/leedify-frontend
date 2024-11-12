import {  useEffect, useRef , useState } from 'react'

import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PlayerControls } from './PlayerControls.jsx'
import { ConnectToDevice, FullScreen, LikeIconLike, Lyrics, NowPlayingView, OpenMiniplayer, QueueIcon, VolumeHigh, VolumeLow, VolumeMid, VolumeMute } from '../assets/img/player/icons.jsx'


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
                    <LikeIconLike/>
                </button>
            </div>
            <PlayerControls playerRef={playerRef} volume={volume}/>
            <div className='player-buttons'>
                <button>
                <NowPlayingView/>
                </button>
                <button>
                <Lyrics/>
                </button>
                <button>                
                 <QueueIcon/>
                </button>
                <button>
                <ConnectToDevice/>
                </button>
                {/* Volume */}
                <div className="volume">
                    <button>
                        <VolumeIcon volume={volume}/>
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
                <OpenMiniplayer/>
                </button>
                <button>
                    <FullScreen/>
                </button>
            </div>
        </section>
    )
}

function VolumeIcon({volume}){
    if(volume > 65) return <VolumeHigh/>
    if(volume > 33) return <VolumeMid/>
    if(volume > 0) return <VolumeLow/>
    return <VolumeMute/>
}