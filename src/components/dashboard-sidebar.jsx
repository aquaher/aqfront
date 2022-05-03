import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ChartBar as ChartBarIcon } from './icons/chart-bar';
import { Cog as CogIcon } from './icons/cog';
import { Lock as LockIcon } from './icons/lock';
import { Selector as SelectorIcon } from './icons/selector';
import { ShoppingBag as ShoppingBagIcon } from './icons/shopping-bag';
import { User as UserIcon } from './icons/user';
import { UserAdd as UserAddIcon } from './icons/user-add';
import { Users as UsersIcon } from './icons/users';
import { XCircle as XCircleIcon } from './icons/x-circle';
import { Logo } from './logo';
import { menu } from './menu';
import MenuItem from './MenuItem';
import { useSession } from '@/auth/AuthProvider';

export const DashboardSidebar = (props) => {
  const session = useSession();
  const [custom, setCustom] = useState([]);
  const { open, onClose } = props;

  const access = [
    { id: 1, path: 'm_base.m_inicio', title: 'INICIO', module: 'INICIO', icon: 'dashboard', orden: 0 },
    { id: 2, path: 'm_base.m_produccion', title: 'PRODUCCION', module: 'PRODUCCION', icon: 'produccion', orden: 1 },
    { id: 3, path: 'm_base.m_produccion.m_operadores', title: 'OPERADORES', module: 'PRODUCCION', icon: 'produccion', orden: 1 },
  
  ]


  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  useEffect(
    () => {
      access.map(value => {
        const divider = value.path.split('.');
        for (let index = 1; index < divider.length; index++) {
          const element = custom.find(el => el.module == value.module);
          if (!element) {
            console.log(value)
            setCustom([
              ...custom,
              {
                icon: value.icon,
                module: value.module,
                title: value.title,
                items: []
              }
            ])

          } else {
            
          }
        }
      })
      console.log(custom)

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
          {menu.map((item, key) => <MenuItem key={key} item={item}></MenuItem>)}
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
