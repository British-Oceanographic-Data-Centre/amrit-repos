'use client';
import { Alert } from '@/types/alert';
import { AppBar, IconButton, Toolbar, Tooltip, useTheme } from '@mui/material'
import React from 'react'
import MultiSelectChip from '../ui/MultiSelectChip';
import FilterListIcon from '@mui/icons-material/FilterList';

interface AlertTopBarProps {
    filtersData: Partial<Record<keyof Alert, string[]>>
    selectedFilters:  Partial<Record<keyof Alert, string[]>>
    onFilterChange: (filterKey: string, values: string[]) => void
}

const AlertTopbar = ({filtersData, onFilterChange, selectedFilters }: AlertTopBarProps) => {

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
            {Object.entries(filtersData).map(([key, valuesList])=><MultiSelectChip key={key} datalist={valuesList} filterName={key} selectedItems={selectedFilters[key as keyof Alert] ?? []} onFilterChange={onFilterChange}  /> )}

            </Toolbar>

            
            </AppBar>
    )
}

export default AlertTopbar