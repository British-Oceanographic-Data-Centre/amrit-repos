import React from 'react'
import Modal from './ui/Modal'
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import SubmitButton from './SubmitButton';

interface SubmitTextModalProps {
    open : boolean;
    onClose: () => void;
    onConfirm : (text :string) => void;
    pending:boolean
    title:string
}

// Simple non-controlled form
const SubmitTextModal = ({open, onClose, onConfirm, pending, title} :SubmitTextModalProps) => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const note = formData.get('text') as string
    onConfirm(note)    
  }

  return (
    <Modal isModalOpen={open} handleClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TextField
          label = "Comment on alert"
          name="text" 
          fullWidth
          autoFocus
          margin='dense'         />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <SubmitButton pending={pending} fullwidth={false}>Submit</SubmitButton>           
        </DialogActions>
      </form>
      
    </Modal>
  )
}

export default SubmitTextModal