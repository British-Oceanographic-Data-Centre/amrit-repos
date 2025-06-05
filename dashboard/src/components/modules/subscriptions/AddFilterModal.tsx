'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Stack,
  FormControl,
  InputLabel,
} from '@mui/material';
import React, { useState } from 'react';
import { ALERT_SEVERITY_OPTIONS } from '@/constants/alertOptions';
import { FilterOption } from '@/types/filters';
import CountrySelect from '../../shared/inputs/CountrySelect';
import { CountryOption } from '@/types/types';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dayjs } from 'dayjs';
import fetchCountryOptions from '@/lib/fetchers/fetchCountryOptions.client';

export type FilterValue =
  | string
  | { minTime?: string; maxTime?: string }
  | CountryOption
  | null;

interface AddFilterModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (filterType: string, value: FilterValue) => void;
}

const FILTER_TYPES = [
  { label: 'Minimum Severity', value: 'minSeverityId' },
  { label: 'Country', value: 'countryName' },
  { label: 'WIGOS-ID', value: 'wigosId' },
  { label: 'Time range', value: 'timeRange' },
];

const AddFilterModal = ({ open, onClose, onConfirm }: AddFilterModalProps) => {
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState<FilterValue>('');
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [, setCountryValue] = useState<CountryOption | null>(null);

  const fetchOptions = async (type: string) => {
    setLoadingOptions(true);
    let options: FilterOption[] = [];

    try {
      switch (type) {
        case 'minSeverityId':
          options = ALERT_SEVERITY_OPTIONS;
          setFilterOptions(filterOptions);
          break;
        case 'countryName' :
          const data = await fetchCountryOptions();
          const fetchedCountryOptions = data
            .filter((item) => item.id && item.name)
            .map((item) => ({
              id: item.id ?? '',
              name: item.name ?? 'Unknown',
              code2: item.code2 ?? '',
            }));
          options = fetchedCountryOptions.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
      }
    }     
     catch  {      
    }
    setFilterOptions(options);    
    setLoadingOptions(false);
  };

  const handleConfirm = () => {
    onConfirm(filterType, filterValue);
    setFilterType('');
    setFilterValue('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add a Filter</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
			<FormControl fullWidth>
  <InputLabel id="filter-type-label">Filter type</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => {
              const selectedType = e.target.value;
              setFilterType(selectedType);
              setFilterValue('');
              fetchOptions(selectedType);
            }}
            fullWidth
			label={"Filter type"}
          >
            {FILTER_TYPES.map((f) => (
              <MenuItem key={f.value} value={f.value}>
                {f.label}
              </MenuItem>
            ))}
          </Select>
</FormControl>

          {filterType === 'timeRange' ? (
            <Stack direction="row" spacing={2}>
				<DateTimePicker
				label="From"
  				format="YYYY-MM-DD HH:mm:ss"
				onChange={(newValue: Dayjs | null) =>
					setFilterValue((prev: FilterValue) => ({
					...(typeof prev === 'object' && prev !== null ? prev : {}),
					minTime: newValue?.toISOString() ?? undefined,
					}))
				}
				slotProps={{ textField: { fullWidth: true } }}
				/>

				<DateTimePicker
				label="To"
  				format="YYYY-MM-DD HH:mm:ss"
				onChange={(newValue: Dayjs | null) =>
					setFilterValue((prev: FilterValue) => ({
					...(typeof prev === 'object' && prev !== null ? prev : {}),
					maxTime: newValue?.toISOString() ?? undefined,
					}))
				}
				slotProps={{ textField: { fullWidth: true } }}
				/>
            </Stack>
          ) : (filterType && ['countryName'].includes(filterType) ? (
            <CountrySelect 
                label="Country"
                multiple={false}
                onChange={(newValue) => {
                  if (newValue) {
                    setCountryValue(newValue as CountryOption);
                    setFilterValue(newValue as CountryOption);
                  } else {
                    setCountryValue(null);
                    setFilterValue(null);
                  }
                } } 
                options={filterOptions as CountryOption[]}			/>
          ) : filterType && ['minSeverityId'].includes(filterType) ? (
			
			<FormControl fullWidth>
 				 <InputLabel id="filter-severity-label">Minimum severity</InputLabel>
				<Select
				labelId="filter-severity-label"
				label="Minimum severity"
				value={String(filterValue)}
				fullWidth
				onChange={(e) => setFilterValue(e.target.value)}
				disabled={loadingOptions}
				>
				{filterOptions.map((opt) => (
					<MenuItem key={opt.id ?? opt.value} value={opt.label ?? opt.name}>
					{opt.label ?? opt.name}
					</MenuItem>
				))}
				</Select>
			</FormControl>
          ) : (
            filterType && (
              <TextField
                label="Value"
                fullWidth
                value={typeof filterValue === 'string' ? filterValue : ''}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            )
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!filterType || !filterValue}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFilterModal;
