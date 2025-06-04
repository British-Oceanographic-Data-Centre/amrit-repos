import React from 'react'
import Modal from '../Modal'
import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid2 } from '@mui/material'
import SubmitButton from '../../buttons/SubmitButton'
import CategoryCheckboxesGroup from './CategoryCheckboxesGroup'

interface CategoryGroupedChoicesModalProps<T> {
    groupedElementsByCategory :  Record<string, T[]>
    isModalOpen : boolean
    onClose: () => void
    chosenElementsList : T[]
    setChosenElementsList: React.Dispatch<React.SetStateAction<T[]>>
}
function CategoryGroupedChoicesModal<T> ({groupedElementsByCategory, isModalOpen, onClose, chosenElementsList, setChosenElementsList} : CategoryGroupedChoicesModalProps<T> ) {
    // create a local state which replicate chosenElementsList :
    const [draftChosenElements, setDraftChosenElements] = React.useState<T[]>([]);
    // initialize this state by copying chosenElementsList when modal open :
    React.useEffect(() => {
        if (isModalOpen) {
            setDraftChosenElements(chosenElementsList);
        }
    }, [isModalOpen, chosenElementsList]);

   const handleChildToggle = (choice: T) => (event: React.ChangeEvent<HTMLInputElement>) => {
          if (event.target.checked) {
              setDraftChosenElements(prev => [...prev, choice]);
          } else {
              setDraftChosenElements(prev => prev.filter(f => f !== choice));
          }
      };

    const handleParentToggle = (category: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const categoryElements= groupedElementsByCategory[category];
        if (event.target.checked) {
            const newChoices = [...new Set([...chosenElementsList, ...categoryElements])];
            setDraftChosenElements(newChoices);
        } else {
            const newFilters = chosenElementsList.filter(groupedElementsByCategory => !categoryElements.includes(groupedElementsByCategory));
            setDraftChosenElements(newFilters);
        }
    };

    const handleConfirm = () => {
        setChosenElementsList(draftChosenElements);
        onClose();
        };


    const handleSelectAll = () => {
        const allElements = Object.values(groupedElementsByCategory).flat();
        setDraftChosenElements([...new Set(allElements)]);
    };

    const handleDeselectAll = () => {
        setDraftChosenElements([]);
    };
  
  
    return (
    <Modal isModalOpen={isModalOpen} handleClose={onClose}>
        <DialogTitle>
            Select Filters
        </DialogTitle>
        <DialogContent>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" onClick={handleSelectAll}>Select All</Button>
                <Button variant="outlined" onClick={handleDeselectAll}>De-select All</Button>
            </Box>
            <Box sx={{ mt: 2, maxHeight: '60vh', overflowY: 'auto', px: 2 }}>
                <Grid2 container spacing={2}>
                    {Object.keys(groupedElementsByCategory).map((category) => {                        
                        return (
                           <CategoryCheckboxesGroup<T> key={`checkox-category-${category}`} category={category} groupedElementsByCategory={groupedElementsByCategory} chosenElementsList={draftChosenElements} handleChildToggle={handleChildToggle } handleParentToggle={handleParentToggle } />
                        )
                        })                     
                    }

                </Grid2>
            </Box>

       
        </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={onClose}>Cancel</Button>
            <SubmitButton pending={false} fullwidth={false} onClick={handleConfirm}>Confirm</SubmitButton>           
        </DialogActions>

    </Modal> )
}

export default CategoryGroupedChoicesModal