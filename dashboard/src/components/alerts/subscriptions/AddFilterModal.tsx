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
} from '@mui/material';
import React, { useState } from 'react';
export type FilterValue = string | { minTime?: string; maxTime?: string };

interface AddFilterModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (filterType: string, value: FilterValue) => void;
}


interface FilterOption {
  id?: string | number;
  name?: string;
  label?: string;
  value?: string;
}

const FILTER_TYPES = [
  { label: 'Minimum Severity', value: 'minSeverityLabel' },
  { label: 'Country', value: 'countryName' },
  { label: 'Basin', value: 'basinName' },
  { label: 'WIGOS-ID', value: 'wigosId' },
  { label: 'Time range', value: 'timeRange' },
];

const AddFilterModal = ({ open, onClose, onConfirm }: AddFilterModalProps) => {
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState<FilterValue>('');
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const fetchOptions = async (type: string) => {
    setLoadingOptions(true);
    let options: FilterOption[] = [];

    try {
      if (type === 'countryName') {
        const res = await fetch('/api/gateway/countries');
        options = await res.json();
      } else if (type === 'basinName') {
        const res = await fetch('/api/gateway/basins');
        options = await res.json();
      } else if (type === 'minSeverityLabel') {
        const res = await fetch('/api/gateway/severities');
        options = await res.json();
      }
    } catch  {
      console.error(`Failed to fetch options.`);
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
          <Select
            value={filterType}
            onChange={(e) => {
              const selectedType = e.target.value;
              setFilterType(selectedType);
              setFilterValue('');
              fetchOptions(selectedType);
            }}
            displayEmpty
            fullWidth
          >
            <MenuItem disabled value="">
              <em>Select filter type</em>
            </MenuItem>
            {FILTER_TYPES.map((f) => (
              <MenuItem key={f.value} value={f.value}>
                {f.label}
              </MenuItem>
            ))}
          </Select>

          {filterType === 'timeRange' ? (
            <Stack direction="row" spacing={2}>
              <TextField
                type="date"
                label="From"
                fullWidth
                onChange={(e) =>
					setFilterValue((prev: FilterValue) => ({
						...(typeof prev === 'object' && prev !== null ? prev : {}),
						minTime: e.target.value,
					}))
					  
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="date"
                label="To"
                fullWidth
                onChange={(e) =>
					setFilterValue((prev: FilterValue) => ({
						...(typeof prev === 'object' && prev !== null ? prev : {}),
						maxTime: e.target.value,
					  }))
					  
                }
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          ) : filterType && ['countryName', 'basinName', 'minSeverityLabel'].includes(filterType) ? (
            <Select
              value={String(filterValue)}
              fullWidth
              onChange={(e) => setFilterValue(e.target.value)}
              displayEmpty
              disabled={loadingOptions}
            >
              <MenuItem disabled value="">
                <em>Select value</em>
              </MenuItem>
              {filterOptions.map((opt) => (
                <MenuItem key={opt.id ?? opt.value} value={opt.label ?? opt.name}>
                  {opt.label ?? opt.name}
                </MenuItem>
              ))}
            </Select>
          ) : (
            filterType && (
              <TextField
                label="Value"
                fullWidth
                value={typeof filterValue === 'string' ? filterValue : ''}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            )
          )}
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
