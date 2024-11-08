import {  useRef , useState } from 'react'

import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PlayerControls } from './PlayerControls.jsx'


export function SongPlayer() {
    // const nowPlayingSong = useSelector(storeState => storeState.Player.nowPlayingSong)

    const playerRef = useRef(null)
    const [volume, setVolume] = useState(100)

    const nowPlayingSong = {
        id: '3xKsf9qdS1CyvXSMEid6g8',
        name: "Pink+White",
        artists: [
            {
                name: 'Frank Ocean',
                _id: '2h93pZq0e7k5yf4dywlkpM',
            }
        ],
        album: {
            name: 'Blonde',
            _id: '3mH6qwIy9crq0I9YQbOuDf'
        },
        duration: 182400,
        url: 'youtube/song.mp4',
        imgUrl: 'https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg',
        likedBy: [],
        addedAt: 162521765262,
    }

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

    const { imgUrl, title, album, artists, _id, name } = nowPlayingSong
    return (
        <section className="player full">
            <div className='song-info'>
                <img src={imgUrl}></img>
                <div className='song-info-details'>
                    {/* <Link to={`/album/${nowPlayingSong.album._id}`}/> */}
                    {/* <Link to={`/artist/${nowPlayingSong.._id}`}/> */}
                    <p className='song-info-name'>{title}</p>
                    <p className='song-info-artist'>{artists.join(', ')}</p>
                </div>
                <button onClick={() => onAddToLikedSongs(_id)}>
                    <img src="/src/assets/img/like-icon-like-icon.svg" alt="" />
                </button>
            </div>
            <PlayerControls songName={name} playerRef={playerRef} volume={volume}/>
            <div className='player-buttons'>
                <button>
                <img src='/src/assets/img/now-playing-view-icon.svg' alt='Volume'/>
                </button>
                <button>
                <img src='/src/assets/img/lyrics-icon.svg' alt='Volume'/>
                </button>
                <button>                
                    <img src='/src/assets/img/queue-icon.svg' alt='Volume'/>
                </button>
                <button>
                <img src='/src/assets/img/connect-to-device-icon.svg' alt='Volume'/>
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