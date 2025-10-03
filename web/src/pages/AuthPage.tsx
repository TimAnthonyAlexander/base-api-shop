import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePostLogin, usePostSignup } from '../hooks';

export default function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { mutate: login, loading: loginLoading } = usePostLogin({
    onSuccess: () => {
      setSuccess('Login successful!');
      setTimeout(() => navigate('/'), 1000);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const { mutate: signup, loading: signupLoading } = usePostSignup({
    onSuccess: () => {
      setSuccess('Account created! Logging you in...');
      setTimeout(() => {
        login({ body: { email, password } });
      }, 1000);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (tab === 0) {
      login({ body: { email, password } });
    } else {
      if (!name) {
        setError('Please enter your name');
        return;
      }
      signup({ body: { name, email, password } });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #fafafa 0%, #f0f0ff 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ p: 4 }}>
          <Typography
            variant="h3"
            sx={{
              mb: 1,
              textAlign: 'center',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1a1a1a 0%, #6366f1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Shop
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, textAlign: 'center' }}
          >
            Sign in to continue shopping
          </Typography>

          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            sx={{ mb: 3 }}
            centered
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {tab === 1 && (
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
                required
              />
            )}
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              required
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loginLoading || signupLoading}
            >
              {tab === 0 ? 'Login' : 'Sign Up'}
            </Button>
          </form>
        </Card>
      </Container>
    </Box>
  );
}

