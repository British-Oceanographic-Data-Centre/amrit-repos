'use client';
import { firstLetterToUppercase } from '@/lib/utils/stringUtils';
import { Autocomplete,   Chip, FormControl,  TextField,  } from '@mui/material';
import React from 'react'


interface MultiSelectChipProps {
    datalist : string[]    
    filterName : string
    onFilterChange: (filterKey: string, values: string[]) => void
    selectedValues: string[]
    freesolo?:boolean
    
}



const MultiSelectChip = ({datalist, onFilterChange, filterName, selectedValues, freesolo=false} : MultiSelectChipProps) => {
    


  return (
    <div>
      <FormControl sx={{ width: 'auto', minWidth: 400, maxWidth: 900 }}>
        <Autocomplete
          id={`${filterName}-autocomplete`} 
          multiple
          freeSolo={freesolo}
          size="medium"
          options={datalist}
          value={selectedValues}
          onChange={(_, values) => onFilterChange(filterName, values)} 
          isOptionEqualToValue={(opt, val) => opt === val}               
          renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                key={option}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={firstLetterToUppercase(filterName)}
              placeholder={freesolo ? "Select options in list or type and press Enter" : "Select options in list" }
                            
            />
          )}
          disableCloseOnSelect
          noOptionsText="No options available"
        />  
      </FormControl>
    </div>
  )
}

export default MultiSelectChip