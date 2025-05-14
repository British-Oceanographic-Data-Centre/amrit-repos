import { useState } from 'react';
import { CssBaseline, Box, createTheme, ThemeProvider } from '@mui/material';
import Sidebar from './components/sidebar/Sidebar';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import OceanMeta from './components/pages/metadata/Intro';
import Ontology from './components/pages/metadata/Ontology';
import Dictionary from './components/pages/metadata/Dictionary';
import CodeTables from './components/pages/metadata/CodeTables';
import Passports from './components/pages/passports/Passports';
import OceanJSON from './components/pages/metadata/OceanJson';
import OceanCsv from './components/pages/metadata/OceanCsv';
import OceanAPI from './components/pages/metadata/OceanAPI';
import RequestIds from './components/pages/passports/PreRegistration';
import SubmitPlatforms from './components/pages/passports/Workflow';

function AppContent({ darkMode, setSelectedOption }: { darkMode: boolean; setSelectedOption: (option: string) => void }) {
  const location = useLocation();
  const isOceanMetaPage = location.pathname === '/intro' || location.pathname === '';
  const isPassportsPage = location.pathname === '/passports';
  const isOceanApiPage = location.pathname === '/oceanapi';
  const isRequestIdsPage = location.pathname === '/preregister';
  const isOceanJsonPage = location.pathname === '/oceanjson';

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOceanMetaPage || isPassportsPage || isOceanApiPage || isRequestIdsPage || isOceanJsonPage ? 'center' : 'flex-start',
        justifyContent: isOceanMetaPage ? 'center' : 'flex-start',
        height: '100vh',
        overflowY: 'auto',
      }}
    >
		<Routes>
			<Route path="/intro" element={<OceanMeta darkMode={darkMode} setSelectedOption={setSelectedOption} />} />
			<Route path="/ontology" element={<Ontology darkMode={darkMode} />} />
			<Route path="/dictionary" element={<Dictionary darkMode={darkMode} />} />
			<Route path="/code-tables" element={<CodeTables darkMode={darkMode} />} />
			<Route path="/passports" element={<Passports darkMode={darkMode} />} />
			<Route path="/oceanjson" element={<OceanJSON darkMode={darkMode} />} />
			<Route path="/oceancsv" element={<OceanCsv darkMode={darkMode} />} />
			<Route path="/oceanapi" element={<OceanAPI darkMode={darkMode} />} />
			<Route path="/workflow" element={<SubmitPlatforms darkMode={darkMode} />} />
			<Route path="/preregister" element={<RequestIds darkMode={darkMode} />} />
			<Route path="/" element={<Navigate to="/intro" replace />} />
			<Route path="*" element={<Navigate to="/intro" replace />} />
		</Routes>
    </Box>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string>('OceanMeta');

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', width: '100vw' }}>
          <Sidebar
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode(!darkMode)}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
          <AppContent darkMode={darkMode} setSelectedOption={setSelectedOption} />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
