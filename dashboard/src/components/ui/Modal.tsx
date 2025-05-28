"use client";

import { Dialog } from '@mui/material';

import React from 'react'

interface ModalProps {
  children:React.ReactNode
  isModalOpen : boolean
  handleClose : () => void
  backgroundTransparent?: boolean
}

const Modal = ({children, isModalOpen, handleClose, backgroundTransparent = false} : ModalProps) => {
   
  //use of a conditionnal transparent background was needed for the login form component and may be needed for other.
  
  return (    
        <Dialog id="modal" open={isModalOpen} onClose={handleClose} slotProps={{
          backdrop: {
            sx: {             
              backdropFilter: 'blur(2px)',
             
            },
          },
           paper : {
            sx: {
              width: '100%',
              ...( backgroundTransparent && {
                backgroundColor: 'transparent',
                backgroundImage: 'none',
                boxShadow: 'none',
                }
              )          
              
            },
          }}}>

            {children}

        </Dialog>

  )
}

export default Modal