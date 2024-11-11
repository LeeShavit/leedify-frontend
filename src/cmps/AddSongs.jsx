import { useState, useRef } from 'react'
import { SearchIcon } from '../assets/img/app-header/icons'

import { Link } from 'react-router-dom'

import { debounce } from '../services/util.service.js'
import { stationService } from "../services/station/station.service.local.js";
import { useSelector } from 'react-redux';
import { XIcon } from 'lucide-react';


export function AddSong({ onAddSong }) {

    const [searchRes, setSearchRes] = useState(null)
    const currentSong = useSelector(state => state.stationModule.currentSong)
    const isPlaying = useSelector((state) => state.stationModule.isPlaying)
    const onSearchDebounce = useRef(debounce(searchSongs, 1000)).current

    async function searchSongs({ target }) {
        try {
            const songs = await stationService.getSongs()
            setSearchRes(songs)
        } catch (err) {
            console.log('failed to get matching songs', err)
        }
    }

    function onAddSongToStation(songId) {
        const song = stationService.getSong(songId)
        console.log(song)
        onAddSong(song)
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
                        <div key={song.id} className={`add-song-row `}>
                                <div className='add-song-row__playPause' onClick={isPlaying && currentSong.id === song.id ? () => onPauseSong() : () => onPlaySong(song)}>
                                    <img src={`/src/assets/img/${(isPlaying && currentSong.id === song.id) ? 'pause' : 'play'}-icon.svg`} alt={`${isPlaying ? 'Pause' : 'Play'}`} />
                                </div>
                                <img src={song.imgUrl} alt={song.name} />
                                <div className='add-song-row__details'>
                                    <div className={`song-name ${currentSong.id === song.id ? 'current-song' : ''}`}>{song.name}</div>
                                    <div className='song-artist'>
                                        {song.artists.map(artist => <Link key={artist._id} to={`/artist/${artist._id}`}>{artist.name}</Link>)}
                                    </div>
                                </div>
                            <div className='add-song-row__album'>{song.album.name}</div>
                            <button className='add-song' onClick={() => onAddSongToStation(song.id)}>Add</button>
                        </div>
                    ))}
                </ul>
            }
        </section>
    )
}