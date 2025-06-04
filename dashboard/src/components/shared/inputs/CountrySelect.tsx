'use client';

import React, { useState } from 'react';
import { Autocomplete, TextField, Chip, Box } from '@mui/material';
import { styled } from '@mui/system';
import fetchCountryOptions from '@/lib/fetchers/fetchCountryOptions.client';
import { CountryOption } from '@/types/types';
import Image from 'next/image';


interface CountryFieldProps {
  label: string;
  value?: CountryOption | CountryOption[] | null;
  onChange: (newValue: CountryOption | CountryOption[] | null) => void;
  multiple?: boolean;
  options: CountryOption[]
}

const OptionBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const CountryField: React.FC<CountryFieldProps> = ({ value, onChange, multiple, options }) => {

  return (
    <Autocomplete
      multiple={multiple}
      size="medium"
      options={options}
      getOptionLabel={(option) => option.name}
      value={value ?? (multiple ? [] : null)}
      onChange={(_, newValue) => onChange(newValue)}
      isOptionEqualToValue={(option, val) => option.id === val.id}
		renderTags={(value, getTagProps) =>
		Array.isArray(value)
			? value.map((option, index) => {
				const tagProps = Object.fromEntries(
					Object.entries(getTagProps({ index })).filter(([k]) => k !== 'key')
				);

				return (
				<Chip
					key={option.id} 
					{...tagProps}
					label={
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Image
						src={`https://www.ocean-ops.org/static/images/flags_iso/24/${option.code2?.toLowerCase()}.png`}
						alt=""
						width={18}
						height={18}
						onError={(e) => {
							e.currentTarget.style.display = 'none';
						}}
						/>
						{option.name}
					</Box>
					}
				/>
				);
			})
			: null
		}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <OptionBox>
            <Image
				src={`https://www.ocean-ops.org/static/images/flags_iso/24/${option.code2?.toLowerCase()}.png`}
				alt=""
				width={24}
				height={24}
				style={{ marginRight: 10 }}
				onError={(e) => {
					e.currentTarget.style.display = 'none';
				}}
			/>
            {option.name}
          </OptionBox>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={"Country"}
        />
      )}
      sx={{
        minWidth: '240px',
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'background.default',
          color: 'text.primary',
        },
        '& .MuiChip-root': {
          backgroundColor: 'action.selected',
          color: 'text.primary',
        },
      }}
    />
  );
};

export default CountryField;
