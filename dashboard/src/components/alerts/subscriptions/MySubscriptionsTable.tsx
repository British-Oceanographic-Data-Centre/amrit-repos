'use client';

import { useEffect, useState } from 'react';
import EditableTable from '../../editableTable/EditableTable';
import { AlertSubscription } from '@/types/alert-subscription';
import { subscriptionsTableConfig } from '@/config/tableConfigs/subscriptionsTableConfig';
import AddFilterModal from './AddFilterModal';
import { FilterValue } from './AddFilterModal';

interface Props {
  data: AlertSubscription[];
  loading: boolean;
  onDelete: (id: string) => void;
}

type AlertSubscriptionRow = Omit<AlertSubscription, 'id'> & { id: string };


const MySubscriptionsTable = ({ data, loading, onDelete  }: Props) => {
  const [openAddFilterForId, setOpenAddFilterForId] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleConfirmAddFilter = (filterType: string, value: FilterValue) => {
	if (!openAddFilterForId) return;
  
	// 👇 Implement real update logic here
	//console.log(`Add filter "${filterType}" with value:`, value, 'to row:', openAddFilterForId);
  
	// Close modal
	setOpenAddFilterForId(null);
  };
  
  const [subscriptions, setSubscriptions] = useState<AlertSubscriptionRow[]>([]);

	useEffect(() => {
		setSubscriptions(data.map((s) => ({ ...s, id: String(s.id) })));
	}, [data]);


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleToggleSwitch = (id: string, field: keyof AlertSubscriptionRow, newValue: boolean) => {
	//console.log('Toggle:', { id, field, newValue });
  
	// TODO: Update local state and/or make API call
  };
  
  return (
	<>
    <EditableTable<AlertSubscriptionRow> 
		loading={loading}
		data={subscriptions}
		totalCount={subscriptions.length}
		columnsConfiguration={subscriptionsTableConfig}
		onDeleteRow={onDelete}
		onToggleSwitch={handleToggleSwitch}
		onOpenAddFilter={setOpenAddFilterForId}
    />
	<AddFilterModal
		open={!!openAddFilterForId}
		onClose={() => setOpenAddFilterForId(null)}
		onConfirm={handleConfirmAddFilter}
	/>
	</>
  );
};

export default MySubscriptionsTable;
