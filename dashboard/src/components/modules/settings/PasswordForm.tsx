'use client';

import * as React from 'react';
import {
  Box, Card, CardContent, CardHeader, Stack,
  Button, Divider
} from '@mui/material';
import SnackbarAlert from '@/components/shared/feedback/SnackbarAlert';
import { gatewayFetchViaProxy } from '@/lib/gateway/gatewayFetchViaProxy.client';
import { normalizeErrorMessage } from '@/lib/utils/normalizeErrorMessage';
import { strongEnough } from '@/lib/auth/passwordRules';
import PasswordField from '@/components/shared/inputs/PasswordField';

type Severity = 'success' | 'error' | 'warning' | 'info';

export default function PasswordForm() {
  const [busy, setBusy] = React.useState(false);

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMsg, setSnackMsg] = React.useState('');
  const [severity, setSeverity] = React.useState<Severity>('success');

  const openSnack = (msg: string, sev: Severity = 'success') => {
    setSnackMsg(msg);
    setSeverity(sev);
    setSnackOpen(true);
  };
  const handleCloseSnackbar = () => setSnackOpen(false);

  const resetFields = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 12)
      return openSnack('New password must be at least 12 characters', 'error');

    if (!strongEnough(newPassword))
      return openSnack('Password must include upper, lower, digit and symbol', 'error');

    if (newPassword !== confirmPassword)
      return openSnack('New password and confirmation do not match', 'error');

    setBusy(true);
    try {
      // gatewayFetchViaProxy throws on non-2xx and returns parsed JSON (or {} on 204)
      await gatewayFetchViaProxy('POST', '/oceanops/auth/change-password', {
        old: currentPassword,
        newPass: newPassword,
        confirm: confirmPassword,
      });

      resetFields();
      openSnack('Password changed', 'success');
    } catch (err: unknown) {
      openSnack(normalizeErrorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  const canSubmit =
    !busy && !!currentPassword && newPassword.length >= 12 && newPassword === confirmPassword;

  return (
    <>
      <Card variant="outlined" sx={{ maxWidth: 700, width: '100%' }}>
        <CardHeader title="Password" subheader="Change your password" />
        <CardContent sx={{ width: '100%' }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Stack spacing={2} sx={{ width: '100%' }}>
              <PasswordField
                label="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                show={showCurrent}
                setShow={setShowCurrent}
                disabled={busy}
                autoComplete="current-password"
              />

              <Divider />

              <PasswordField
                label="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                show={showNew}
                setShow={setShowNew}
                disabled={busy}
                autoComplete="new-password"
                helperText="At least 12 characters, with lowercase, uppercase, a number and a special character"
              />

              <PasswordField
                label="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                show={showConfirm}
                setShow={setShowConfirm}
                disabled={busy}
                autoComplete="new-password"
              />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button type="submit" variant="contained" disabled={!canSubmit}>
                  Change password
                </Button>
                <Button type="button" variant="outlined" disabled={busy} onClick={resetFields}>
                  Clear
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <SnackbarAlert
        snackBarOpen={snackOpen}
        handleCloseSnackbar={handleCloseSnackbar}
        message={snackMsg}
        severity={severity}
      />
    </>
  );
}
