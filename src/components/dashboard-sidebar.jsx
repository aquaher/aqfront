import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import { Logo } from './logo';

import MenuItem from './MenuItem';
import { useSession } from '@/auth/AuthProvider';
import { menu } from '@/service/navigation';
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
    icon: "trabajador",
    id: 3,
    module: "PRODUCCION",
    orden: 1,
    path: "produccion/operadores",
    title: "OPERADORES",
  },
  {
    icon: "prueba",
    id: 4,
    module: "PRODUCCION",
    orden: 1,
    path: "produccion/operadores/prueba",
    title: "PRUEBA",
  }
]
function hasChildren(item) {
  
  if (item.length == 1) {
    return false;
  }

  return true;
}
export const DashboardSidebar = (props) => {
  const { user } = useSession();
  const { open, onClose } = props;

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });
  function principal(data,item,nav) {
    hasChildren(nav) ? multi(data.find(e=>e.icon==nav[0]),item,nav) : single(data,item);
    
  }
  function single(data,item) {
    let nuevo = {
      name: item.module,
      title: item.title,
      to: `/${item.path}`,
      icon: item.icon,
      items: []
    }
    data.push(nuevo)
  }
  function multi(data,item,nav) {
    nav.shift();
    console.log('nav',nav)
    let newvo = principal(data.items,item,nav);
    console.log('data',data)
    console.log('item',item)
    
    if (newvo){
      let editado = {
        name: data.module,
        title: data.title,
        to: `/${data.path}`,
        icon: data.icon,
        items: [
          newvo
        ]
      }
      data.push(editado)
    }
  }
  useEffect(
    () => {
      try {
        let data = []

        access.map(elemento => {
          let index = 0;
          let nav = elemento.path.split("/");
          principal(data,elemento,nav);
        })
        console.log(data)
      } catch (error) {
        console.error(error)
      }
      
      
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