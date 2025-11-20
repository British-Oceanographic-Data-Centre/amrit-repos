'use client'
import { Box } from '@mui/material'
import React, { useState, useEffect, useRef } from 'react'
import AlertTopbar from './AlertTopbar'
import AlertsTable from './AlertsTable'
import { AlertFilters } from '@/constants/alertOptions'
import { FiltersValuesMap } from '@/types/filters'
import { Session } from '@/types/types'
import { useAppStore } from '@/store/useAppStore'
import { useShallow } from 'zustand/react/shallow';



interface AlertsClientWrapperProps {
    filtersValues: FiltersValuesMap
    session: Session | null
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


const AlertsClientWrapper = ({filtersValues, session}: AlertsClientWrapperProps) => {

    // Get state with useShallow - Zustand will only re-render if values change
    const { onlyMySubs, filtersSelectedValues } = useAppStore(
      useShallow((s) => ({
        onlyMySubs: s.alerts.onlyMySubs,
        filtersSelectedValues: s.alerts.selected,
      }))
    );

    // Get actions separately - they're stable references, no need for shallow
    const setOnlyMySubs = useAppStore((s) => s.setOnlyMySubs);
    const setFiltersSelectedValues = useAppStore((s) => s.setAlertSelected);
    const bulkSetAlertSelected = useAppStore((s) => s.bulkSetAlertSelected);

    // state for page to display
    const [page, setPage] = useState(0);

    // Use ref to track if this is the initial mount
    const isInitialMount = useRef(true);

    // Initialize status filter only once on mount by considering filtersValues (alerts count done server side on parent) and add "open" and "ack" by default if present in the count
    useEffect(() => {
      if (isInitialMount.current && filtersValues.status) {
        const initialStatusLabels = getFilterLabels(["open", "ack"], filtersValues.status);
        if (initialStatusLabels.length > 0) {
          setFiltersSelectedValues("status", initialStatusLabels);
        }
        isInitialMount.current = false;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    const handleUpdateFilter = <K extends AlertFilters>(filterKey: K, values: FiltersValuesMap[K]) => {
        // reset page number to 0 when filters change :
        setPage(0);
        const updated = { ...filtersSelectedValues };
        if (values === undefined) {
            delete updated[filterKey];
          } else {
            updated[filterKey] = values;
          }
        

        bulkSetAlertSelected(updated);
      };


  return (
    <Box sx={{height: '100%', width: '100%', padding:2, display: 'flex', flexDirection: 'column', gap: 2, overflow:'hidden' }}>

        <AlertTopbar filtersValues={filtersValues} onFilterChange={handleUpdateFilter} filtersSelectedValues={filtersSelectedValues} bulkSetAlertSelected={bulkSetAlertSelected} isUserLogin={session?.isAuth ?? false}  isOnlyMySubsAlerts={onlyMySubs} setIsOnlyMySubsAlerts={setOnlyMySubs}/>
           
        <AlertsTable filtersSelectedValues={filtersSelectedValues} session={session} isOnlyMySubsAlerts={onlyMySubs} page={page} setPage={setPage}/>

    </Box>
  )
}

export default AlertsClientWrapper