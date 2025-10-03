import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Person, Edit, Check, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGetMe, usePostMe, usePostLogout } from '../hooks';

export default function MePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: userData, loading, error, refetch } = useGetMe();

  const { mutate: updateProfile, loading: updating } = usePostMe({
    onSuccess: () => {
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      refetch();
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (err) => {
      setErrorMessage(err.message || 'Failed to update profile');
      setTimeout(() => setErrorMessage(''), 3000);
    },
  });

  const { mutate: logout, loading: loggingOut } = usePostLogout({
    onSuccess: () => {
      navigate('/auth');
    },
    onError: (err) => {
      setErrorMessage(err.message || 'Failed to logout');
    },
  });

  useEffect(() => {
    if (userData?.data) {
      const user = (userData.data as any).user?.[0] || (userData.data as any);
      setName(user.name || '');
      setEmail(user.email || '');
      setAddress(user.address || '');
    }
  }, [userData]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load profile. Please try logging in again.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/auth')}>
          Go to Login
        </Button>
      </Container>
    );
  }

  const user = (userData?.data as any)?.user?.[0] || (userData?.data as any);

  const handleSave = () => {
    updateProfile({
      body: {
        name,
        email,
        address,
      },
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(user.name || '');
    setEmail(user.email || '');
    setAddress(user.address || '');
  };

  const handleLogout = () => {
    logout({});
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <Person sx={{ fontSize: 60, color: 'white' }} />
          </Box>
          <Typography variant="h2" sx={{ mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
            {user.name || 'User Profile'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user.role && (
              <Box
                component="span"
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: user.role === 'admin' ? 'secondary.light' : 'background.paper',
                  color: user.role === 'admin' ? 'white' : 'text.primary',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {user.role}
              </Box>
            )}
          </Typography>
        </Box>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        <Card sx={{ p: 4, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Profile Information
            </Typography>
            {!isEditing ? (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Check />}
                  onClick={handleSave}
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              variant={isEditing ? 'outlined' : 'filled'}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              variant={isEditing ? 'outlined' : 'filled'}
            />
            <TextField
              fullWidth
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!isEditing}
              variant={isEditing ? 'outlined' : 'filled'}
              multiline
              rows={2}
            />
          </Box>

          {user.created_at && (
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <Typography variant="body2" color="text.secondary">
                Member since {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          )}
        </Card>

        <Card sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Account Actions
          </Typography>
          
          <Button
            variant="outlined"
            color="error"
            size="large"
            startIcon={<Logout />}
            onClick={handleLogout}
            disabled={loggingOut}
            fullWidth
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </Card>
      </Container>
    </Box>
  );
}

