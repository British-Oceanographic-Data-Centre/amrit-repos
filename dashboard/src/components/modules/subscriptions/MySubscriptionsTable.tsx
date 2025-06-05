'use client';

import { useEffect, useState } from 'react';
import EditableTable from '../../shared/tables/editableTable/EditableTable';
import { AlertSubscription } from '@/types/alert-subscription';
import { subscriptionsTableConfig } from '@/config/tableConfigs/subscriptionsTableConfig';
import AddFilterModal from './AddFilterModal';
import { FilterValue } from './AddFilterModal';
import { gatewayFetchViaProxy } from '@/lib/gateway/gatewayFetchViaProxy.client';
import { CountryOption } from '@/types/types';
import dayjs from 'dayjs';

interface Props {
  data: AlertSubscription[];
  loading: boolean;
  onDelete: (id: string) => void;
}

type AlertSubscriptionRow = Omit<AlertSubscription, 'id'> & { id: string };

const MySubscriptionsTable = ({ data, loading, onDelete }: Props) => {
	const [openAddFilterForId, setOpenAddFilterForId] = useState<string | null>(null);
	const [subscriptions, setSubscriptions] = useState<AlertSubscriptionRow[]>([]);

	useEffect(() => {
		setSubscriptions(data.map((s) => ({ ...s, id: String(s.id) })));
	}, [data]);

	const handleToggleSwitch = async (
		id: string,
		field: keyof AlertSubscriptionRow,
		newValue: boolean
	) => {
		try {
		const updatedRow = await gatewayFetchViaProxy<Partial<AlertSubscriptionRow>>(
			'PATCH',
			`/oceanops/alerts/subscriptions/${id}`,
			{ [field]: newValue }
		);

		setSubscriptions((prev) =>
			prev.map((row) => (row.id === id ? { ...row, ...updatedRow } : row))
		);
		} catch {
		
		}
	};

	const handleUpdateField = async (
		id: string,
		field: keyof AlertSubscriptionRow,
		newValue: string | number | boolean | null
	) => {
		try {
		const updatedRow = await gatewayFetchViaProxy<Partial<AlertSubscriptionRow>>(
			'PATCH',
			`/oceanops/alerts/subscriptions/${id}`,
			{ [field]: newValue }
		);

		setSubscriptions((prev) =>
			prev.map((row) => (row.id === id ? { ...row, ...updatedRow } : row))
		);
		} catch {
		
		}
	};

	const handleConfirmAddFilter = async (filterType: string, value: FilterValue) => {
		if (!openAddFilterForId) return;

		function isCountryOption(val: unknown): val is CountryOption {
			return val !== null && typeof val === 'object' && 'id' in val;
		}

		let body: Record<string, string | number | boolean | null | undefined> = {};

		if (filterType === 'countryName' && isCountryOption(value)) {
			body = { countryId: value.id ?? null };
		} else if (filterType === 'timeRange' && typeof value === 'object') {
			const { minTime, maxTime } = value as { minTime?: string; maxTime?: string };
			if (minTime) body.minTime = dayjs(minTime).utc().format('YYYY-MM-DDTHH:mm:ss');
			if (maxTime) body.maxTime = dayjs(maxTime).utc().format('YYYY-MM-DDTHH:mm:ss');
		} else  if (
				typeof value === 'string' ||
				typeof value === 'number' ||
				typeof value === 'boolean' ||
				value === null ||
				typeof value === 'undefined'
			) {
				body[filterType] = value;
		} else {
			
		}

		try {
			const updatedRow = await gatewayFetchViaProxy<Partial<AlertSubscriptionRow>>(
			'PATCH',
			`/oceanops/alerts/subscriptions/${openAddFilterForId}`,
			body
			);

			setSubscriptions((prev) =>
			prev.map((row) => (row.id === openAddFilterForId ? { ...row, ...updatedRow } : row))
			);
		} catch {
			
		}

		setOpenAddFilterForId(null);
	};



  return (
    <>
      <EditableTable<AlertSubscriptionRow>
        loading={loading}
        data={subscriptions}
        totalCount={subscriptions.length}
        columnsConfiguration={subscriptionsTableConfig}
        onDeleteRow={onDelete}
        onToggleSwitch={handleToggleSwitch} // 🔁 Only for toggling booleans
        onOpenAddFilter={setOpenAddFilterForId}
		onUpdateField={handleUpdateField}
      />
      <AddFilterModal
        open={!!openAddFilterForId}
        onClose={() => setOpenAddFilterForId(null)}
        onConfirm={handleConfirmAddFilter} // 🧩 Custom filter confirmation
      />
    </>
  );
};

export default MySubscriptionsTable;
