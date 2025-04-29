import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, SelectChangeEvent, CircularProgress } from '@mui/material';

interface CodeTable {
  title: string;
  code: string;
  url: string;
  columnsDictionary: { [key: string]: string };
}

const BASE_PATH = '/meta';

const CodeTables: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [codeTables, setCodeTables] = useState<CodeTable[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>('CT-COU');
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    fetch(`${BASE_PATH}/data/codeTables.json`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load codeTables.json');
        return response.json();
      })
      .then((data) => {
        setCodeTables(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading codeTables.json:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedCode) {
      const selectedTable = codeTables.find((table) => table.code === selectedCode);
      if (selectedTable) {
        setTableLoading(true);
        fetch(`${selectedTable.url}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
            }
            return response.json();
          })
          .then((data) => {
            const sortedData = data.data.sort((a: { name: string }, b: { name: string }) => (a.name > b.name ? 1 : -1));
            setTableData(sortedData);
            setTableLoading(false);
          })
          .catch((error) => {
            console.error(`Error loading table data from ${selectedTable.url}:`, error);
            setTableLoading(false);
          });
      }
    } else {
      setTableData([]);
    }
  }, [selectedCode, codeTables]);

  const selectedTable = codeTables.find((table) => table.code === selectedCode);

  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant="h2" sx={{ fontWeight: 500, color: darkMode ? "#03a9f4" : "#009af4" }}>
          Code Tables
        </Typography>

        {loading ? (
          <CircularProgress sx={{ marginTop: 2 }} />
        ) : (
          <Select
            value={selectedCode}
            onChange={(event: SelectChangeEvent) => setSelectedCode(event.target.value)}
            displayEmpty
            sx={{ marginTop: 2, minWidth: 200 }}
          >
            <MenuItem value="" disabled>Select a Code Table</MenuItem>
            {codeTables.map((table) => (
              <MenuItem key={table.code} value={table.code}>
                {table.title}
              </MenuItem>
            ))}
          </Select>
        )}
      </Box>

      {selectedTable && (
        tableLoading ? (
          <CircularProgress sx={{ marginTop: 4 }} />
        ) : (
          <Table sx={{ marginTop: 2, border: '2px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
            <TableHead>
              <TableRow  sx={{ backgroundColor: darkMode ? '#438cb0' : '#aae3ff', color: darkMode ? '#ffffff' : '#000000de' }}>
                {Object.values(selectedTable.columnsDictionary).map((colTitle, index) => (
                  <TableCell key={index} sx={{ color: darkMode ? '#ffffff' : '#282828de', fontWeight: 'bold', fontSize: '16px' }}>{colTitle}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: darkMode ? '#1e1e1e' : '#f9f9f9' } }}>
                  {Object.keys(selectedTable.columnsDictionary).map((colKey, idx) => (
                    <TableCell key={idx} sx={{}}>{row[colKey]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      )}
    </Box>
  );
};

export default CodeTables;
