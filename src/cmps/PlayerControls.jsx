import { useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import { ytAPIService } from '../services/ytAPI.service.js'

export function PlayerControls({ songName, playerRef, volume }) {

    const [videoId, setVideoId] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)

    useEffect(() => {
        loadVideoId()
    }, [songName])

    useEffect(() => {
        if (!playerRef.current || !isPlaying) return
        const interval = setInterval(() => {
            const currentTime = playerRef.current.getCurrentTime()
            setCurrentTime(currentTime)
        }, 1000)

        return () => clearInterval(interval)
    }, [isPlaying])

    async function loadVideoId() {
        if (!songName) {
            setVideoId(null)
            return
        }
        try {
            const videoId = await ytAPIService.getVideoId(songName)
            setVideoId(videoId)
        } catch (err) {
            console.log('Failed to get video data ' + err)
        }
    }


    function handleReady(event) {
        playerRef.current = event.target
        playerRef.current.setVolume(volume)
    }

    function handleStateChange(event) {
        setIsPlaying(event.data === YouTube.PlayerState.PLAYING)
    }

    function handlePlay() {
        playerRef.current?.playVideo()
    }

    function handlePause() {
        playerRef.current?.pauseVideo()
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
                        onClick={isPlaying ? handlePause : handlePlay}
                        className={`play ${isPlaying ? 'is-playing' : ''}`}>
                        <img src={`/src/assets/img/control-button-${isPlaying ? 'pause' : 'play'}-icon.svg`} alt={`${isPlaying ? 'Pause' : 'Play'}`} />
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

