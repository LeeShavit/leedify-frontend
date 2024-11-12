import * as React from 'react';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Check from '@mui/icons-material/Check';

export default function LibrarySortMenu({ onClose, ...props}) {

    const handleMenuItemClick = () => {
        onClose();
      };

  return (
    <Menu 
      {...props} 
      onClose={onClose}
      className="menu"
    >
      <MenuItem className="menu-section-header">
        Sort by
      </MenuItem>
        <MenuItem>
        Recents
      </MenuItem>
      <MenuItem className="selected">
        <ListItemText>Recently Added</ListItemText>
        <ListItemIcon>
          <Check />
        </ListItemIcon>
        </MenuItem>
        <MenuItem>
        Alphabetical
        </MenuItem>
        <MenuItem>
        Creator
      </MenuItem>
      <Divider />
      <MenuItem className="menu-section-header">
        View as
        </MenuItem>
        <MenuItem>
        Compact
      </MenuItem>
      <MenuItem className="selected">
        <ListItemText>List</ListItemText>
          <ListItemIcon>
            <Check />
          </ListItemIcon>
        </MenuItem>
        <MenuItem>
        Grid
        </MenuItem>
    </Menu>
  );
}