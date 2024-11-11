import  { useState, useRef } from 'react'
import { SearchIcon } from '../assets/img/app-header/icons'

import { Link } from 'react-router-dom'

import { debounce } from '../services/util.service.js'
import { stationService } from "../services/station/station.service.local.js";
import { useSelector } from 'react-redux';
import { XIcon } from 'lucide-react';


export function AddSong({onAddSong}) {

    const [searchRes, setSearchRes] = useState(null)
    const currentSong = useSelector(state => state.stationModule.currentSong)
    const onSearchSongsDebounce = useRef(debounce(searchBooks, 1000)).current

    async function searchBooks({ target }) {
        try {
            songs = await stationService.getSongs()
            setSearchRes(songs)
        } catch (err) {
            console.log('failed to get matching songs', err)
        }
    }

    function onAddSongToStation(Idx) {
        const song = stationService.getSong(searchRes[Idx])
        onAddSong(song)
    }

    return (
        <section className="add-song">
            <h3>Let's find something for your playlist</h3>
            <div className='add-song-search'>
                <button className='add-song-search-icon'>
                <SearchIcon className='text-[#b3b3b3] hover:text-white transition-colors' />
                </button>
            <input onChange={onSearchSongsDebounce} placeholder='Search for songs'></input>
            </div>
            <button><XIcon/></button>
            {(searchRes && searchRes.length > 0) &&
                <ul className="search-res-list">
                    {searchRes?.map((song, idx) => (
                        <div key={song.id} className={`add-song-row `}>
                            <div className='add-song-row__'>
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
                            </div>
                            <div className='add-song-row__album'>{song.album.name}</div>
                            <button onClick={()=> onAddSong(idx)}>Add</button>
                        </div>
                    ))}
                </ul>
            }
        </section>
    )
}