'use client';

import React from 'react';
import {
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
       
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                {columnsConfiguration.mainColumns.map((col) => (
                  <TableCell
                    key={`head-${String(col.key)}`}
                    align={col.align ?? 'left'}
                    padding={col.padding ?? 'normal'}
                    sx={{ fontWeight: 600 }}
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
    
  );
}

export default EditableTable;
