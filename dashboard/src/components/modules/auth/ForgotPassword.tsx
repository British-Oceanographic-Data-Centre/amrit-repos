'use client';

import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput,
  CircularProgress,
} from '@mui/material';
import SnackbarAlert from '@/components/shared/feedback/SnackbarAlert';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

const ForgotPassword = ({ open, handleClose }: ForgotPasswordProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.queued) {
        setSuccess(true);
        setEmail('');
      } else {
        setError('No account found with that email address.');
      }
    } catch (err) {
      setError('Failed to send reset request.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handleSubmit,
            sx: { backgroundImage: 'none' },
          },
        }}
      >
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
        >
          <DialogContentText>
            Enter your account&apos;s email address, and we&apos;ll send you a link to
            reset your password.
          </DialogContentText>
          <OutlinedInput
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            placeholder="Email address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleClose} disabled={loading}
            variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={loading || !email}
            startIcon={loading ? <CircularProgress size={18} /> : null}
          >
            Continue
          </Button>
        </DialogActions>
        {/* Snackbar for success */}
        <SnackbarAlert 
          snackBarOpen={success} 
          handleCloseSnackbar={() => setSuccess(false)} 
          message={'Password reset email sent successfully!'}
          severity="success"
        />

        {/* Snackbar for error */}
        <SnackbarAlert 
          snackBarOpen={!!error} 
          handleCloseSnackbar={() => setError(null)} 
          message={error ?? ""}
          severity="error"
        />
      </Dialog>           
    </>
  );
};

export default ForgotPassword;
