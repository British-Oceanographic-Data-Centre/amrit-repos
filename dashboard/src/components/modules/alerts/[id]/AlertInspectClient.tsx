'use client';

import { Box } from '@mui/material';
import AlertDetails from '@/components/modules/alerts/AlertDetails';
import AlertDetailActionsBar from '@/components/modules/alerts/AlertDetailActionsBar';
import type { Session } from '@/types/types';
import React from 'react';

export default function AlertInspectClient({
  id,
  session,
}: {
  id: string;
  qs: string;
  session: Session | null;
}) {
    const [refreshTick, setRefreshTick] = React.useState(0);
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
     
      <AlertDetailActionsBar
        alertId={id}
        isUserLogin={!!session?.isAuth}
        userRoles={session?.roles ?? []}
        onActionDone={() => setRefreshTick((n) => n + 1)}
      />

      <AlertDetails key={`${id}:${refreshTick}`} id={id} layout="page" />
    </Box>
  );
}