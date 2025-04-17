import getAlerts from '@/lib/alerta/fetchAlerts.client';
import { Alert, AlertApiResponse } from '@/types/alert'
import { Order } from '@/types/types';
import React, { useEffect, useState } from 'react'
import EnhancedTable from '../enhancedTable/EnhancedTable';
import AlertsTableToolbarActions from './AlertsTableToolbarActions';
import { ALERTS_TABLE_CONFIG } from '@/config/tableConfigs';

interface AlertsTableProps {
   selectedFilters: Partial<Record<keyof Alert, string[]>>
}

const AlertsTable = ({selectedFilters}: AlertsTableProps) => {

  // load table configuration
  const alertaColumnsConfig = ALERTS_TABLE_CONFIG;

  //Table's states
  const [alertsApiResponseData, setAlertsApiResponseData] = useState<AlertApiResponse>();
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof Alert>('lastReceiveTime');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // fetch alerts data
  useEffect(() => {   
    let isLatestRequest = true; 
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchAlertData() {
      setLoading(true);
      try {
        const alertsData = await getAlerts(selectedFilters,page+1, rowsPerPage, [order==='desc' ? orderBy : "-"+orderBy], signal);
        if (isLatestRequest) { 
          setAlertsApiResponseData(alertsData);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('An error occurred while fetching alerts.');
        }        
      } finally {
        if (isLatestRequest) { 
          setLoading(false);
        }
      }
    }

    fetchAlertData();
    
    return () => {
      isLatestRequest = false; 
      controller.abort();
    };    
  }, [page, rowsPerPage, orderBy, order, selectedFilters, refreshKey])

  // TO DO : may be use a more general way using the MQTT broker : when there is a new alet, trigger the refresh
  const triggerRefetch = () => {
    setRefreshKey(prev => prev + 1);
  };

  
  return (
    <EnhancedTable<Alert> selected={selected} setSelected={setSelected} orderBy={orderBy} setOrderBy={setOrderBy} order={order} setOrder={setOrder} page={page} setPage={setPage} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} loading={loading} data={alertsApiResponseData?.alerts ?? []} totalCount={alertsApiResponseData?.total ?? 0} toolbarActions={<AlertsTableToolbarActions selected={selected} onActionDone ={triggerRefetch}/>} colmunsConfiguration={alertaColumnsConfig}/>
  )
}

export default AlertsTable