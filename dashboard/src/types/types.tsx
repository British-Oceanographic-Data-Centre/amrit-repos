import {
    Home as HomeIcon
  } from '@mui/icons-material';
  import NotificationsIcon from '@mui/icons-material/Notifications';
  import DoDisturbIcon from '@mui/icons-material/DoDisturb';
  import { JSX } from 'react';
  
  export type SidebarOption = 
    | 'Home'
    | 'Alerts'
    | 'Protected';
  
  export const iconMapping: Record<SidebarOption, JSX.Element> = {
    "Home": <HomeIcon />,
    "Alerts": <NotificationsIcon />,
    "Protected" : <DoDisturbIcon />
  };
  
  export type Order = 'asc' | 'desc';

  export type JwtPayloadType = {
    contactId: number
    name: string
    exp: number
    sub: string
  } | null;