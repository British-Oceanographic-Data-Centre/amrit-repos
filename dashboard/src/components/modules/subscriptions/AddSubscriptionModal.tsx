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
import FetchedTopicSelectField from './FetchedTopicSelectField';
import { AlertSubscription } from '@/types/alert-subscription';
import { postSubscription } from '@/lib/alertSubscriptions/postSubscription.client';

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
		const created = await postSubscription(payload); // already returns parsed JSON
		onConfirm(created);
		onClose();
	} catch {
		alert('Failed to add subscription.');
	}
	};
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add a New Subscription</DialogTitle>

      <DialogContent>
        <Stack spacing={3} mt={1}>
		<FormControl fullWidth required>
			<FetchedTopicSelectField value={topicId} onChange={setTopicId} size="medium" />
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
