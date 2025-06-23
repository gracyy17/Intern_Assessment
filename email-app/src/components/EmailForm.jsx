import React, { useState, useContext } from 'react';
import { TextField, Button, Stack, CircularProgress, Paper } from '@mui/material';
import { SnackbarContext } from './SnackbarProvider';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css'; 

const API_URL = 'http://192.168.0.105:5001';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function EmailForm() {
  const { showSnackbar } = useContext(SnackbarContext);
  const [to, setTo] = useState('');
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(to)) {
      showSnackbar('Invalid email format', 'error');
      return;
    }

    if (!html || html === '<p><br></p>') {
      showSnackbar('Message body required', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message: html }),
      });

      const data = await res.json();
      if (res.ok) {
        showSnackbar(data.message || 'Email sent!');
        setTo('');
        setHtml('');
      } else {
        showSnackbar(data.error || 'Send failed', 'error');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showSnackbar('Server unreachable', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        maxWidth: 600,
        mx: 'auto',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0px -8px 24px rgba(0, 0, 0, 0.15), 0px 8px 16px rgba(0, 0, 0, 0.08)',
      }}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField
            label="Recipient Email"
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            fullWidth
            required
            autoComplete="off"
          />

          <ReactQuill
            theme="snow"
            value={html}
            onChange={setHtml}
            placeholder="Write your email here..."
            style={{
              height: '200px',
              backgroundColor: '#fff',
              marginBottom: '3rem' 
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} /> : null}
            sx={{
             
              backgroundColor: '#ef0707',
              '&:hover': {
                backgroundColor: '#d40606',
              },
              color: '#fff',
            }}
          >
            {loading ? 'Sending…' : 'Send Email'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
