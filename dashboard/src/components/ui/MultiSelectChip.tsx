'use client';
import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Theme, useTheme } from '@mui/material';
import React from 'react'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface MultiSelectChipProps {
    datalist : string[]
    selectedItems: string[]
    filterName : string
    onFilterChange: (filterKey: string, values: string[]) => void
}



function getStyles(itemName: string, selectedItems: readonly string[], theme: Theme) {
    return {
      fontWeight: selectedItems.includes(itemName)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }

const MultiSelectChip = ({datalist, selectedItems, onFilterChange, filterName} : MultiSelectChipProps) => {
    const theme = useTheme();
    const handleChange = (event: SelectChangeEvent<typeof selectedItems>) => {
        const {
          target: { value },
        } = event;

        const values = typeof value === 'string' ? value.split(',') : value;
        onFilterChange(filterName,  values)
      };


  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">{filterName}</InputLabel>
        <Select
		  labelId={`${filterName}-label`}
		  id={`${filterName}-select`}
		  inputProps={{
			'aria-label': `Select ${filterName}`,
		  }}
          multiple
          value={selectedItems}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label={filterName} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {datalist.map((item) => (
            <MenuItem
              key={item}
              value={item}
              style={getStyles(item, selectedItems, theme)}
            >
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default MultiSelectChip