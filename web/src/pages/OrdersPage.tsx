import {
  Box,
  Container,
  Typography,
  Card,
  Chip,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Receipt, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGetOrder } from '../hooks';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { data: ordersData, loading, error } = useGetOrder();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">
          Failed to load orders. Please make sure you're logged in.
        </Alert>
        <Button onClick={() => navigate('/auth')} sx={{ mt: 2 }}>
          Go to Login
        </Button>
      </Container>
    );
  }

  const orders = (ordersData?.data as any)?.orders || [];

  if (orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 12, textAlign: 'center' }}>
        <Receipt sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" sx={{ mb: 2 }}>
          No orders yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          When you place orders, they'll appear here
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/')}>
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
          Your Orders
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
          View and track your orders
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {orders.map((order: any) => (
            <Card key={order.id} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
                  gap: 3,
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Receipt sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="h6">
                      Order #{order.id?.slice(0, 8)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    {order.items?.map((item: any, index: number) => (
                      <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                        {item.product?.title || 'Product'} × {item.quantity}
                      </Typography>
                    ))}
                  </Box>

                  <Chip
                    label={order.status || 'Pending'}
                    color="primary"
                    size="small"
                  />
                </Box>

                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Total Amount
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #6366f1 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    ${(order.total || 0).toFixed(2)}
                  </Typography>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate(`/order/${order.id}`)}
                    size="small"
                  >
                    View Details
                  </Button>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

