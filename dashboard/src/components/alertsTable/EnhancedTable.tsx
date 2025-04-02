'use client';

import { Order } from '@/types/types';
import { Box, Checkbox, CircularProgress, FormControlLabel, Paper, Switch, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react'
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';
import getAlerts from '@/lib/fetchAlerts';
import { Alert, AlertApiResponse } from '@/types/alert';


const EnhancedTable = () => {
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof Alert>('lastReceiveTime');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState(false);
  const [alertsApiResponseData, setAlertsApiResponseData] = useState<AlertApiResponse>();


    // fetch alerts data
    useEffect(() => {   
      let isLatestRequest = true; 
      const controller = new AbortController();
      const signal = controller.signal;

      async function fetchAlertData() {
        setLoading(true);
        try {
          const alertsData = await getAlerts(["open","ack"],page+1, rowsPerPage, [order==='desc' ? orderBy : "-"+orderBy], signal);
          if (isLatestRequest) { 
            setAlertsApiResponseData(alertsData);
          }
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error('An error occurred while fetching alerts.');
          }
          
        } finally {
          if (isLatestRequest) { 
            setLoading(false);
          }
        }
      }

      fetchAlertData();
      
      return () => {
        isLatestRequest = false; 
        controller.abort();
      };    
    }, [page, rowsPerPage, orderBy, order])
    


  
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Alert,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && alertsApiResponseData?.alerts) {
      const newSelected = alertsApiResponseData.alerts.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
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
    page > 0 && alertsApiResponseData ? Math.max(0, (1 + page) * rowsPerPage - alertsApiResponseData.total) : 0;

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
        <EnhancedTableToolbar numSelected={selected.length} />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={alertsApiResponseData?.total ?? 0}
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
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={alertsApiResponseData?.alerts.length ?? 0}
            />
            
            <TableBody>
              {(alertsApiResponseData?.alerts ?? []).map((alert, index) => {
                const isItemSelected = selected.includes(alert.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, alert.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={alert.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}                        
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {alert.resource}
                    </TableCell>
                    {/*TO DO, improvment : make the column name and order customizable based on Alert type  */}
                    <TableCell align="left" >{alert.severity}</TableCell>
                    <TableCell align="left">{alert.status}</TableCell>
                    <TableCell align="left">{alert.event}</TableCell>
                    <TableCell align="left">{alert.value}</TableCell>
                    <TableCell align="left">{alert.text}</TableCell>
                    <TableCell align="left">{alert.lastReceiveTime}</TableCell>
                  </TableRow>
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
        label="Dense padding"
      />
    </Box>
  )
}

export default EnhancedTable