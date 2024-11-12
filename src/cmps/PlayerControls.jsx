import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setIsPlaying } from '../store/actions/station.actions'

import YouTube from 'react-youtube'
import { ApiService } from '../services/api.service.js'
import { NextSong, PauseIcon, PlayIcon, PrevSong, Repeat, Shuffle } from '../assets/img/player/icons.jsx'

export function PlayerControls({ playerRef, volume }) {

    const currentSong = useSelector((state) => state.stationModule.currentSong)
    const isPlaying = useSelector((state) => state.stationModule.isPlaying)
    const [videoId, setVideoId] = useState(null)
    const [currentTime, setCurrentTime] = useState(0)

    useEffect(() => {
        loadVideoId()
    }, [currentSong])

    useEffect(() => {
        if (!playerRef.current) return
        playPauseSong()

        if(!isPlaying) return
        const interval = setInterval(() => {
            const currentTime = playerRef.current.getCurrentTime()
            setCurrentTime(currentTime)
        }, 1000)
        return () => clearInterval(interval)
    }, [isPlaying])

    async function loadVideoId() {
        if (!currentSong) {
            setVideoId(null)
            return
        }
        try {
            const videoId = await ApiService.getYTVideoId(currentSong)
            setVideoId(videoId)
        } catch (err) {
            console.log('Failed to get video data ' + err)
        }
    }

    function handleReady(event) {
        playerRef.current = event.target
        playerRef.current.setVolume(volume)

        playPauseSong()
    }

    function handleStateChange(event) {        
        if (event.data === 5 && isPlaying) {
            event.target.playVideo()
        }
        if (event.data === 3 && isPlaying) {
            setTimeout(() => {
                if (playerRef.current && isPlaying) {
                    playerRef.current.playVideo()
                }}, 500)
        }
    }

    function playPauseSong(){
            if (!playerRef.current) return
            
            const playerState = playerRef.current.getPlayerState()
            if (isPlaying && (playerState === 5 || playerState === 2)) {
                    playerRef.current.playVideo()
            }
             else {
                playerRef.current.pauseVideo()
            }
    }

    function handlePlay() {
        if(!playerRef.current) return
        playerRef.current.playVideo()
        setIsPlaying(true)
    }

    function handlePause() {
        if(!playerRef.current) return
        playerRef.current.pauseVideo()
        setIsPlaying(false)
    }

    function handleProgressClick({target}) {
        if (!playerRef.current || !videoId) return

        const newTime = playerRef.current.getDuration() * (target.value / 100)
        playerRef.current.seekTo(newTime, true)
        setCurrentTime(newTime)
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (!videoId) return null

    return (
        <div className="player-controls">
            <div className="yt-player hidden">
                {videoId && (
                    <YouTube
                        videoId={videoId}
                        opts={{
                            height: '1',
                            width: '1',
                            playerVars: {
                                controls: 0,
                                disablekb: 1,
                            },
                        }}
                        onReady={handleReady}
                        onStateChange={handleStateChange}
                    />
                )}
            </div>
            <div className="player-controls-content">
                <div className="player-controls-buttons">
                    <button>
                        <Shuffle/>
                    </button>
                    <button>
                        <PrevSong/>
                    </button>
                    <button
                        onClick={isPlaying ? handlePause : handlePlay}
                        className={`play ${isPlaying ? 'is-playing' : ''}`}>
                        {isPlaying ? <PauseIcon/> : <PlayIcon/>}
                    </button>
                    <button>
                        <NextSong/>
                    </button>
                    <button>
                        <Repeat/>
                    </button>
                </div>

                <div className="progress">
                    <span className="progress-time">
                        {playerRef.current && formatTime(currentTime) || '0:00'}
                    </span>
                    <input type='range' min='0' max='100' value={(currentTime / playerRef.current?.getDuration()) * 100 || 0} onChange={handleProgressClick} style={{ "--slider-value": `${(currentTime / playerRef.current?.getDuration()) * 100 || 0}%` }}></input>
                    <span className="progress-time right">
                        {playerRef.current && formatTime(playerRef.current.getDuration() - currentTime) || '0:00'}
                    </span>
                </div>
            </div>

        </div>
    )
}

