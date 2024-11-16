import * as React from 'react';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Check from '@mui/icons-material/Check';

export default function LibrarySortMenu({ onClose, ...props }) {

  const handleMenuItemClick = () => {
    onClose()
  }

  function onSelect({target}){
    const val=target.innerText
    if(val==='Grid' || val === 'List' || val === 'Compact') props.setView(val.toLowerCase())
    else props.setSortBy(val.toLowerCase())
    onClose()
  }



  return (
    <Menu onClick={onSelect}{...props} onClose={onClose} className="menu">
      <MenuItem className="menu-section-header"> Sort by </MenuItem>
      {props.sortBy === 'recent'
        ? <MenuItem className="selected">
          <ListItemText>Recent</ListItemText>
          <ListItemIcon>
            <Check />
          </ListItemIcon>
        </MenuItem>
        : <MenuItem>Recent</MenuItem>
      }
      {props.sortBy === 'recently added'
        ? <MenuItem className="selected">
          <ListItemText>Recently Added</ListItemText>
          <ListItemIcon>
            <Check />
          </ListItemIcon>
        </MenuItem>
        : <MenuItem>Recently Added </MenuItem>
      }
      {props.sortBy === 'alphabetical'
        ? <MenuItem className="selected">
          <ListItemText>Alphabetical</ListItemText>
          <ListItemIcon>
            <Check />
          </ListItemIcon>
        </MenuItem>
        : <MenuItem>Alphabetical</MenuItem>
      }
      {props.sortBy === 'creator'
        ? <MenuItem className="selected">
          <ListItemText>Creator</ListItemText>
          <ListItemIcon>
            <Check />
          </ListItemIcon>
        </MenuItem>
        : <MenuItem>Creator</MenuItem>
      }
      <Divider />
      <MenuItem className="menu-section-header">
        View as
      </MenuItem>
      {props.view === 'Compact'
        ? <MenuItem className="selected">
          <ListItemText>Compact</ListItemText>
          <ListItemIcon>
            <Check />
          </ListItemIcon>
        </MenuItem>
        : <MenuItem>Compact</MenuItem>
      }
      {props.view === 'list'
        ? <MenuItem className="selected">
          <ListItemText>List</ListItemText>
          <ListItemIcon>
            <Check />
          </ListItemIcon>
        </MenuItem>
        : <MenuItem>List</MenuItem>
      }
      {props.view === 'grid'
        ? <MenuItem className="selected">
          <ListItemText>Grid</ListItemText>
          <ListItemIcon>
            <Check />
          </ListItemIcon>
        </MenuItem>
        : <MenuItem>Grid</MenuItem>
      }
    </Menu>
  );
}