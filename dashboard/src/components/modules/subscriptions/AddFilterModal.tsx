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
import React, { useEffect, useRef, useState } from 'react';
import { ALERT_SEVERITY_OPTIONS } from '@/constants/alertOptions';
import { FilterOption } from '@/types/filters';
import CountrySelect from '../../shared/inputs/CountrySelect';
import { CountryOption } from '@/types/types';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dayjs } from 'dayjs';
import fetchCountryOptions from '@/lib/fetchers/fetchCountryOptions.client';
import SingleSelectChip from '@/components/shared/inputs/SingleSelectChip';
import { fetchEventsList, fetchResourcesList } from '@/lib/fetchers/fetchAlertsAttributeCount.client';

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
  { label: 'Resource', value: 'resource' },
  { label: 'WIGOS-ID', value: 'wigosId' },
  { label: 'Time range', value: 'timeRange' },
  { label: 'Event', value: 'event' }
];

const AddFilterModal = ({ open, onClose, onConfirm }: AddFilterModalProps) => {
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState<FilterValue>('');
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  const valueInputRef = useRef<HTMLInputElement>(null);

  // Auto-open the filter type select when the modal opens
  useEffect(() => {
    if (open) {
      setFilterType('');
      setFilterValue('');
      setSelectOpen(true);
    } else {
      setSelectOpen(false);
    }
  }, [open]);

  const fetchOptions = async (type: string) => {
    setLoadingOptions(true);
    let options: FilterOption[] = [];

    try {
      switch (type) {
        case 'minSeverityId':
          options = ALERT_SEVERITY_OPTIONS;
          break;
        case 'countryName' :
          const countryData = await fetchCountryOptions();
          const fetchedCountryOptions = countryData
            .filter((item) => item.id && item.name)
            .map((item) => ({
              id: item.id ?? '',
              name: item.name ?? 'Unknown',
              code2: item.code2 ?? '',
            }));
          options = fetchedCountryOptions.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          break;
        case 'event':
          const eventData= await fetchEventsList();
          options = (eventData?.events ?? [])
            .map(e => ({
              name: e?.event
            }))
          break;
        case 'resource':
          const resourceData= await fetchResourcesList();
          options = (resourceData?.resources ?? [])
            .map(e => ({
              name: e?.resource
            }))
          break;
      }
    }     
     catch  {      
    }
    setFilterOptions(options);    
    setLoadingOptions(false);
  };

  const handleTypeChange = async (selectedType: string) => {
    setFilterType(selectedType);
    setFilterValue('');
    setSelectOpen(false);

    await fetchOptions(selectedType);

    // automatically focus on the input when fetch is done
    setTimeout(() => valueInputRef.current?.focus(), 0);
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
                onChange={(e) => handleTypeChange(e.target.value as string)}
                fullWidth
                label={"Filter type"}
                // Open the dropdown automatically on modal show
                  open={selectOpen}
                  onOpen={() => setSelectOpen(true)}
                  onClose={() => setSelectOpen(false)}
                  displayEmpty
                  renderValue={(val) => (val ? FILTER_TYPES.find(f => f.value === val)?.label : '')}
                  MenuProps={{ disableScrollLock: true }}
              >
                {FILTER_TYPES.map((f) => (
                  <MenuItem key={f.value} value={f.value}>
                    {f.label}
                  </MenuItem>
                ))}
              </Select>
          </FormControl>

          {/* Set filter input form */}
          { (() => {
              switch (filterType) {
                // TIME RANGE INPUT
                case 'timeRange' :
                  return(
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
                  )
                // COUNTRY INPUT  
                case 'countryName' :
                  return(
                    <CountrySelect 
                      label="Country"
                      multiple={false}
                      onChange={(newValue) => {
                        if (newValue) {
                          setFilterValue(newValue as CountryOption);
                        } else {
                          setFilterValue(null);
                        }
                      } } 
                      options={filterOptions as CountryOption[]}
                      openOnFocus={true}
                      autoFocus
                      inputRef={valueInputRef}
                		/>
                  )
                // MIN SEVERITY INPUT
                case 'minSeverityId':
                  return(
                     <SingleSelectChip 
                        datalist={filterOptions.map(f => f.label ?? f.name ?? "")} 
                        filterName={'Severity'} 
                        onFilterChange={(_, value)=> setFilterValue(value)} 
                        selectedValue={String(filterValue)}
                        fullwidth
                        inputRef={valueInputRef}
                        disabled={loadingOptions}
                      />	
                  )
                // EVENT INPUT
                case 'event' :
                  return(
                    <SingleSelectChip 
                      datalist={filterOptions.map(f => f.name ?? "")} 
                      filterName={'Event'} 
                      onFilterChange={(_, value)=> setFilterValue(value)} 
                      selectedValue={String(filterValue)}
                      fullwidth
                      inputRef={valueInputRef}
                      disabled={loadingOptions}
                      freesolo={true} // user can want to subscribe to an event which is not yet in alerta database (because no alert has been emitted with this event yet)
                    />
                  )
                case 'resource' :
                  return(
                    <SingleSelectChip 
                      datalist={filterOptions.map(f => f.name ?? "")} 
                      filterName={'Resource'} 
                      onFilterChange={(_, value)=> setFilterValue(value)} 
                      selectedValue={String(filterValue)}
                      fullwidth
                      inputRef={valueInputRef}
                      disabled={loadingOptions}
                      freesolo={true} // user can want to subscribe to a resource which is not yet in alerta database (because no alert has been emitted with this resource yet)
                    />
                  )
                // OTHERS INPUT :
                default:
                  return (
                     <TextField
                        label="Value"
                        fullWidth
                        value={typeof filterValue === 'string' ? filterValue : ''}
                        onChange={(e) => setFilterValue(e.target.value)}
                        inputRef={valueInputRef}
                        autoFocus 
                      />
                  ) 
              }
            })()
          }         
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}
          variant="outlined">Cancel</Button>
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
