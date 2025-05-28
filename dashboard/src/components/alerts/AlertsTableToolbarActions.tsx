import { IconButton,  Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react'
import SnackbarAlert from '../ui/SnackbarAlert';
import SubmitTextModal from '../SubmitTextModal';
import { useAlertActions } from '@/hooks/useAlertActions';

type AlertsTableToolbarActionsProps = {
    selected :  readonly string[]
    onActionDone : () => void
}
const AlertsTableToolbarActions = ({selected, onActionDone} : AlertsTableToolbarActionsProps) => {
    
    // state for Add a note modal :
    const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);

    // Tuse a custom hook useAlertsAction which can be reuse in other components
    const {
        loading,
        handleActOnAlerts,
        resultsMessage,
        severity,
        clearResultMessage,
    } = useAlertActions(selected, onActionDone)   
 
  return (
   <>
        <SnackbarAlert snackBarOpen={!!resultsMessage} handleCloseSnackbar={clearResultMessage } message={resultsMessage ?? ""} severity={severity}/>
        
        <Tooltip title="Acknowledge">
            <IconButton onClick={() => handleActOnAlerts("ack")} disabled={loading} aria-label="Acknowledge alert">
                <CheckIcon />
            </IconButton>
        </Tooltip>

        <Tooltip title="Unacknowledge">
            <IconButton onClick={() => handleActOnAlerts("unack")} disabled={loading} aria-label="Acknowledge alert">
                <UndoIcon />
            </IconButton>
        </Tooltip>
        
        <Tooltip title="Add a note">
            <IconButton onClick={() => setAddNoteModalOpen(true)} disabled={loading} aria-label="Add note">
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

        <SubmitTextModal title={`Add a note on ${selected.length} alert${selected.length > 1 ? 's':''}`} open={addNoteModalOpen} onClose={() => setAddNoteModalOpen(false)} 
        onConfirm={async (textNote) => {
            await handleActOnAlerts("note", textNote);
            setAddNoteModalOpen(false);
            }} 
        pending={loading} />

   </>
  )
}

export default AlertsTableToolbarActions