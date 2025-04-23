import { Alert, Slide, Snackbar } from '@mui/material'
import React from 'react'
import { AlertProps } from '@mui/material';
import type { SlideProps } from '@mui/material/Slide';

const SlideTransition = (props: SlideProps) => <Slide {...props} direction="left" />;

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
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
		slots={{ transition: SlideTransition }}
    >
        <Alert
            onClose={handleCloseSnackbar}
            sx={{ width: '100%' }}
            variant="filled"
            {...alertProps} 
        >
            {message}
        </Alert>
    </Snackbar>
  )
}

export default SnackbarAlert