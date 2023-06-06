import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileAlt, faCode, faWallet, faCog, faUsers, faTachometerAlt} from '@fortawesome/free-solid-svg-icons';
import { List, ListItem, ListItemIcon, ListItemText, Collapse, Box } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import './Sidebar.css'; 

const Sidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const isActive = (pathname: string) => {
    return location.pathname === pathname;
  };

  return (
    <div className="sidebar-container">


      <List>
      <ListItem button className={isActive('/wallet/accounts') ? 'active-link sidebar-button' : 'sidebar-button'} component={Link} to="/wallet/accounts">
          <ListItemIcon>
            <FontAwesomeIcon icon={faWallet} style={{ marginRight: '5px' }} />
          </ListItemIcon>
          <ListItemText primary="Accounts" />
        </ListItem>
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faUsers} style={{ marginRight: '5px' }} />
          </ListItemIcon>
          <ListItemText primary="Supersig" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding style={{ paddingLeft: '1.5em' }}>  
            <ListItem button className={isActive('/organisations/dashboard') ? 'active-link sidebar-button' : 'sidebar-button'} component={Link} to="/organisations/dashboard">
              <ListItemIcon>
                <FontAwesomeIcon icon={faTachometerAlt} style={{ marginRight: '5px' }} /> 
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button className='sidebar-button' component={Link} to="/organisations/create">
              <ListItemIcon>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
              </ListItemIcon>
              <ListItemText primary="Create" />
            </ListItem>
            <ListItem button className='sidebar-button' component={Link} to="/organisations/create">
              <ListItemIcon>
                <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: '5px' }} />
              </ListItemIcon>
              <ListItemText primary="Propose" />
            </ListItem>
            <ListItem button className={isActive('/organisations/decode') ? 'active-link sidebar-button' : 'sidebar-button'} component={Link} to="/organisations/decode">
              <ListItemIcon>
                <FontAwesomeIcon icon={faCode} style={{ marginRight: '5px' }} />
              </ListItemIcon>
              <ListItemText primary="Decode" />
            </ListItem>
          </List>
        </Collapse>
        
        

        <ListItem button className={isActive('/settings') ? 'active-link sidebar-button' : 'sidebar-button'} component={Link} to="/settings">
          <ListItemIcon>
            <FontAwesomeIcon icon={faCog} style={{ marginRight: '5px' }} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
