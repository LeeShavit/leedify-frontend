import { useState, useRef } from 'react'
import { SearchIcon } from '../assets/img/app-header/icons'
import { setPlayingSong, setIsPlaying } from '../store/actions/station.actions'

import { Link } from 'react-router-dom'

import { debounce } from '../services/util.service.js'
import { stationService } from "../services/station/station.service.local.js";
import { useSelector } from 'react-redux';
import { XIcon } from 'lucide-react';
import { PauseIcon, PlayIcon } from '../assets/img/player/icons.jsx';


export function AddSong({ onAddSong }) {

    const [searchRes, setSearchRes] = useState(null)
    const currentSong = useSelector(state => state.playerModule.currentSong)
    const isPlaying = useSelector((state) => state.playerModule.isPlaying)
    const onSearchDebounce = useRef(debounce(searchSongs, 1000)).current

    async function searchSongs({ target }) {
        if(!target.value) return
        try {
            const songs = await stationService.getSearchResSong(target.value)
            console.log(songs)
            setSearchRes(songs)
        } catch (err) {
            console.log('failed to get matching songs', err)
        }
    }

    function onAddSongToStation(songId) {
        const song = searchRes.find(song=> song._id === songId)
        onAddSong(song)
    }

    function onPlaySong(song) {
        setPlayingSong(song)
        setIsPlaying(true)
      }
    
      function onPauseSong() {
        setIsPlaying(false)
      }

    return (
        <section className="add-song">
            <div className='add-song-header'>
                <div className='add-song-header-content'>
                    <h3>Let's find something for your playlist</h3>
                    <input className="add-song-search" onChange={onSearchDebounce} placeholder='Search for songs'>
                    </input>
                    <SearchIcon className='add-song-search-icon' />
                </div>
                <button><XIcon /></button>
            </div>
            {(searchRes && searchRes.length > 0) &&
                <ul className="search-res-list">
                    {searchRes?.map(song => (
                        <div key={song._id} className={`add-song-row `}>

                            <button className='add-song-row__image-button' onClick={isPlaying && currentSong._id === song._id ? () => onPauseSong() : () => onPlaySong(song)}>
                                <img src={song.imgUrl[2].url} alt={song.name} />
                                <div className='add-song-row__image-overlay'>
                                    {isPlaying ? <PauseIcon className='play-icon'/> : <PlayIcon className='play-icon'/>}
                                </div>
                            </button>

                            <div className='add-song-row__details'>
                                <div className={`song-name ${currentSong._id === song._id ? 'current-song' : ''}`}>{song.name}</div>
                                <div className='song-artist'>
                                    {song.artists.map(artist => <Link key={artist._id} to={`/artist/${artist._id}`}>{artist.name}</Link>)}
                                </div>
                            </div>
                            <div className='add-song-row__album'>{song.album.name}</div>
                            <button className='add-song' onClick={() => onAddSongToStation(song._id)}>Add</button>
                        </div>
                    ))}
                </ul>
            }
        </section>
    )
}