import React from 'react' 
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { TableViewConfig } from '@/config/tableConfigs'
import EnhancedTableCell from '../EnhancedTableCell';

interface HasId {
  id: string;
}
interface BasicTableProps<T extends HasId > {
    colmunsConfiguration: TableViewConfig<T>
    data: Array<T>
    handleClickOnRow?:  (event: React.MouseEvent<unknown>, id: string) => void
}

function BasicTable<T extends HasId >({colmunsConfiguration, data, handleClickOnRow}: BasicTableProps<T>) {
    
  return (    
    
      <TableContainer  component={Paper}>           
        <Table  aria-label="simple table">
          <TableHead>
            <TableRow >
              {colmunsConfiguration.mainColumns.map(col => (
                        <TableCell
                          sx={{fontWeight: 600}}
                          key={`headCell-${String(col.key)}`}
                          align={col.align ?? 'left'} 
                          padding={col.padding ?? 'normal'}                                            
                        >                        
                            {col.label ?? String(col.key)}
                            
                        </TableCell>
              ))}  
            </TableRow>
          </TableHead>       
          <TableBody>
            {(data ?? []).map((rowData, index) => {               
                  return (
                      
                      <TableRow
                          key={`basic-table-row-${rowData.id}-${index}`}
                          hover                  
                          onClick={handleClickOnRow && ((event: React.MouseEvent<unknown>) => handleClickOnRow(event, rowData.id))}                       
                          tabIndex={-1}                   
                          sx={handleClickOnRow ? { cursor: 'pointer',
                              '& > *': { borderBottom: 'unset !important' }
                              } :
                            {'& > *': { borderBottom: 'unset !important' }}
                            }                        
                      >
                          {colmunsConfiguration.mainColumns.map((col, index) =>            
                            <EnhancedTableCell 
                              key={`cell-${rowData.id}-${index}`} 
                              rowData={rowData} 
                              col={col} 
                              index={index} 
                              rowId={rowData.id} />
                            )}                            
                      </TableRow>



                  );
                })}              
          </TableBody>
        </Table> 
      </TableContainer>   
   
  )
}

export default BasicTable