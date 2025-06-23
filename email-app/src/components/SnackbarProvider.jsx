// src/components/SnackbarProvider.jsx
import React, { createContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [state, setState] = useState({ open: false, msg: '', severity: 'info' });

  const showSnackbar = (msg, severity = 'success') =>
    setState({ open: true, msg, severity });


  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setState((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={3000}
        onClose={() => setState({ ...state, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={state.severity} sx={{ width: '100%' }}  onClose={handleClose} >
          {state.msg}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
