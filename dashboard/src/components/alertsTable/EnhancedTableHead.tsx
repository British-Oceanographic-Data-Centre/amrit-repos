import { Alert } from '@/types/alert';
import { Order } from '@/types/types';
import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React from 'react'



interface HeadCell {
    disablePadding: boolean;
    id: keyof Alert;
    label: string;
    numeric: boolean;
  }

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Alert) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
  }

const EnhancedTableHead = ({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }: EnhancedTableProps) => {


  // TO DO, improvment : make the column name and order customizable based on Alert type
  const headCells: readonly HeadCell[] = [
    {
      id: 'resource',
      numeric: false,
      disablePadding: true,
      label: 'Resource',
    },
    {
      id: 'severity',
      numeric: false,
      disablePadding: false,
      label: 'Severity',
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: false,
      label: 'Status',
    },
    {
      id: 'event',
      numeric: false,
      disablePadding: false,
      label: 'Event',
    },
    {
      id: 'value',
      numeric: false,
      disablePadding: false,
      label: 'Value',
    },
    {
      id: 'text',
      numeric: false,
      disablePadding: false,
      label: 'Description',
    },
    {
      id: 'lastReceiveTime',
      numeric: false,
      disablePadding: false,
      label: 'Last Receive Time',
    },    
  ];
  
  
  const createSortHandler =
  (property: keyof Alert) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}            
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            sx={{fontWeight: 'bold'}}
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default EnhancedTableHead