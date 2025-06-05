import { IconButton,  Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react'
import SnackbarAlert from '../../shared/feedback/SnackbarAlert';
import SubmitTextModal from '../../shared/modals/SubmitTextModal';
import { useAlertActions } from '@/hooks/useAlertActions';
import ConfirmationDialogModal from '@/components/shared/modals/ConfirmationDialogModal';
import LockOpenIcon from '@mui/icons-material/LockOpen';

type AlertsTableToolbarActionsProps = {
    selected :  readonly string[]
    onActionDone : () => void
}
const AlertsTableToolbarActions = ({selected, onActionDone} : AlertsTableToolbarActionsProps) => {
    
    // state for Add a note modal :
    const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);
    // state for confirmation dialog on delete :
    const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false)

    // use a custom hook useAlertsAction which can be reuse in other components
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

        <Tooltip title="Open">
            <IconButton onClick={() => handleActOnAlerts("open")} disabled={loading} aria-label="open alert">
                <LockOpenIcon />
            </IconButton>
        </Tooltip>

        <Tooltip title="Close">
            <IconButton onClick={() => handleActOnAlerts("close")} disabled={loading} aria-label="close alert">
                <CloseIcon />
            </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
            <IconButton onClick={() => setDeleteConfirmationDialogOpen(true)} disabled={loading} aria-label="delete alert">
                <DeleteIcon />
            </IconButton>
        </Tooltip>

        {/* MODALS */}

        <SubmitTextModal title={`Add a note on ${selected.length} alert${selected.length > 1 ? 's':''}`} open={addNoteModalOpen} onClose={() => setAddNoteModalOpen(false)} 
        onConfirm={async (textNote) => {
            await handleActOnAlerts("note", textNote);
            setAddNoteModalOpen(false);
            }} 
        pending={loading} />

        <ConfirmationDialogModal open={deleteConfirmationDialogOpen} onClose={() => setDeleteConfirmationDialogOpen(false)} onConfirm={async () => {await handleActOnAlerts("delete"); setDeleteConfirmationDialogOpen(false)} } pending={loading}>        
            {`Are you sure you want to delete ${selected.length} alert${selected.length>1 ? 's' :''} ? `}            
        </ConfirmationDialogModal>

   </>
  )
}

export default AlertsTableToolbarActions