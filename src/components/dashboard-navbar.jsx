import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { AppBar, Avatar, Badge, Box, IconButton, Toolbar, Tooltip, Menu, MenuItem, Paper, Typography, Divider, MenuList, ListItem, ListItemText, Modal, Backdrop, Popover, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Bell as BellIcon } from './icons/bell';
import { UserCircle as UserCircleIcon } from './icons/user-circle';
import { Users as UsersIcon } from './icons/users';
import { useState } from 'react';
import { LogoutOutlined } from '@mui/icons-material';
import { useSession } from '@/auth/AuthProvider';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

export const DashboardNavbar = (props) => {
  const session = useSession();
  const { onSidebarOpen, ...other } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280
          },
          width: {
            lg: 'calc(100% - 280px)'
          }
        }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Tooltip title="Search">
            <IconButton sx={{ ml: 1 }}>
              <SearchIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Contacts">
            <IconButton sx={{ ml: 1 }}>
              <UsersIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton sx={{ ml: 1 }}>
              <Badge
                badgeContent={4}
                color="primary"
                variant="dot"
              >
                <BellIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          <IconButton
            aria-controls={open ? 'basic-menu' : null}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : null}
            onClick={handleClick}
          >
            <Avatar
              sx={{
                height: 40,
                width: 40,
              }}
              src="../assets/static/images/avatars/avatar_1.png"
            >
              <UserCircleIcon fontSize="small" />
            </Avatar>
          </IconButton>

        </Toolbar>
      </DashboardNavbarRoot>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{
          sx:{ 
            width: 300,
            borderColor: 'rgb(230, 232, 240)',
            borderStyle: 'solid',
            borderWidth: 1 
          }
        }}
      >

        <Box display='flex' padding={2}>
          <Avatar
            sx={{
              height: 40,
              width: 40,
            }}
            src="../assets/static/images/avatars/avatar_1.png"
          >
            <UserCircleIcon fontSize="small" />
          </Avatar>
          <Box ml={1}>
            <Typography>{session.user.name}</Typography>
            <Typography>{session.user.email}</Typography>
          </Box>
        </Box>
        <Divider sx={{
          mt:0.5,
          mb:0.5
        }}/>
        <Box paddingBottom={1} paddingTop={1}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon sx={{ml:2}}><LogoutOutlined/></ListItemIcon>
            <ListItemText>Cerrar sesion</ListItemText>
          </MenuItem>
        </Box>
      </Popover>
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func
};
