import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add, Remove, Delete, ShoppingBag } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGetBasket, usePostBasket } from '../hooks';

export default function BasketPage() {
  const navigate = useNavigate();
  const { data: basketData, loading, error, refetch } = useGetBasket();
  const [optimisticItems, setOptimisticItems] = useState<any[]>([]);

  const { mutate: updateBasket } = usePostBasket({
    onSuccess: () => {
      // Refetch in background to sync with server state
      refetch();
    },
    onError: () => {
      // Revert optimistic update on error
      refetch();
    },
  });

  // Sync optimistic state with fetched data
  useEffect(() => {
    if (basketData?.data) {
      setOptimisticItems((basketData.data as any)?.items || []);
    }
  }, [basketData]);

  // Only show full-page loader on initial load (when there's no data yet)
  if (loading && !basketData) {
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
          Failed to load basket. Please make sure you're logged in.
        </Alert>
        <Button onClick={() => navigate('/auth')} sx={{ mt: 2 }}>
          Go to Login
        </Button>
      </Container>
    );
  }

  const basket = (basketData?.data as any)?.basket;
  const items = optimisticItems;
  const stripeCheckoutUrl = basket?.stripe_checkout;

  const handleUpdateQuantity = (productId: string, action: 'add' | 'remove') => {
    // Optimistic update: immediately update UI
    setOptimisticItems((currentItems) => {
      const newItems = [...currentItems];
      const itemIndex = newItems.findIndex((item) => item.product_id === productId);
      
      if (itemIndex === -1) return currentItems;
      
      if (action === 'remove') {
        if (newItems[itemIndex].quantity <= 1) {
          // Remove item from array
          newItems.splice(itemIndex, 1);
        } else {
          // Decrease quantity
          newItems[itemIndex] = {
            ...newItems[itemIndex],
            quantity: newItems[itemIndex].quantity - 1,
          };
        }
      } else if (action === 'add') {
        // Increase quantity
        newItems[itemIndex] = {
          ...newItems[itemIndex],
          quantity: newItems[itemIndex].quantity + 1,
        };
      }
      
      return newItems;
    });

    // Call API in background
    updateBasket({
      body: {
        product_id: productId,
        action,
      },
    });
  };

  const calculateTotal = () => {
    return items.reduce((total: number, item: any) => {
      const price = Number(item.product?.price || 0);
      const quantity = Number(item.quantity || 0);
      return total + (price * quantity);
    }, 0);
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 12, textAlign: 'center' }}>
        <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" sx={{ mb: 2 }}>
          Your basket is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Start shopping to add items to your basket
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
          Shopping Basket
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
          {items.length} {items.length === 1 ? 'item' : 'items'} in your basket
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
            gap: 4,
          }}
        >
          <Box>
            {items.map((item: any) => (
              <Card key={item.id} sx={{ mb: 2, p: 2 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '120px 1fr auto' },
                    gap: 2,
                    alignItems: 'center',
                  }}
                >
                  <Box
                    component="img"
                    src={`https://images.unsplash.com/photo-${parseInt(item.product_id.slice(0, 8), 16) % 6 === 0 ? '1505740420928-5e560c06d30e' : parseInt(item.product_id.slice(0, 8), 16) % 6 === 1 ? '1523275335684-37898b6baf30' : parseInt(item.product_id.slice(0, 8), 16) % 6 === 2 ? '1553062407-98eeb64c6a62' : parseInt(item.product_id.slice(0, 8), 16) % 6 === 3 ? '1514228742587-6b1558fcca3d' : parseInt(item.product_id.slice(0, 8), 16) % 6 === 4 ? '1627123424574-724758594e93' : '1507473885765-e6ed057f782c'}?w=400&h=400&fit=crop`}
                    alt={item.product?.title || 'Product'}
                    sx={{
                      width: '100%',
                      borderRadius: 2,
                      aspectRatio: '1 / 1',
                      objectFit: 'cover',
                    }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {item.product?.title || 'Product'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${Number(item.product?.price || 0).toFixed(2)} each
                    </Typography>
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.product_id, 'remove')}
                      >
                        {Number(item.quantity) === 1 ? <Delete /> : <Remove />}
                      </IconButton>
                      <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.product_id, 'add')}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      ${(Number(item.product?.price || 0) * Number(item.quantity || 0)).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          <Card sx={{ position: 'sticky', top: 100, p: 3, height: 'fit-content' }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Order Summary
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>${calculateTotal().toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography>Free</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total</Typography>
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
                ${calculateTotal().toFixed(2)}
              </Typography>
            </Box>

            {stripeCheckoutUrl ? (
              <Button
                variant="contained"
                size="large"
                fullWidth
                component="a"
                href={stripeCheckoutUrl}
                sx={{ mb: 2 }}
              >
                Proceed to Checkout
              </Button>
            ) : (
              <Alert severity="info" sx={{ mb: 2 }}>
                Checkout URL will be generated
              </Alert>
            )}

            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

