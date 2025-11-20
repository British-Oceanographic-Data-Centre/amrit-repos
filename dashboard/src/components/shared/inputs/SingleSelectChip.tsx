'use client';
import { firstLetterToUppercase } from '@/lib/utils/stringUtils';
import { Autocomplete,  Chip,  FormControl,  TextField,  } from '@mui/material';
import React, {  useState } from 'react'


interface SingleSelectChipProps {
    datalist : string[]    
    filterName : string
    onFilterChange: (filterKey: string, value: string |null) => void
    selectedValue: string | null;
    fullwidth?:boolean
    inputRef?:  React.RefObject<HTMLInputElement | null>
    disabled?:boolean
    freesolo?:boolean
    
}



const SingleSelectChip = ({datalist, onFilterChange, filterName, selectedValue, fullwidth=false, inputRef,disabled=false, freesolo=false} : SingleSelectChipProps) => {
     const [open, setOpen] = useState(false); // needed to open when focus via inputRef
     const [inputValue, setInputValue] = useState('');

  return (
    <div>
      <FormControl sx={{  width: fullwidth ?'100%' : 'auto', minWidth: 300, maxWidth: 900 }} fullWidth= {fullwidth}>
        <Autocomplete
          id={`${filterName}-autocomplete`}           
          size="medium"
          freeSolo={freesolo}
          options={datalist}
          value={selectedValue}
          onChange={(_, value) => {
            onFilterChange(filterName, value ?? '');
            setInputValue(''); // empty input to only have chip            
          }}
          inputValue={inputValue}
          onInputChange={(_, v, reason) => {
            if (reason !== 'reset') setInputValue(v ?? '');
          }}
          isOptionEqualToValue={(opt, val) => opt === val}
          open={open} // state controled
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}                   
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={firstLetterToUppercase(filterName)}
              placeholder= {!selectedValue ? (freesolo ? "Select one option in list or type new one and press Enter" : "Select one option in list") :''}
              inputRef={inputRef}
              onFocus={() => setOpen(true)} // open list when focus
               slotProps={{
                input: {
                    ...params.InputProps,
                    startAdornment: selectedValue ? (
                    <>
                        <Chip
                        label={selectedValue}
                        onDelete={() => {
                            onFilterChange(filterName, '');
                            setInputValue('');
                        }}
                        sx={{ mr: 0.5 }}
                        />
                        {params.InputProps.startAdornment}
                    </>
                    ) : (
                    params.InputProps.startAdornment
                    ),
                },
              }}                            
            />
          )}          
          noOptionsText="No options available"
          disabled={disabled}
        />  
      </FormControl>
    </div>
  )
}

export default SingleSelectChip