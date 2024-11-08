import {  useRef , useState } from 'react'

import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { SongControls } from './SongControls.jsx'

export function SongPlayer() {
    // const nowPlayingSong = useSelector(storeState => storeState.Player.nowPlayingSong)

    const playerRef = useRef(null)
    const [volume, setVolume] = useState(100)

    const nowPlayingSong = {
        id: '3xKsf9qdS1CyvXSMEid6g8',
        title: "Pink+White",
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

    const { imgUrl, title, album, artists, _id } = nowPlayingSong

    return (
        <section className="player full">
            <div className='song-details'>
                <img src={imgUrl}></img>
                <div>
                    {/* <Link to={`/album/${nowPlayingSong.album._id}`}/> */}
                    {/* <Link to={`/artist/${nowPlayingSong.._id}`}/> */}
                    <p>{title}</p>
                    <p>{artists.join(', ')}</p>
                </div>
                <button onClick={() => onAddToLikedSongs(_id)}>
                    <img src="src/assets/styles/img/like-icon-like.svg" alt="" />
                </button>
            </div>
            <SongControls videoId={_id} playerRef={playerRef} volume={volume}/>
            <div className='player-btns'>
                <button></button>
                <button></button>
                <button></button>
                <button></button>
                <button></button>
                {/* Volume */}
                <div className="flex items-center gap-2 justify-end">
                    <button className="text-[#b3b3b3] hover:text-white p-2 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z" />
                            <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z" />
                        </svg>
                    </button>
                    <div
                        className="w-[100px] h-1 bg-[#404040] rounded-full cursor-pointer relative group"
                        onClick={handleVolumeClick}
                    >
                        <div
                            className="absolute left-0 top-0 h-full bg-white group-hover:bg-[#1db954] rounded-full transition-colors"
                            style={{ width: `${volume}%` }}
                        />
                    </div>
                </div>
                <button></button>
                <button></button>
            </div>
        </section>
    )
}