import { AlertColor, AlertPropsColorOverrides, IconButton,  Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react'
import SnackbarAlert from '../ui/SnackbarAlert';
import { OverridableStringUnion } from '@mui/types';
import actOnAlerts from '@/lib/alerta/actOnAlerts.client';

type AlertsTableToolbarActionsProps = {
    selected :  readonly string[]
    onActionDone : () => void
}
const AlertsTableToolbarActions = ({selected, onActionDone} : AlertsTableToolbarActionsProps) => {
    const [loading, setLoading] = useState(false);
    const [resultsMessage, setResultsMessage] = useState<string |null>(null)
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarSeverity, setSnackBarSeverity] = useState<OverridableStringUnion<AlertColor, AlertPropsColorOverrides>>("success")
    
    const handleAcknowledgeAlert = async (action : "ack" | "unack"): Promise<void> => {
        setLoading(true);
        try {
            const results =  await actOnAlerts(selected, action);
            if (results.success > 0 && results.failed > 0) {
                setResultsMessage(`${results.success} alert${results.success === 1 ? ' was' : 's were'} successfully ${action}nowledged but ${results.failed} ${results.failed === 1 ? 'was' : 'were'} not.`);
                setSnackBarSeverity("warning");
                setSnackBarOpen(true);
            } else if (results.success > 0) {
                setResultsMessage(`Successfully ${action}nowledged ${results.success} alert${results.success === 1 ? '' : 's'}.`);
                setSnackBarSeverity("success");
                setSnackBarOpen(true);
            } else {
                setResultsMessage(`No alert was ${action}nowledged`);
                setSnackBarSeverity("warning");
                setSnackBarOpen(true);
            }
            
        } catch  {
            setResultsMessage(`Something went wrong while ${action}nowledging alerts.`);
            setSnackBarSeverity("error");
            setSnackBarOpen(true)
        } finally {
            setLoading(false)
            onActionDone();           
        }
        
    }

    

    const handleCloseSnackbar = () => {
        setSnackBarOpen(false)
    }

  return (
   <>
        <SnackbarAlert snackBarOpen={snackBarOpen} handleCloseSnackbar={handleCloseSnackbar } message={resultsMessage ?? ""} severity={snackBarSeverity}/>
        
        <Tooltip title="Acknowledge">
            <IconButton onClick={() => handleAcknowledgeAlert("ack")} disabled={loading ? true : false}>
                <CheckIcon />
            </IconButton>
        </Tooltip>

        <Tooltip title="Unacknowledge">
            <IconButton onClick={() => handleAcknowledgeAlert("unack")} disabled={loading ? true : false}>
                <UndoIcon />
            </IconButton>
        </Tooltip>
        
        <Tooltip title="Add a note">
            <IconButton>
                <NoteAddIcon />
            </IconButton>
        </Tooltip>

        <Tooltip title="Close">
            <IconButton>
                <CloseIcon />
            </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
            <IconButton>
                <DeleteIcon />
            </IconButton>
        </Tooltip>
   </>
  )
}

export default AlertsTableToolbarActions