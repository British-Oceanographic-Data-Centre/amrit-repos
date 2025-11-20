"use client";

import React, { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import UndoIcon from "@mui/icons-material/Undo";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import SnackbarAlert from "@/components/shared/feedback/SnackbarAlert";
import SubmitTextModal from "@/components/shared/modals/SubmitTextModal";
import ConfirmationDialogModal from "@/components/shared/modals/ConfirmationDialogModal";
import { useAlertActions } from "@/hooks/useAlertActions";

type Props = {
  alertId: string;
  isUserLogin: boolean;
  userRoles: string[];
  onActionDone?: () => void;
};

export default function AlertDetailActionsBar({
  alertId,
  isUserLogin,
  userRoles,
  onActionDone,
}: Props) {
  const router = useRouter();

  const {
    loading,
    handleActOnAlerts,
    resultsMessage,
    severity,
    clearResultMessage,
  } = useAlertActions([alertId], onActionDone ?? (() => {}));

  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const isEditor = isUserLogin && userRoles.includes("alert_editor");
  const disabled = loading || !isEditor;

  const globalMsg = !isUserLogin
    ? "You must be logged in to perform actions"
    : !userRoles.includes("alert_editor")
    ? "You don't have permission to perform actions"
    : "";

  const handleAfterSnackbarClose = () => {
    clearResultMessage();
  };

  const verticalButtonSx = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    py: 1,
    textTransform: "none",
    "& .MuiButton-startIcon": { m: 0, mb: 0.5 },
    "& .MuiSvgIcon-root": { fontSize: "1.5rem" },
  } as const;

  return (
    <>
      {/* Single sticky bar with left back + centered actions */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: (t) => t.zIndex.appBar,
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          px: 2,
          py: 2,
          minHeight: 56,
          display: "flex",
          alignItems: "center",
          positionAnchor: "inherit",
        }}
      >
        {/* Left: Back to list (do NOT disable) */}
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Button
            onClick={() => router.push("/alerts/alerts-table")}
            startIcon={<ArrowBackIcon />}
            variant="text"
              sx={verticalButtonSx}
          >
            Back to Alerts
          </Button>
        </Box>

        {/* Center: actions, absolutely centered regardless of left width */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
            width: "100%", // allow wrapping on small screens
            maxWidth: 900,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
          >
            <Button
              sx={verticalButtonSx}
              startIcon={<CheckIcon />}
              variant="text"
              disabled={disabled}
              onClick={() => handleActOnAlerts("ack")}
            >
              Acknowledge
            </Button>
            <Button
              sx={verticalButtonSx}
              startIcon={<UndoIcon />}
              variant="text"
              disabled={disabled}
              onClick={() => handleActOnAlerts("unack")}
            >
              Unacknowledge
            </Button>
            <Button
              sx={verticalButtonSx}
              startIcon={<NoteAddIcon />}
              variant="text"
              disabled={disabled}
              onClick={() => setAddNoteOpen(true)}
            >
              Add note
            </Button>
            <Button
              sx={verticalButtonSx}
              startIcon={<LockOpenIcon />}
              variant="text"
              disabled={disabled}
              onClick={() => handleActOnAlerts("open")}
            >
              Open
            </Button>
            <Button
              sx={verticalButtonSx}
              startIcon={<CloseIcon />}
              variant="text"
              disabled={disabled}
              onClick={() => handleActOnAlerts("close")}
            >
              Close
            </Button>
            <Button
              sx={verticalButtonSx}
              startIcon={<DeleteIcon />}
              variant="text"
              color="error"
              disabled={disabled}
              onClick={() => setConfirmDeleteOpen(true)}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Snackbars */}
      <SnackbarAlert
        snackBarOpen={!!resultsMessage}
        handleCloseSnackbar={handleAfterSnackbarClose}
        message={resultsMessage ?? ""}
        severity={severity}
      />
      {!!globalMsg && (
        <SnackbarAlert
          snackBarOpen={!isEditor}
          handleCloseSnackbar={() => {}}
          message={globalMsg}
          severity="warning"
          action={
            !isUserLogin ? (
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Modals */}
      <SubmitTextModal
        title="Add a note on 1 alert"
        open={addNoteOpen}
        onClose={() => setAddNoteOpen(false)}
        onConfirm={async (textNote) => {
          await handleActOnAlerts("note", textNote);
          setAddNoteOpen(false);
        }}
        pending={loading}
      />

      <ConfirmationDialogModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={async () => {
          await handleActOnAlerts("delete");
          setConfirmDeleteOpen(false);
          router.push("/alerts/alerts-table");
        }}
        pending={loading}
      >
        Are you sure you want to delete this alert?
      </ConfirmationDialogModal>
    </>
  );
}
