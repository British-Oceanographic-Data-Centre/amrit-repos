import React from 'react'
import Modal from './Modal';
import { Button, DialogActions, DialogContent, Typography } from '@mui/material';
import SubmitButton from '../buttons/SubmitButton';

interface ConfirmationDialogModalProps {
    open : boolean;
    onClose: () => void;
    onConfirm : () => void;
    pending:boolean
    children:React.ReactNode

}

const confirmationDialogModal = ({open, onClose, onConfirm, pending, children}: ConfirmationDialogModalProps ) => {
  return (
    <Modal isModalOpen={open} handleClose={onClose}>
        <DialogContent>

        <Typography variant="h6" sx={{ mb: 3 }}>
         {children}
        </Typography>
        </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={onClose}>Cancel</Button>
            <SubmitButton pending={pending} fullwidth={false} onClick={onConfirm}>Confirm</SubmitButton>           
        </DialogActions>

    </Modal>
  )
}

export default confirmationDialogModal