import {
  Box,
  Container,
  Typography,
  Card,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Receipt, ArrowBack, CheckCircle } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetOrderById } from '../hooks';

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: orderData, loading, error } = useGetOrderById(
    { id: id || '' },
    undefined,
    [id]
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !orderData) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load order details. Please make sure you're logged in.
        </Alert>
        <Button onClick={() => navigate('/orders')} sx={{ mt: 2 }}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  const order = (orderData?.data as any)?.order;

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Order not found
        </Alert>
        <Button onClick={() => navigate('/orders')} sx={{ mt: 2 }}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/orders')}
          sx={{ mb: 3 }}
        >
          Back to Orders
        </Button>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Receipt sx={{ fontSize: 40, mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
                Order #{order.id?.slice(0, 8)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Box>
          </Box>

          <Chip
            icon={<CheckCircle />}
            label={order.status || 'Pending'}
            color="primary"
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
            gap: 3,
          }}
        >
          <Box>
            <Card sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Order Items
              </Typography>

              {order.items && order.items.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {order.items.map((item: any, index: number) => (
                    <Box key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          py: 2,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ mb: 0.5 }}>
                            {item.product?.title || 'Product'}
                          </Typography>
                          {item.product?.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              {item.product.description.length > 100
                                ? item.product.description.slice(0, 100) + '...'
                                : item.product.description}
                            </Typography>
                          )}
                          <Typography variant="body2" color="text.secondary">
                            Quantity: {item.quantity}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right', ml: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Unit Price
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            ${(item.product?.price || 0).toFixed(2)}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Subtotal
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              background: 'linear-gradient(135deg, #1a1a1a 0%, #6366f1 100%)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                      {index < order.items.length - 1 && <Divider />}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Alert severity="info">No items in this order</Alert>
              )}
            </Card>
          </Box>

          <Box>
            <Card sx={{ p: 3, position: 'sticky', top: 24 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Order Summary
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Order ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {order.id?.slice(0, 12)}...
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                  >
                    {order.status || 'Pending'}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Items
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {order.items?.length || 0}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Total Amount
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #6366f1 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  ${(order.total || 0).toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </Button>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

