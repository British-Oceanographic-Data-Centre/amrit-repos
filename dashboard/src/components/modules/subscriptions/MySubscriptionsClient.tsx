'use client';

import {  Box, Button } from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import AddSubscriptionModal from './AddSubscriptionModal';
import MySubscriptionsTable from './MySubscriptionsTable';
import { AlertSubscription } from '@/types/alert-subscription';
import SnackbarAlert from '@/components/shared/feedback/SnackbarAlert';
import { gatewayFetchViaProxy } from '@/lib/gateway/gatewayFetchViaProxy.client';

const MySubscriptionsClient = ({
	initialData,
	contactId,
  }: {
	initialData: AlertSubscription[];
	contactId: number;
  }) => {
  const [subscriptions, setSubscriptions] = useState(initialData);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState<{
	message: string;
	severity: 'success' | 'error' | 'info' | 'warning';
	open: boolean;
  }>({
	message: '',
	severity: 'success',
	open: false,
  });

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
	setNotification({ message, severity, open: true });
  };

	const fetchSubscriptions = async () => {
	try {
		setLoading(true);
		const data: AlertSubscription[] = await gatewayFetchViaProxy<AlertSubscription[]>(
			'GET',
			'/oceanops/alerts/subscriptions'
		);
		setSubscriptions(data);
	} catch {
	
	} finally {
		setLoading(false);
	}
	};

  const handleConfirm = async () => {
	showNotification('Subscription added successfully!', 'success');
    await fetchSubscriptions();
    setAddModalOpen(false);
  };
  
	const handleDelete = async (id: string) => {
		try {
		  await gatewayFetchViaProxy('DELETE', `/oceanops/alerts/subscriptions/${id}`);
		  
		  showNotification('Subscription deleted successfully', 'success');
		  await fetchSubscriptions();
		} catch  {		
		  showNotification('Failed to delete subscription', 'error');
		}
	  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddModalOpen(true)}
        >
          Add Subscription
        </Button>
      </Box>

      <MySubscriptionsTable data={subscriptions} loading={loading} onDelete={handleDelete}/>

      <AddSubscriptionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={handleConfirm}
		contactId={contactId}
      />

		<SnackbarAlert 
			snackBarOpen={notification.open}
			handleCloseSnackbar={ () => setNotification(prev => ({ ...prev, open: false }))}
			message={notification.message}
			severity={notification.severity}
		/>		
    </Box>
  );
};

export default MySubscriptionsClient;
