import { Box,  Toolbar,  Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import React from 'react'

interface EnhancedTableToolbarProps {
    selected: readonly string[]
    numSelected: number;
    toolbarActions? : React.ReactNode;
  }


const EnhancedTableToolbar = ({numSelected, toolbarActions} : EnhancedTableToolbarProps) => {
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Alerts
        </Typography>
      )}
      {numSelected > 0 && toolbarActions && (
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
          }}>

            {toolbarActions}    

        </Box>
      ) }
    </Toolbar>
  )
}

export default EnhancedTableToolbar