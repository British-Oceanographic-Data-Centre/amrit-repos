import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';

interface SidebarOption {
  label: string;
  path: string;
  subOptions?: SidebarOption[]; // Subsections (optional)
}

interface SidebarListProps {
  category: string;
  options: SidebarOption[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  darkMode: boolean;
  open: boolean;
}

const SidebarList: React.FC<SidebarListProps> = ({ category, options, selectedOption, setSelectedOption, darkMode, open }) => {
  return (
    <>
      {category && (
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: '0.85rem',
            fontWeight: 'bold',
            marginBottom: '4px',
            paddingLeft: '17px',
            paddingTop: '14px',
            height: '42px',
            color: darkMode ? "#e68e56" : "#e68e56", // Gold in dark mode
            textTransform: 'uppercase',
          }}
        >
          {open ? category : '  '}
        </Typography>
      )}

      <List sx={{ padding: 0 }}>
        {options.map(({ label, subOptions }) => (
          <Box key={label}>
            {/* Main Option */}
            <ListItem
              sx={{
                height: '38px',
                cursor: 'pointer',
                color: selectedOption === label ? (darkMode ? "#03a9f4" : "#009af4") : 'inherit',
                backgroundColor: selectedOption === label ? (darkMode ? '#333' : '#f0f0f0') : 'inherit',
                '&:hover': {
                  backgroundColor: darkMode ? '#555' : '#f5f5f5',
                },
              }}
              onClick={() => setSelectedOption(label)}
            >
              {open && <ListItemText primary={label} />}
            </ListItem>

            {/* Subsections */}
            {subOptions && open && (
              <List sx={{ paddingLeft: '20px', paddingTop: 0 }}>
                {subOptions.map((sub) => (
                  <ListItem
                    key={sub.label}
                    sx={{
                      height: '34px',
                      cursor: 'pointer',
                      color: selectedOption === sub.label ? (darkMode ? "#03a9f4" : "#009af4") : 'inherit',
                      '&:hover': {
                        backgroundColor: darkMode ? '#444' : '#f7f7f7',
                      },
                    }}
                    onClick={() => setSelectedOption(sub.label)}
                  >
                    <ListItemText primary={sub.label} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        ))}
      </List>
    </>
  );
};

export default SidebarList;
