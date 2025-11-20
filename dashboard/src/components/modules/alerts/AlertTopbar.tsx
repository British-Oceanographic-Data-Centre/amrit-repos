'use client';
import { AppBar, IconButton, Toolbar, Tooltip, useTheme } from '@mui/material'
import React, {  useMemo, useState } from 'react'
import MultiSelectChip from '../../shared/inputs/MultiSelectChip';
import FilterListIcon from '@mui/icons-material/FilterList';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { firstLetterToUppercase } from '@/lib/utils/stringUtils';
import CategoryGroupedChoicesModal from '@/components/shared/modals/CategoriesGroupedCheckboxesModal/CategoriesGroupedCheckboxesModal';
import { ALERTS_FILTERS_CATEGORY } from '@/config/alertsFiltersCategories';
import { AlertFilters } from '@/constants/alertOptions';
import { FiltersValuesMap } from '@/types/filters';
import CountrySelect from '@/components/shared/inputs/CountrySelect';
import { CountryOption } from '@/types/types';
import TopicSelectField from '@/components/shared/inputs/TopicSelectField';
import { findAllChildrenTopicsFromId } from '@/lib/utils/findAllChildrenFromTopicId';
import { useAppStore } from '@/store/useAppStore';
import { useShallow } from 'zustand/react/shallow';
import dayjs from 'dayjs';


