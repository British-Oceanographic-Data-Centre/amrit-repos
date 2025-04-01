import { Typography, Box } from '@mui/material';

interface SidebarHeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  darkMode: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ open, darkMode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 9px 6px 9px',
        color: darkMode ? "#03a9f4" : "#009af4",
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {open && (
          <img 
            src="https://www.ocean-ops.org/static/images/oceanops/logos/oceanops-earth-sm.png" 
            alt="OceanOPS Logo" 
            width="30" 
            height="30"
            style={{ marginLeft: '7px', marginRight: '15px' }}
          />
        )}
        <Typography variant="h6" noWrap sx={{ display: open ? 'block' : 'none' }}>
          Ocean
          <Typography variant="h6" component="span" sx={{ fontWeight: '600' }}>
            Meta
          </Typography>
        </Typography>
      </Box>

    </Box>
  );
};

export default SidebarHeader;
