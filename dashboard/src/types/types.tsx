import {
    Home as HomeIcon
  } from '@mui/icons-material';

  import NotificationsIcon from '@mui/icons-material/Notifications';
  import TableChartIcon from '@mui/icons-material/TableChart';
  import StarIcon from '@mui/icons-material/Star';
  import DoDisturbIcon from '@mui/icons-material/DoDisturb';
  import { JSX } from 'react';
import { FilterOption } from './filters';
  
  export type SidebarItem = {
	label: string;
	path?: string;
	children?: SidebarItem[];
  };
  
  export type SidebarOption = SidebarItem | string;

  export const iconMapping: Record<string, JSX.Element> = {
	"Home": <HomeIcon />,
	"Alerts": <NotificationsIcon />,
	"Alerts table": <TableChartIcon />,
	"My subscriptions": <StarIcon />,
	"Protected": <DoDisturbIcon />
  };
  
  export type Order = 'asc' | 'desc';

  export type JwtPayloadType = {
    contactId: number
    name: string
    exp: number
    sub: string
    roles: string[]
  } | null;

  export type TopicOption = {
	id: number;
	label: string;
	parentId?: number | null;
	children?: TopicOption[];
  };

  export type CountryOption  =  Omit<FilterOption, 'id' | 'name'> & {
  id: string | number;
  name: string;
};

export type CountryAPIResponse = {
  data: {
    id?: string | number;
    name?: string;
    code2?: string;
  }[];
};

export type Session = {  
    isAuth: boolean;
    userId: number | undefined;
    username: string | undefined;
    roles: string[] | undefined;
 
}

export type TimeRange = { from?: string, to?: string };