interface AlertTopBarProps {
  filtersValues: FiltersValuesMap
  filtersSelectedValues:  FiltersValuesMap
  bulkSetAlertSelected: (next: FiltersValuesMap) => void;
  onFilterChange: <K extends AlertFilters>(filterKey: K, values: FiltersValuesMap[K]) => void
  isUserLogin : boolean
  isOnlyMySubsAlerts:boolean
  setIsOnlyMySubsAlerts: (v: boolean) => void
}
const AlertTopbar = ({
  filtersValues, onFilterChange, filtersSelectedValues, isUserLogin,
  bulkSetAlertSelected,
  isOnlyMySubsAlerts, setIsOnlyMySubsAlerts
}: AlertTopBarProps) => {
  const theme = useTheme();

  // Get state with useShallow - Zustand will only re-render if values change
  const { alertsFiltersDisplayed } = useAppStore(
    useShallow((s) => ({
      alertsFiltersDisplayed: s.alerts.displayed,
    }))
  );

  // Get action separately - it's a stable reference, no need for shallow
  const setAlertsFiltersDisplayed = useAppStore((s) => s.setAlertsFiltersDisplayed);

  // local modal state
  const [isFiltersListModalOpen, setIsFiltersListModalOpen] = useState(false);

  const sortedFiltersToDisplay = useMemo(() => {
    return [...alertsFiltersDisplayed].sort(
      (a, b) => Object.values(ALERTS_FILTERS_CATEGORY).flat().indexOf(a) - Object.values(ALERTS_FILTERS_CATEGORY).flat().indexOf(b)
    );
  }, [alertsFiltersDisplayed]);

  const handleTopicSelection = (newtopicId: number | null) => {
    if (filtersValues.alert_category) {
      const topicAndChildren = findAllChildrenTopicsFromId(filtersValues.alert_category, newtopicId);
      onFilterChange('alert_category', topicAndChildren);
    }
  };

  const onFiltersListModalClose = (draftChosenElements?: AlertFilters[]) => {
    if (draftChosenElements) {
      const newFilterSelectedValues: FiltersValuesMap = { ...filtersSelectedValues };
      let filterRemoved = false;

      for (const [key] of Object.entries(newFilterSelectedValues)) {
        if (!draftChosenElements.includes(key as AlertFilters)) {
          delete newFilterSelectedValues[key as AlertFilters];
          filterRemoved = true;
        }
      }
      if (filterRemoved) {
        bulkSetAlertSelected(newFilterSelectedValues);
      }
      setAlertsFiltersDisplayed(draftChosenElements);             // persist (zustand)
    }

    setIsFiltersListModalOpen(false);
  };

  

  return (
    <AppBar position="static" square={false} elevation={1}
      sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }}>
      <Toolbar sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '12px', margin: 0, gap: 2 }}>
        <Tooltip title="Filter list">
          <IconButton onClick={() => setIsFiltersListModalOpen(true)} aria-label="show filters list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>

        {sortedFiltersToDisplay.map((filter) => {
          switch (filter) {
            case 'severity':
            case 'status':
              if (filtersValues[filter])
                return (
                  <MultiSelectChip
                    freesolo={false} // only choices from the list are authorized
                    key={filter}
                    datalist={Array.isArray(filtersValues[filter]) ? filtersValues[filter] : []}
                    filterName={filter}
                    selectedValues={Array.isArray(filtersSelectedValues[filter]) ? filtersSelectedValues[filter] : []}
                    onFilterChange={(filterKey, values) => {
                      onFilterChange(filterKey as AlertFilters, values);
                    }}
                  />
                );
              return null;
            case 'event' :
            case 'resource' :
              if (filtersValues[filter])
                return (
                  <MultiSelectChip
                    freesolo = {true} // free text are authorized because request will be a regex match (contains)
                    key={filter}
                    datalist={Array.isArray(filtersValues[filter]) ? filtersValues[filter] : []}
                    filterName={filter}
                    selectedValues={Array.isArray(filtersSelectedValues[filter]) ? filtersSelectedValues[filter] : []}
                    onFilterChange={(filterKey, values) => {
                      onFilterChange(filterKey as AlertFilters, values);
                    }}
                  />
                );
              return null;

            case 'Country':
              return (
                <CountrySelect
                  key={filter}
                  multiple
                  label="Country"
                  options={filtersValues[filter] as CountryOption[]}
                  value={Array.isArray(filtersSelectedValues[filter]) ? (filtersSelectedValues[filter] as CountryOption[]) : []}
                  onChange={(newValue) => {
                    const val = Array.isArray(newValue) ? newValue : newValue ? [newValue] : undefined;
                    onFilterChange('Country', val);
                  }}
                />
              );

            case 'from-date':
            case 'to-date':
              return (
                <DateTimePicker
                  key={filter}
                  label={firstLetterToUppercase(filter.replace('-date', ''))}
                  format="YYYY-MM-DD HH:mm:ss"
                  value={
                    typeof filtersSelectedValues[filter] === 'string'
                      ? (dayjs(filtersSelectedValues[filter] as string).isValid()
                          ? dayjs(filtersSelectedValues[filter] as string)
                          : null)
                      : null
                  }
                  onChange={(newValue) => {
                    const iso = newValue ? newValue.toDate().toISOString() : undefined;
                    onFilterChange(filter, iso);     
                  }}
                  slotProps={{ field: { clearable: true } }}
                />
              );

            case 'alert_category':
              return (
                <TopicSelectField
                  key={filter}
                  size="medium"
                  value={( filtersSelectedValues[filter] && filtersSelectedValues[filter][0]?.id) ? filtersSelectedValues[filter][0].id : null}
                  onChange={(newValue) => handleTopicSelection(newValue)}
                  topics={filtersValues.alert_category ?? []}
                  label='Alert category'
                  showClearIcon
                />
              );
          }
        })}

        {isUserLogin && (
          <FormControlLabel
            control={
              <Checkbox
                checked={isOnlyMySubsAlerts}
                onChange={() => {
                  const next = !isOnlyMySubsAlerts;
                  setIsOnlyMySubsAlerts(next);
                }}
              />
            }
            label="View only my subscriptions"
          />
        )}

        <CategoryGroupedChoicesModal<AlertFilters>
          groupedElementsByCategory={ALERTS_FILTERS_CATEGORY}
          isModalOpen={isFiltersListModalOpen}
          onClose={onFiltersListModalClose}
          chosenElementsList={alertsFiltersDisplayed}
          setChosenElementsList={setAlertsFiltersDisplayed}
        />
      </Toolbar>
    </AppBar>
  );
};

export default AlertTopbar;