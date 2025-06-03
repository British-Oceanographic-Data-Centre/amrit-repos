import React from 'react'
import Modal from '../Modal'
import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid2 } from '@mui/material'
import SubmitButton from '../../buttons/SubmitButton'

interface CategoryGroupedChoicesModalProps<T> {
    categoriesChoices :  Record<string, T[]>
    isModalOpen : boolean
    onClose: () => void
}
function CategoryGroupedChoicesModal<T> ({categoriesChoices, isModalOpen, onClose} : CategoryGroupedChoicesModalProps<T> ) {
  return (
    <Modal isModalOpen={isModalOpen} handleClose={onClose}>
        <DialogTitle>
            Select Filters
        </DialogTitle>
        <DialogContent>
            <Box sx={{ mt: 2, maxHeight: '60vh', overflowY: 'auto', px: 2 }}>
                <Grid2 container spacing={2}>
                    {Object.keys(categoriesChoices).map((category) => {
                        
                        return (
                            <div key={category}>{category}</div>
                        )

                        })                     
                    }

                </Grid2>
            </Box>

       
        </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={onClose}>Cancel</Button>
            <SubmitButton pending={false} fullwidth={false} onClick={() => null}>Confirm</SubmitButton>           
        </DialogActions>

    </Modal> )
}

export default CategoryGroupedChoicesModal