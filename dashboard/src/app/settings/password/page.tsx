
import * as React from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import SettingsTabs from '@/components/modules/settings/SettingsTabs';
import PasswordForm from '@/components/modules/settings/PasswordForm';

export default function PasswordPage() {

  return (
      <><SettingsTabs />
      <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                p: { xs: 2, sm: 3, md: 4 },
                backgroundColor: 'background.default',
              }}>
      <PasswordForm />
    </Box></>
  );
}
