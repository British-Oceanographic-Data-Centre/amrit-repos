'use client';

import { Order } from '@/types/types';
import {
  Box,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from '@mui/material';
import React, { useState } from 'react';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableRow from './EnhancedTableRow';
import { TableViewConfig } from '@/config/tableConfigs';

interface HasId {
  id: string;
}

interface EnhancedTableProps<T extends HasId> {
  orderBy: keyof T;
  setOrderBy: React.Dispatch<React.SetStateAction<keyof T>>;
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  data: Array<T>;
  totalCount: number;
  colmunsConfiguration: TableViewConfig<T>;
  selected: readonly string[];
  setSelected: React.Dispatch<React.SetStateAction<readonly string[]>>;
  toolbarActions?: React.ReactNode;
  collapsingComponent?: (data: T) => React.ReactNode;
  onRowNavigate?: (id: string) => void; // ✅ already declared
}

function EnhancedTable<T extends HasId & Record<string, unknown>>({
  orderBy,
  setOrderBy,
  order,
  setOrder,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  data,
  totalCount,
  colmunsConfiguration,
  toolbarActions,
  selected,
  setSelected,
  collapsingComponent,
  onRowNavigate, // ✅ pull it from props
}: EnhancedTableProps<T>) {
  const [dense, setDense] = useState(false);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof T
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && data) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClickOnRow = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const emptyRows =
    page > 0 && totalCount ? Math.max(0, (1 + page) * rowsPerPage - totalCount) : 0;

  return (
    <Box sx={{
      height: '100%', 
      width: '100%', 
      display: 'flex',
      flexDirection: 'column',      
      
      }}
    >
      
        <EnhancedTableToolbar
          selected={selected}
          numSelected={selected.length}
          toolbarActions={toolbarActions}
        />
  
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount ?? 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{overflow:'hidden' }}
          
        />
  
        <TableContainer sx={{ height: '100%' }}>
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead<T>
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length ?? 0}
              columnsConfig={colmunsConfiguration}
              isCollapsedComponent={!!collapsingComponent}
            />
  
            <TableBody>
              {(data ?? []).map((rowData, index) => {
                const isItemSelected = selected.includes(rowData.id);
  
                return (
                  <EnhancedTableRow
                    key={`table-row-${index}`}
                    rowData={rowData}
                    columnsConfig={colmunsConfiguration}
                    isItemSelected={isItemSelected}
                    handleClickOnRow={handleClickOnRow}
                    rowId={rowData.id}
                    onRowNavigate={onRowNavigate} // ✅ ok now
                    onToggleSelect={(id) => {
                      const selectedIndex = selected.indexOf(id);
                      let next: readonly string[] = [];
                      if (selectedIndex === -1) next = next.concat(selected, id);
                      else if (selectedIndex === 0) next = next.concat(selected.slice(1));
                      else if (selectedIndex === selected.length - 1)
                        next = next.concat(selected.slice(0, -1));
                      else
                        next = next.concat(
                          selected.slice(0, selectedIndex),
                          selected.slice(selectedIndex + 1)
                        );
                      setSelected(next);
                    }}
                    // keep collapsing supported, even if you're not using it for alerts now
                    collapsingComponent={collapsingComponent && collapsingComponent(rowData)}
                  />
                ); // ✅ closed row component
              })}
  
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
  
        <FormControlLabel
          sx={{ marginLeft: 2 }}
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense table"
        />
      </Box>
    
  );
}

export default EnhancedTable;
