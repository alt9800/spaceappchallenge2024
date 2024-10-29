import React, { createContext, useCallback, useContext, useState } from "react";
import { Snackbar, Alert, SnackbarProps } from "@mui/material";

// SeverityをEnumとして定義
export enum Severity {
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  SUCCESS = "success",
}

interface CustomSnackbarProps {
  open: boolean;
  handleClose: SnackbarProps["onClose"];
  message: string;
  severity?: Severity;
  duration?: number;
  showCloseButton?: boolean;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  handleClose,
  message,
  severity = Severity.INFO,
  duration = 3000,
  showCloseButton = false,
}) => {
  const handleAlertClose = (event: React.SyntheticEvent<Element, Event>) => {
    if (handleClose) {
      handleClose(event, "clickaway");
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      aria-describedby="client-snackbar"
    >
      <Alert
        onClose={showCloseButton ? handleAlertClose : undefined}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

interface SnackbarContextType {
  showSnackbar: (message: string, severity?: Severity) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<Severity>(Severity.INFO);

  const handleClose: SnackbarProps["onClose"] = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const showSnackbar = useCallback(
    (message: string, severity: Severity = Severity.INFO) => {
      setMessage(message);
      setSeverity(severity);
      setOpen(true);
    },
    []
  );

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <CustomSnackbar
        open={open}
        handleClose={handleClose}
        message={message}
        severity={severity}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
