import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setPlayingSong } from '../store/actions/station.actions'

import YouTube from 'react-youtube'
import { ytAPIService } from '../services/ytAPI.service.js'

export function PlayerControls({ playerRef, volume }) {

    const currentSong = useSelector((state) => state.stationModule.currentSong)
    const [videoId, setVideoId] = useState(null)
    const [currentTime, setCurrentTime] = useState(0)

    useEffect(() => {
        loadVideoId()
    }, [currentSong.song])

    useEffect(() => {
        if (!playerRef.current || !currentSong.isPlaying) return
        const interval = setInterval(() => {
            const currentTime = playerRef.current.getCurrentTime()
            setCurrentTime(currentTime)
        }, 1000)

        return () => clearInterval(interval)
    }, [currentSong.isPlaying])

    async function loadVideoId() {
        if (!currentSong) {
            setVideoId(null)
            return
        }
        try {
            const videoId = await ytAPIService.getVideoId(currentSong)
            setVideoId(videoId)
        } catch (err) {
            console.log('Failed to get video data ' + err)
        }
    }


    function handleReady(event) {
        playerRef.current = event.target
        playerRef.current.setVolume(volume)
        playerRef.current.playVideo()
    }

    function handleStateChange(event) {
        setPlayingSong({...currentSong, isPlaying: event.data === YouTube.PlayerState.PLAYING})
    }

    function handlePlay() {
        playerRef.current?.playVideo()
        setPlayingSong({...currentSong, isPlaying: true})
    }

    function handlePause() {
        playerRef.current?.pauseVideo()
        setPlayingSong({...currentSong, isPlaying: false})
    }

    function handleProgressClick(event) {
        if (!playerRef.current || !videoId) return

        const progressBar = event.currentTarget
        const rect = progressBar.getBoundingClientRect()
        const pos = (event.clientX - rect.left) / rect.width
        const newTime = playerRef.current.getDuration() * pos

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
                        <img src='/src/assets/img/shuffle-icon.svg' />
                    </button>
                    <button>
                        <img src='/src/assets/img/prev-song-icon.svg' alt='Previous' />
                    </button>
                    <button
                        onClick={currentSong.isPlaying ? handlePause : handlePlay}
                        className={`play ${currentSong.isPlaying ? 'is-playing' : ''}`}>
                        <img src={`/src/assets/img/${currentSong.isPlaying ? 'pause' : 'play'}-icon.svg`} alt={`${currentSong.isPlaying ? 'Pause' : 'Play'}`} />
                    </button>
                    <button>
                        <img src='/src/assets/img/next-song-icon.svg' />
                    </button>
                    <button>
                        <img src='/src/assets/img/repeat-icon.svg' />
                    </button>
                </div>

                <div className="progress">
                    <span className="progress-time">
                        {playerRef.current && formatTime(currentTime) || '0:00'}
                    </span>
                    <div
                        className="progress-bar"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="progress-bar-fill"
                            style={playerRef.current && { width: `${(currentTime / playerRef.current.getDuration()) * 100}%` }}
                        />
                        <div
                            className="progress-bar-btn"
                            style={playerRef.current && { left: `${(currentTime / playerRef.current.getDuration()) * 100}%` }}
                        />
                    </div>
                    <span className="progress-time right">
                        {playerRef.current && formatTime(playerRef.current.getDuration() - currentTime) || '0:00'}
                    </span>
                </div>
            </div>

        </div>
    )
}

