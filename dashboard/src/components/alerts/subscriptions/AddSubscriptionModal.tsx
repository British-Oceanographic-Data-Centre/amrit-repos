'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  Switch,
  Stack,
} from '@mui/material';
import React, { useState } from 'react';
import TopicSelectField from './TopicSelectField';
import { AlertSubscription } from '@/types/alert-subscription';

interface AddSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (newSubscription: AlertSubscription) => void; 
  contactId: number;
}

const AddSubscriptionModal = ({ open, onClose, onConfirm, contactId }: AddSubscriptionModalProps) => {
  const [topicId, setTopicId] = useState<number | null>(null);
  const [sendEmail, setSendEmail] = useState<boolean>(false);

  const handleSubmit = async () => {
	if (!topicId) return;
  
	const payload = {
	  topicId,
	  sendEmail,
	  contactId,
	};
  
	try {
	  const res = await fetch('/api/post-subscription', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	  });
  
	  if (!res.ok) throw new Error('Failed to create subscription');
  
	  const created = await res.json();
	  onConfirm(created);
	  onClose();
	} catch (err) {
	  console.error(err);
	  alert('Failed to add subscription.');
	}
  };
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add a New Subscription</DialogTitle>

      <DialogContent>
        <Stack spacing={3} mt={1}>
		<FormControl fullWidth required>
			<TopicSelectField value={topicId} onChange={setTopicId} size="medium" />
		</FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
              />
            }
            label="Receive Emails"
          />

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!topicId}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSubscriptionModal;
