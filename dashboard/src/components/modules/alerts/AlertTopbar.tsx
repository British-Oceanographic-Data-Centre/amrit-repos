'use client';
import { Alert, AlertFilters } from '@/types/alert';
import { AppBar, IconButton, Toolbar, Tooltip, useTheme } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs';
import React from 'react'
import MultiSelectChip from '../../shared/inputs/MultiSelectChip';
import FilterListIcon from '@mui/icons-material/FilterList';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { firstLetterToUppercase } from '@/lib/utils/stringUtils';

interface AlertTopBarProps {
    filtersValues: Partial<Record<AlertFilters, string | string[]>>
    filtersSelectedValues:  Partial<Record<AlertFilters, string | string[]>>
    filtersToDisplayList: AlertFilters[]
    setfiltersToDisplayList: React.Dispatch<React.SetStateAction<AlertFilters[]>>
    onFilterChange: (filterKey: string, values: string[] |string) => void
    isUserLogin : boolean
}

const AlertTopbar = ({filtersValues, onFilterChange, filtersSelectedValues, isUserLogin, filtersToDisplayList, setfiltersToDisplayList }: AlertTopBarProps) => {

    const theme = useTheme();

    return (

        <AppBar
            position="static"
            square={false}
            elevation={1}            
            sx={{
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,           
            }}
            >
        <Toolbar
            sx={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            padding: '12px',
            margin: 0,
            gap: 2,            
            }}           
        >
            <Tooltip title="Filter list">
                <IconButton>
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
            {filtersToDisplayList.map((filter)=> {
                switch(filter) {
                    case 'severity':
                    case 'status' :
                        if (filtersValues[filter])
                            return <MultiSelectChip key={filter} datalist={Array.isArray(filtersValues[filter]) ? filtersValues[filter] : []} filterName={filter} selectedItems={Array.isArray(filtersSelectedValues[filter]) ? filtersSelectedValues[filter] : []} onFilterChange={onFilterChange}  />
                    case "from-date":
                    case "to-date" :                        
                        return <DateTimePicker key={filter}
                            label={firstLetterToUppercase(filter.replace("-date", ""))}
                            format="YYYY-MM-DD HH:mm:ss"
                            value={dayjs((typeof filtersSelectedValues[filter] === 'string') ?  filtersSelectedValues[filter] : "")}
                            onChange={(value) => onFilterChange(filter, value.toISOString())}
                        />
                    }
            })}

            {isUserLogin &&
                <FormControlLabel control={<Checkbox  />} label="View only my subscriptions" />
            }

            </Toolbar>

            
            </AppBar>
    )
}


export default AlertTopbar