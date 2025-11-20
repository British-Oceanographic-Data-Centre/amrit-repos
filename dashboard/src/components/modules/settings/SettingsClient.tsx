'use client';

import * as React from 'react';
import {
  Box, Snackbar, Alert, CircularProgress
} from '@mui/material';
import type { Me } from '@/types/me';
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';
import { gatewayFetchViaProxy } from "@/lib/gateway/gatewayFetchViaProxy.client";
import SettingsTabs from './SettingsTabs';
import SnackbarAlert from '@/components/shared/feedback/SnackbarAlert';

function TabPanel(props: { children?: React.ReactNode; value: number; index: number; }) {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index} aria-labelledby={`settings-tab-${index}`}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function SettingsClient() {
  const [tab] = React.useState(0);
  const [me, setMe] = React.useState<Me | null>(null);
  const [loadingMe, setLoadingMe] = React.useState(true);

  const [snack, setSnack] = React.useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false, msg: '', sev: 'success',
  });
  const openSnack = (msg: string, sev: 'success' | 'error' = 'success') =>
    setSnack({ open: true, msg, sev });

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await gatewayFetchViaProxy<Me>('GET', '/oceanops/auth/me');
        if (!alive) return;
        setMe(data ?? {});
      } catch {
        // ignore; show empty but interactive UI
      } finally {
        if (alive) setLoadingMe(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
      <><SettingsTabs />
    <Box sx={{ p: 2, maxWidth: 920, mx: 'auto' }}>

        <TabPanel value={tab} index={0}>
          {loadingMe ? (
            <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <ProfileForm
              me={me}
              loading={loadingMe}
              onUpdated={(u) => setMe((prev) => ({ ...(prev ?? {}), ...u }))}
              openSnack={openSnack} />
          )}
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <PasswordForm />
        </TabPanel>
        
        <SnackbarAlert 
          snackBarOpen={snack.open} 
          handleCloseSnackbar={() => setSnack((s) => ({ ...s, open: false }))} 
          message={snack.msg}
          severity={snack.sev} />
        
      </Box></>
  );
}
