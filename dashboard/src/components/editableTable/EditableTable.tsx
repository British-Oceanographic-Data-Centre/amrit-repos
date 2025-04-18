'use client';

import React from 'react';
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { EditableTableViewConfig } from '@/config/tableConfigs';
import EditableTableRow from './EditableTableRow';

interface HasId {
  id: string;
}

interface EditableTableProps<T extends HasId> {
  loading: boolean;
  data: Array<T>;
  totalCount: number;
  columnsConfiguration: EditableTableViewConfig<T>;
  onDeleteRow?: (id: string) => void;
  onUpdateField?: (id: string, key: keyof T, value: T[keyof T]) => void;
  onToggleSwitch?: (id: string, key: keyof T, newValue: boolean) => void;
  onRenderEditableCell?: (row: T, key: keyof T) => React.ReactNode;
  onOpenAddFilter?: (id: string) => void; 
}

function EditableTable<T extends HasId>({
  loading,
  data,
  totalCount,
  columnsConfiguration,
  onDeleteRow,
  onUpdateField,
  onToggleSwitch,
  onRenderEditableCell,
  onOpenAddFilter
}: EditableTableProps<T>) {
  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                {columnsConfiguration.mainColumns.map((col) => (
                  <TableCell
                    key={`head-${String(col.key)}`}
                    align={col.align ?? 'left'}
                    padding={col.padding ?? 'normal'}
                    sx={{ fontWeight: 'bold' }}
                  >
                    {col.label ?? String(col.key)}
                  </TableCell>
                ))}
                {onDeleteRow && <TableCell />}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <EditableTableRow<T>
                  key={`editable-row-${index}`}
                  rowData={row}
                  columnsConfig={columnsConfiguration}
                  onDelete={onDeleteRow}
                  onUpdateField={onUpdateField}
                  onToggleSwitch={onToggleSwitch}
                  onRenderEditableCell={onRenderEditableCell}
				  onOpenAddFilter={onOpenAddFilter}
                />
              ))}
              {totalCount === 0 && (
                <TableRow>
                  <TableCell colSpan={columnsConfiguration.mainColumns.length + 1} align="center">
                    No data to display.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default EditableTable;
