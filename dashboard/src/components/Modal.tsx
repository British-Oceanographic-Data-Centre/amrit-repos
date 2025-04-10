"use client";

import { Dialog } from '@mui/material';
import { useRouter } from 'next/navigation';

import React from 'react'

const Modal = ({children} : {children: React.ReactNode}) => {
    const router = useRouter()

    const handleClose = () => {
        router.back()
    }

  return (    
        <Dialog id="model" open={true} onClose={handleClose} slotProps={{ paper : {
            sx: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              width: '100%',              
            },
          }}}>

            {children}

        </Dialog>

  )
}

export default Modal