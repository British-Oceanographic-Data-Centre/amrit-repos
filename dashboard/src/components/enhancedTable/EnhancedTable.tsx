'use client';

import { Order } from '@/types/types';
import { Box,  CircularProgress, FormControlLabel,  Paper, Switch, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import React, {  useState } from 'react'
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableRow from './EnhancedTableRow';
import { TableViewConfig } from '@/config/tableConfigs';


interface HasId {
  id: string;
}

interface EnhancedTableProps<T extends HasId > {  
  orderBy: keyof T
  setOrderBy: React.Dispatch<React.SetStateAction<keyof T>>
  order: Order
  setOrder: React.Dispatch<React.SetStateAction<Order>>
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  rowsPerPage: number
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>
  loading : boolean
  data: Array<T>
  totalCount: number
  colmunsConfiguration: TableViewConfig<T>
  selected :   readonly string[]
  setSelected : React.Dispatch<React.SetStateAction<readonly string[]>>
  toolbarActions? :   React.ReactNode;

}


function EnhancedTable<T extends HasId>  ({ orderBy, setOrderBy, order, setOrder, page, setPage, rowsPerPage, setRowsPerPage, loading,  data, totalCount, colmunsConfiguration, toolbarActions, selected, setSelected  } : EnhancedTableProps<T>) {
  
  // const [selected, setSelected] = useState<readonly string[]>([]); 
  const [dense, setDense] = useState(false);

  
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof T,
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
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 && totalCount ? Math.max(0, (1 + page) * rowsPerPage - totalCount) : 0;

  return (
    <Box sx={{ width: '100%' }}>

      {loading && (
        <Box sx={{
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
        }}>
          <CircularProgress />
        </Box>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar selected={selected} numSelected={selected.length} toolbarActions={toolbarActions} />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount ?? 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <TableContainer>
          <Table
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
            />
            
            <TableBody>
              {(data ?? []).map((rowData, index) => {
                const isItemSelected = selected.includes(rowData.id);
                
                return (
                  <EnhancedTableRow key={`table-row-${index}`} rowData={rowData} columnsConfig={colmunsConfiguration} isItemSelected={isItemSelected} handleClickOnRow={handleClickOnRow } rowId={rowData.id} />
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense table"
      />
    </Box>
  )
}

export default EnhancedTable