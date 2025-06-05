import { EditableTableViewConfig } from '@/config/tableConfigs';
import { AlertSubscription } from '@/types/alert-subscription';
import { Chip, Stack, Switch, Button } from '@mui/material';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import FetchedTopicSelectField from '@/components/modules/subscriptions/FetchedTopicSelectField';

export type AlertSubscriptionRow = Omit<AlertSubscription, 'id'> & { 
	id: string
	filters?: string;
};
  
export const subscriptionsTableConfig: EditableTableViewConfig<AlertSubscriptionRow> = {
	mainColumns: [
		{
			key: 'topicName',
			label: 'Topic',
			editable: true,
			render: (row, context) => {
  				const { onUpdateField } = context ?? {};
			  return (
				<FetchedTopicSelectField
				  value={row.topicId ?? null}
				  onChange={(newId) => onUpdateField?.(row.id, 'topicId', newId)}
				  sx={{ width: 400, ml: 2 }}
				/>
			  );
			},
		},
	   {
		key: 'filters',
		label: 'Filters',
		editable: true,
		render: (row, context) => {
		  const { onUpdateField } = context ?? {};
		  const chips: React.ReactNode[] = [];
	  
		  const removeFilter = (field: keyof AlertSubscriptionRow) => {
			onUpdateField?.(row.id, field, null);
		  };
	  
		  if (row.minSeverityId) {
			chips.push(
			  <Chip
				key="minSeverity"
				label={`Minimum Severity: ${row.minSeverityId}`}
				onDelete={() => removeFilter('minSeverityId')}
				sx={{ bgcolor: '#c8e6c9', color: 'black' }}
			  />
			);
		  }
	  
		  if (row.countryName) {
			chips.push(
			  <Chip
				key="country"
				label={`Country: ${row.countryName}`}
				onDelete={() => removeFilter('countryId')}
				sx={{ bgcolor: '#bbdefb', color: 'black' }}
			  />
			);
		  }
	  
		  if (row.basinName) {
			chips.push(
			  <Chip
				key="basin"
				label={`Basin: ${row.basinName}`}
				onDelete={() => removeFilter('basinId')}
				sx={{ bgcolor: '#f8bbd0', color: 'black' }}
			  />
			);
		  }
	  
		  if (row.wigosId) {
			chips.push(
			  <Chip
				key="wigos"
				label={`WIGOS-ID: ${row.wigosId}`}
				onDelete={() => removeFilter('wigosId')}
				sx={{ bgcolor: '#fff9c4', color: 'black' }}
			  />
			);
		  }
	  
		  if (row.minTime || row.maxTime) {
			const from = row.minTime?.slice(0, 10) ?? '...';
			const to = row.maxTime?.slice(0, 10) ?? '...';
			chips.push(
			  <Chip
				key="timeRange"
				label={`Time range: ${from} → ${to}`}
				onDelete={() => {
				  onUpdateField?.(row.id, 'minTime', null);
				  onUpdateField?.(row.id, 'maxTime', null);
				}}
				sx={{ bgcolor: '#e1bee7', color: 'black' }}
			  />
			);
		  }
	  
		  chips.push(
			<Button
			  key="add-filter"
			  size="small"
			  variant="outlined"
			  startIcon={<AddIcon />}
			  onClick={(e) => {
				e.stopPropagation();
				context?.onOpenAddFilter?.(row.id);
			  }}
			  sx={{
				textTransform: 'none',
				fontStyle: 'italic',
				borderStyle: 'dashed',
			  }}
			>
			  Add a filter
			</Button>
		  );
		  
	  
		  return <Stack direction="row" 
		  sx={{
			gap: '6px',
		  }}
		  flexWrap="wrap">{chips}</Stack>;
		},
	  },	  
	  {
		key: 'sendEmail',
		label: 'Receive Emails',
		editable: true,
		align: 'center',
		render: (row, context) => {
		  const { onToggleSwitch } = context ?? {};
		  return (
			<Switch
			  checked={!!row.sendEmail}
			  onChange={() => onToggleSwitch?.(row.id, 'sendEmail', !row.sendEmail)}
			/>
		  );
		},
	  }
	  
	  
	],
  };