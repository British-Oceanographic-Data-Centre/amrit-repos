import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { DarkModeSharp, LightModeSharp } from '@mui/icons-material';

interface DarkModeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  open: boolean;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, toggleDarkMode, open }) => {
  return (
    <List>
      <ListItem sx={{ cursor: 'pointer' }} onClick={toggleDarkMode}>
        <ListItemIcon>{darkMode ? <LightModeSharp /> : <DarkModeSharp />}</ListItemIcon>
        {open && <ListItemText primary={darkMode ? 'Light Mode' : 'Dark Mode'} />}
      </ListItem>
    </List>
  );
};

export default DarkModeToggle;
