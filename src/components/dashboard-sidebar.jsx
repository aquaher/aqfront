import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import { Logo } from './logo';

import MenuItem from './MenuItem';
import { useSession } from '@/auth/AuthProvider';
import { menu } from '@/service/navigation';

export const DashboardSidebar = (props) => {
  const { user } = useSession();
  const { open, onClose } = props;

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  useEffect(
    () => {

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [/*router.asPath*/]
  );

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>

            <a>
              <Logo
                sx={{
                  height: 42,
                  width: 42
                }}
              />
            </a>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {user.access.map((item, key) => <MenuItem key={key} item={item}></MenuItem>)}
        </Box>

      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
/**
 * {user.access.map((item, key) => <MenuItem key={key} item={item}></MenuItem>)}
 */
/*
const access = [
  {
    icon: "dashboard",
    id: 1,
    module: "INICIO",
    orden: 0,
    path: "inicio",
    title: "INICIO",
  },
  {
    icon: "produccion",
    id: 2,
    module: "PRODUCCION",
    orden: 1,
    path: "produccion",
    title: "PRODUCCION",
  },
  {
    icon: "operador",
    id: 3,
    module: "PRODUCCION",
    orden: 1,
    path: "produccion/operador",
    title: "OPERADOR",
  },
  {
    icon: "p2",
    id: 3,
    module: "PRODUCCION",
    orden: 1,
    path: "produccion/operador/p2",
    title: "P2",
  },
  {
    icon: "prueba",
    id: 5,
    module: "PRODUCCION",
    orden: 1,
    path: "produccion/prueba",
    title: "PRUEBA",
  },
  {
    icon: "child",
    id: 6,
    module: "PRODUCCION",
    orden: 1,
    path: "produccion/prueba/child",
    title: "CHILD",
  },
  {
    icon: "cuatro",
    id: 4,
    module: "PRODUCCION",
    orden: 1,
    path: "produccion/prueba/cuatro",
    title: "CUATRO",
  },
]
*/