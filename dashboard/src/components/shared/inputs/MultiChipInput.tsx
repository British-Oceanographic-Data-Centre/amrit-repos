import React from 'react';
import { TextField, Autocomplete, FormControl } from '@mui/material';

interface MultiChipInputProps {
 selectedItems: string[]
 filterName : string
 onFilterChange: (filterKey: string, values: string[]) => void
}

export default function MultiChipInput({selectedItems, filterName,onFilterChange } : MultiChipInputProps) {
 
  return (
    <FormControl sx={{ m: 1, width: 300 }}>
        <Autocomplete
        multiple
        freeSolo
        disableCloseOnSelect
        options={[]} 
        value={selectedItems}
        onChange={(_, newValue) => {
            const cleaned = Array.from(new Set(newValue.map(v => v.trim()).filter(Boolean)));
            onFilterChange(filterName, cleaned);
        }}
        renderInput={(params) => (
            <TextField
            {...params}
            variant="outlined"
            label={`Search ${filterName}`}
            placeholder="Type and press Enter"
            />
        )}
        />
    </FormControl>
  );
}