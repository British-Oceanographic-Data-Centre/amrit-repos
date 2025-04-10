import {
    Home as HomeIcon
  } from '@mui/icons-material';
  import NotificationsIcon from '@mui/icons-material/Notifications';
  import { JSX } from 'react';
  
  export type SidebarOption = 
    | 'Home'
    | 'Alerts'
    | 'Protected';
  
  export const iconMapping: Record<SidebarOption, JSX.Element> = {
    "Home": <HomeIcon />,
    "Alerts": <NotificationsIcon />,
    "Protected" : <NotificationsIcon />
  };
  
  export type Order = 'asc' | 'desc';