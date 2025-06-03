import { Box, Checkbox, Chip, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React from 'react'
import { TableViewConfig } from '@/config/tableConfigs';

interface EnhancedTableRowProps<T> {
    rowData: T
    columnsConfig: TableViewConfig<T>
    isItemSelected: boolean
    handleClickOnRow:  (event: React.MouseEvent<unknown>, id: string) => void
    rowId: string
   

}

function EnhancedTableRow<T> ({rowData, columnsConfig, isItemSelected, handleClickOnRow, rowId}: EnhancedTableRowProps<T>) {

const [open, setOpen] = React.useState(false); // state for collapse table
  return (
    <React.Fragment>
        <TableRow
            hover
            onClick={(event) => handleClickOnRow(event, rowId)}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={rowId}
            selected={isItemSelected}
            sx={{ cursor: 'pointer',
                '& > *': { borderBottom: 'unset' }
             }}
            
        >
            {columnsConfig.moreInfoColumns &&
             <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // don't want to select row when clicking on expand/collapse "more info" table button
                      setOpen(!open)
                    }}
                >
                 {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>}
            
            <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    checked={isItemSelected} 
					slotProps={{
						input: {
						  'aria-label': 'Select row',
						  'aria-labelledby': `row-${rowId}`,
						},
					}}               
                />
            </TableCell>
            

            {columnsConfig.mainColumns.map((col, index) => (
                <TableCell
                key={`${String(col.key)}-${rowId}`}
                component={index === 0 ? 'th' : undefined}
                scope={index === 0 ? 'row' : undefined}
                padding={index === 0 ? 'none' : undefined}
                align={index !== 0 ? 'left' : undefined}
              >
                {col.chipColor ? (<Chip label={String(rowData[col.key])} color={col.chipColor[String(rowData[col.key])] ?? 'default'  }/>) : (rowData[col.key] != null ? String(rowData[col.key]) : '')}
              </TableCell>
            ))}   
        </TableRow>

        {/*  Collapsing table part */}
        {columnsConfig.moreInfoColumns &&
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columnsConfig.mainColumns.length + 1 }>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    More informations
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        {columnsConfig.moreInfoColumns.map((col, index) => 
                            (<TableCell
                                key={`additional-rowHeader-${index}`}
                                align={col.align ?? 'left'}
                                sx={{fontWeight: 'bold'}}
                              >
                                {col.label ?? String(col.key)}
                              </TableCell>)
                         )}                        
                      </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow key={`additional-row-${rowId}`}>
                            {columnsConfig.moreInfoColumns.map((col, index) => (
                                <TableCell
                                key={`additional-cell-${rowId}-${index}`}
                                {...(index === 0
                                ? { component: 'th', scope: 'row' }
                                : { align: col.align ?? 'left' })}
                            >
                                 {col.chipColor ? (<Chip label={String(rowData[col.key])} color={col.chipColor[String(rowData[col.key])] ?? 'info'  }/>) : (rowData[col.key] != null ? String(rowData[col.key]) : '')}
                            </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        }
    </React.Fragment>
  )
}

export default EnhancedTableRow