'use client'
import { Box } from '@mui/material'
import React, { useState } from 'react'
import AlertTopbar from './AlertTopbar'
import { AlertFilters } from '@/types/alert'
import AlertsTable from './AlertsTable'



interface AlertsClientWrapperProps {
    filtersValues: Partial<Record<AlertFilters, string[] | string>>
    isUserLogin: boolean
}

/**
 * from a list of filter items  keys (ex : ["open", "ack"] of filter 'status'), Returns full filter labels as they are in filtersDataItem list (ex: ["open (251)", "ack (5)", "close (8)"]
 * @param keys 
 * @param availableOptions 
 * @returns 
 */
function getFilterLabels(
    keys: string[],
    filtersDataItem: string[]
  ): string[] {
    return filtersDataItem.filter((label) =>
      keys.some((key) => label.startsWith(key))
    );
  }

const AlertsClientWrapper = ({filtersValues, isUserLogin}: AlertsClientWrapperProps) => {
    //state for selected filters : key : array of filters selected value
    const [filtersSelectedValues, setFiltersSelectedValues] = useState<Partial<Record<AlertFilters, string | string[]>>> (
        {
            status: getFilterLabels(["open", "ack"], Array.isArray(filtersValues.status) ? filtersValues.status : []) // initialize filters to "open" and "ack" alerts
        }
    )
    // state for the filters lsit to display :
    const [selectedFilterList, setSelectedFilterList] = useState<AlertFilters[]> ([ "severity","status","from-date", "to-date"] )

    

    const handleUpdateFilter = (filterKey: string, values: string[] | string) => {
        setFiltersSelectedValues((prev) => ({
          ...prev,
          [filterKey]: values,
        }));        
      };


  return (
    <Box sx={{ width: '100%', padding:2, display: 'flex', flexDirection: 'column', gap: 2 }}>

        <AlertTopbar filtersValues={filtersValues} onFilterChange={handleUpdateFilter} filtersSelectedValues={filtersSelectedValues} isUserLogin={isUserLogin} filtersToDisplayList={selectedFilterList} setfiltersToDisplayList={setSelectedFilterList }/>
           
        <AlertsTable filtersSelectedValues={filtersSelectedValues}/>



    </Box>
  )
}

export default AlertsClientWrapper