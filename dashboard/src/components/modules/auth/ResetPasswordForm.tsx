'use client';

import * as React from 'react';
import {
  Box, Card, CardContent, CardHeader, Stack,
  Button, Divider, 
} from '@mui/material';
import SnackbarAlert from '@/components/shared/feedback/SnackbarAlert';
import { gatewayFetchViaProxy } from '@/lib/gateway/gatewayFetchViaProxy.client';
import { normalizeErrorMessage } from '@/lib/utils/normalizeErrorMessage';
import { strongEnough } from '@/lib/auth/passwordRules';
import PasswordField from '@/components/shared/inputs/PasswordField';

type Severity = 'success' | 'error' | 'warning' | 'info';

export default function ResetPasswordCard({ token }: { token: string }) {
  const [busy, setBusy] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

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
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return openSnack('Missing or invalid reset link', 'error');
    if (newPassword.length < 12)
      return openSnack('New password must be at least 12 characters', 'error');
    if (!strongEnough(newPassword))
      return openSnack('Password must include upper, lower, digit and symbol', 'error');
    if (newPassword !== confirmPassword)
      return openSnack('New password and confirmation do not match', 'error');

    setBusy(true);
    try {
      // Gateway → POST /password-reset/confirm  { token, newPassword }
      type ResetResponse = { ok?: boolean; error?: string };
      const res = (await gatewayFetchViaProxy(
        'POST',
        '/password-reset/confirm',
        { token, newPassword }
      )) as ResetResponse;

      // your Nest service returns { ok: true } on success
      if (res?.ok) {
        resetFields();
        openSnack('Password updated. You can now sign in.', 'success');
      } else {
        openSnack(res?.error ?? 'Reset failed', 'error');
      }
    } catch (err: unknown) {
      openSnack(normalizeErrorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  const canSubmit =
    !busy && !!token && newPassword.length >= 12 &&
    newPassword === confirmPassword && strongEnough(newPassword);

    return (
    <>
      <Card variant="outlined" sx={{ maxWidth: 700, width: '100%', mx: 'auto', mt: 6 }}>
        <CardHeader title="Reset password" subheader="Set a new password for your account" />
        <CardContent sx={{ width: '100%' }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Stack spacing={2} sx={{ width: '100%' }}>
              {!token && (
                <Box sx={{ color: 'error.main', fontSize: 14 }}>
                  This link is invalid or missing a token. Please open the link from your email.
                </Box>
              )}

              <PasswordField
                label="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                show={showNew}
                setShow={setShowNew}
                disabled={busy}
                autoComplete="new-password"
                helperText="At least 12 chars, with lowercase, uppercase, a number and a special character"
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

              <Divider />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button type="submit" variant="contained" disabled={!canSubmit}>
                  Update password
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
