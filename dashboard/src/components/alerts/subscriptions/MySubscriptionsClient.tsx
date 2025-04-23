'use client';

import {  Box, Button } from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import AddSubscriptionModal from './AddSubscriptionModal';
import MySubscriptionsTable from './MySubscriptionsTable';
import { AlertSubscription } from '@/types/alert-subscription';
import SnackbarAlert from '@/components/ui/SnackbarAlert';


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
	  const res = await fetch('/api/get-subscriptions');
	  if (!res.ok) throw new Error('Failed to fetch subscriptions');
	  const data: AlertSubscription[] = await res.json();
	  setSubscriptions(data);
	} catch  {
	  console.error('Error fetching subscriptions.');
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
		  const res = await fetch(`/api/delete-subscription?id=${id}`, {
			method: 'DELETE',
		  });
		  if (!res.ok) throw new Error('Failed to delete subscription');
		  
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
