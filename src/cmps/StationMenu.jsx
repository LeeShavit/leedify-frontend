import { Menu, MenuItem, Divider } from '@mui/material';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom'
import { Report, AddToQueue, Share, Embed, Copy, ArrowRight, Profile, Exclude } from '../assets/img/menu/icons';
import { LikeIconLike, LikeIconLiked } from '../assets/img/player/icons';
import { SpotifyIcon } from '../assets/img/app-header/icons';
import {  showUserMsg } from '../services/event-bus.service';


export default function StationMenu({ onClose, ...props }) {
    const { stationId } = useParams()
    const [playlistAnchor, setPlaylistAnchor] = useState(null)
    const [shareAnchor, setShareAnchor] = useState(null)

    const handlePlaylistOpen = (event) => {
        event.preventDefault()
        setPlaylistAnchor(event.currentTarget)
    }

    const handleShareOpen = (event) => {
        event.preventDefault()
        setShareAnchor(event.currentTarget)
    }

    const handleClose = () => {
        setPlaylistAnchor(null)
        setShareAnchor(null)
    }

    const handleMenuItemClick = () => {
        onClose()
    }

    async function copyLink() {
        try {
            const linkToCopy = `http://localhost:5173/station/${stationId}`
            await navigator.clipboard.writeText(linkToCopy)

            showUserMsg('Link copied to clipboard')
        } catch (err) {
            console.error('Failed to copy link:', err)
            showUserMsg('Failed to copy link')
        }
    }

    return (
        <>
            <Menu  {...props} onClose={onClose} className="menu">
                {props.isInLibrary ?
                    <MenuItem onClick={() => { onClose(); props.onRemoveStation()}}>
                        <LikeIconLiked className={props.isInLibrary && 'liked'} />Remove from Your Library
                    </MenuItem>
                    : <MenuItem onClick={() => { onClose(); props.onLikeStation()}}>
                        <LikeIconLike />Add to Your Library
                    </MenuItem>}
                <MenuItem onClick={() => { onClose(); props.onAddToQueue() }}>
                    <AddToQueue /> Add to queue
                </MenuItem>
                <Divider />
                <MenuItem>
                    <Profile /> Add to profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={copyLink}><Copy /> Copy Playlist link</MenuItem>
            </Menu>
        </>

    );
}