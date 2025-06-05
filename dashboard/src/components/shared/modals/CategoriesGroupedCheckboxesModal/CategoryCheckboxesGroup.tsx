import { firstLetterToUppercase } from '@/lib/utils/stringUtils';
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import React, { useMemo } from 'react'

interface CategoryCheckboxesGroupProps<T> {
    category: string
    groupedElementsByCategory :  Record<string, T[]>
    chosenElementsList : T[]
    handleChildToggle : (choice: T) => (event: React.ChangeEvent<HTMLInputElement>) => void
    handleParentToggle: (category: string) => (event: React.ChangeEvent<HTMLInputElement>) => void
}

function CategoryCheckboxesGroup<T> ({category,groupedElementsByCategory: categoriesElements, chosenElementsList,handleChildToggle, handleParentToggle }:CategoryCheckboxesGroupProps<T> )  {
    // retrieve elements for the current category
    const categoryElements= categoriesElements[category];
    // if all element of the category are checked
    const allChecked = useMemo(() => categoryElements.every(c => chosenElementsList.includes(c)), [categoryElements, chosenElementsList]);
    // Only some element of the category are checked
    const someChecked = useMemo(() => categoryElements.some(c => chosenElementsList.includes(c)), [categoryElements, chosenElementsList]);
  

    return (
     
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            label={<Typography fontWeight="bold">{category}</Typography>}
            control={
              <Checkbox
                checked={allChecked}
                indeterminate={!allChecked && someChecked}
                onChange={handleParentToggle(category)}
              />
            }
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
            {categoryElements.map(c => (
              <FormControlLabel
                key={String(c)}
                label={firstLetterToUppercase(String(c)).replace("_"," ")}
                control={
                  <Checkbox
                    checked={chosenElementsList.includes(c)}
                    onChange={handleChildToggle(c)}
                  />
                }
              />
            ))}
          </Box>
        </Box>
      
    );
  
}

export default CategoryCheckboxesGroup