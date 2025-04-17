import { Alert, Snackbar } from '@mui/material'
import React from 'react'
import { AlertProps } from '@mui/material';

interface SnackbarAlertProps extends AlertProps {
    snackBarOpen: boolean
    handleCloseSnackbar : () => void
    message: string
    
} 

const SnackbarAlert = ({
    snackBarOpen,
    handleCloseSnackbar, message,
    ...alertProps
  }: SnackbarAlertProps) => {
  return (
    <Snackbar        
        open={snackBarOpen}
        onClose={handleCloseSnackbar}                     
    >
        <Alert
            onClose={handleCloseSnackbar}
            sx={{ width: '100%' }}
            {...alertProps} 
        >
            {message}
        </Alert>
    </Snackbar>
  )
}

export default SnackbarAlert