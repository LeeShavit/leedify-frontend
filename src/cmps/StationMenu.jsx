import { Menu, MenuItem, Divider } from '@mui/material';
import { ChevronRight } from 'lucide-react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';
import { Report, AddToQueue, ViewCredits, Share, Embed, Copy, ArrowRight, Profile, Exclude } from '../assets/img/menu/icons';
import { LikeIconLike } from '../assets/img/player/icons';
import { SpotifyIcon } from '../assets/img/app-header/icons';


export default function StationMenu({ onClose, ...props }) {

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

    return (
        <>
            <Menu  {...props} onClose={onClose} className="menu">
                <MenuItem>
                    <LikeIconLike/> Add to Your Library
                </MenuItem>
                <MenuItem>
                    <AddToQueue/> Add to queue
                </MenuItem>
                <Divider />
                <MenuItem>
                    <Profile/> Add to profile
                </MenuItem>
                <Divider />
                <MenuItem>
                    <Report /> Report
                </MenuItem>
                <MenuItem>
                    <Exclude/> Exclude from your taste profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleShareOpen} className="submenu-trigger">
                    <div className="">
                        <Share/> Share
                        <ChevronRight className="h-4 w-4" />
                    </div>
                </MenuItem>
                <Divider />
                <MenuItem>
                    <SpotifyIcon/> Open in Desktop app
                </MenuItem>
            </Menu>
            <Menu
                anchorEl={shareAnchor}
                open={Boolean(shareAnchor)}
                onClose={handleClose}
                className="menu submenu"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <MenuItem><Copy/> Copy song link</MenuItem>
                <MenuItem> <Embed/>Embed track</MenuItem>
            </Menu>
        </>

    );
}