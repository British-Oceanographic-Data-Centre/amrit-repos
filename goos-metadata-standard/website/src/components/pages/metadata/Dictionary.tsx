import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { PageProps } from '../PageProps';

interface Field {
  code: string;
  title: string;
  type?: string;
  definition?: string;
}

interface Class {
  id: string;
  label: string;
  type: string;
  definition?: string;
  fields: Field[];
}

const BASE_PATH = '/meta';

const Dictionary: React.FC<PageProps> = ({ darkMode }) => {
  const [data, setData] = useState<Class[]>([]);

  useEffect(() => {
    fetch(`${BASE_PATH}/data/mcd.json`)
      .then((response) => response.json())
      .then((schema) => setData(schema.classes))
      .catch((error) => console.error('Error loading MCD schema:', error));
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h2" sx={{ fontWeight: 500, color: darkMode ? "#03a9f4" : "#009af4" }}>
        Dictionary
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow  sx={{ backgroundColor: darkMode ? '#438cb0' : '#aae3ff', color: darkMode ? '#ffffff' : '#000000de' }}>
              <TableCell><strong>Code</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Definition</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((cls) => (
              <React.Fragment key={cls.id}>
                <TableRow sx={{ backgroundColor: darkMode ? '#263238' : '#f5f5f5' }}>
                  <TableCell>{cls.id}</TableCell>
                  <TableCell>{cls.label}</TableCell>
                  <TableCell>CLASS</TableCell>
                  <TableCell>{cls.definition || ''}</TableCell>
                </TableRow>
                {cls.fields.map((field) => (
                  <TableRow key={field.code}>
                    <TableCell>{field.code}</TableCell>
                    <TableCell>{field.title}</TableCell>
                    <TableCell>{field.type || ''}</TableCell>
                    <TableCell>{field.definition || ''}</TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dictionary;
