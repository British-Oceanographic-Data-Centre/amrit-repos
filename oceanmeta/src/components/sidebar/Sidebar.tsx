import { useState, useEffect } from 'react';
import { Drawer, Box } from '@mui/material';
import SidebarHeader from './SidebarHeader';
import SidebarList from './SidebarList';
import DarkModeToggle from './DarkModeToggle';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

const sidebarSections = [
  {
    category: "METADATA",
    options: [
      { label: "Introduction", path: "intro" },
      { label: "Ontology", path: "ontology" },
      { label: "Dictionary", path: "dictionary" },
      { label: "Code Tables", path: "code-tables" },
      { label: "OceanJSON", path: "oceanjson" },
      { label: "OceanCSV", path: "oceancsv" },
      { label: "OceanAPI", path: "oceanapi" },
    ]
  },
  {
    category: "PASSPORTS",
    options: [
		{ label: "Passports", path: "passports" },
      	{ label: "Workflow", path: "workflow"},
		{ label: "Pre-register", path: "preregister" }
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({ darkMode, toggleDarkMode, selectedOption, setSelectedOption }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync selectedOption with URL on load
  useEffect(() => {
    const currentOption = sidebarSections
      .flatMap(section => section.options)
      .find(option => option.path === location.pathname);

    if (currentOption) {
      setSelectedOption(currentOption.label);
    }
  }, [location, setSelectedOption]);

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? 280 : 60,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 280 : 60,
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
    >
      <SidebarHeader open={open} setOpen={setOpen} darkMode={darkMode} />

      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {sidebarSections.map(({ category, options }) => (
          <SidebarList
            key={category}
            category={category}
            options={options}
            selectedOption={selectedOption}
            setSelectedOption={(option) => {
              setSelectedOption(option);
              const selectedPath = options.find(o => o.label === option)?.path;
              if (selectedPath) navigate(selectedPath);
            }}
            darkMode={darkMode}
            open={open}
          />
        ))}

        {/* Push Dark Mode Toggle to the bottom */}
        <Box sx={{ marginTop: 'auto' }}>
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} open={open} />
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
