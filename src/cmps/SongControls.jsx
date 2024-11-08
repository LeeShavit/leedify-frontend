import { useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import { ytAPIService } from '../services/ytAPI.service.js'

export function SongControls({ songName , playerRef, volume }) {

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
    };

    function handleStateChange(event) {
        setIsPlaying(event.data === YouTube.PlayerState.PLAYING)
    };

    function handlePlay() {
        playerRef.current?.playVideo()
    };

    function handlePause() {
        playerRef.current?.pauseVideo()
    };

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
        <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#282828] p-4 z-50">
            <div className="w-1 h-1 overflow-hidden">
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
            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-4">
                    <button className="text-[#b3b3b3] hover:text-white p-2 transition-colors">
                        <img src='src/assets/img/prev-song-icon.svg' />
                    </button>
                    <button
                        onClick={isPlaying ? handlePause : handlePlay}
                        className={`p-2 rounded-full ${isPlaying ? 'bg-[#1db954]' : 'bg-white'} text-black hover:scale-105 transition-transform`}>
                        {isPlaying ? (
                            <img src='src/assets/img/control-button-pause-icon.svg' />
                        ) : (
                            <img src='src/assets/img/control-button-play-icon.svg' />
                        )}
                    </button>
                    <button className="text-[#b3b3b3] hover:text-white p-2 transition-colors">
                        <img src='src/assets/img/next-song-icon.svg' />
                    </button>
                </div>

                <div className="flex items-center gap-2 w-full max-w-[600px]">
                    <span className="text-[#b3b3b3] text-xs min-w-[40px]">
                        {formatTime(currentTime)}
                    </span>
                    <div
                        className="flex-1 h-1 bg-[#404040] rounded-full cursor-pointer relative group"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="absolute left-0 top-0 h-full bg-white group-hover:bg-[#1db954] rounded-full transition-colors"
                            style={{ width: `${(currentTime / playerRef.current.getDuration()) * 100}%` }}
                        />
                    </div>
                    <span className="text-[#b3b3b3] text-xs min-w-[40px]">
                        {formatTime(playerRef.current.getDuration())}
                    </span>
                </div>
            </div>

        </div>
    )
}

