import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';
import { Outlet } from 'react-router-dom';
import { access } from '@/api/access';
import { useSession } from '@/auth/AuthProvider';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280
  }
}));

export const DashboardLayout = () => {
  //const { children } = props;
  const {user} = useSession();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [users_access,setUserAccess] = useState([]);
  useEffect(()=>{
    (async()=>{
      const acc = await access({user_id:user.sub});
      
      setUserAccess(acc);
    })()
  },[])

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          <Outlet/>
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebar
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
        access={users_access}
      />
    </>
  );
};
//DashboardLayout = (props)
//en outled iba {children}