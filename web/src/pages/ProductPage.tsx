import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ShoppingCart, ArrowBack, ImageNotSupported } from '@mui/icons-material';
import { usePostBasket, useGetProductById } from '../hooks';
import { useState } from 'react';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  
  // Fetch product from API
  const { data: productData, loading: loadingProduct, error } = useGetProductById(
    { id: id || '' },
    undefined,
    { enabled: !!id }
  );

  const { mutate: addToBasket, loading } = usePostBasket({
    onSuccess: () => {
      setSuccessMessage('Added to basket!');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error) => {
      console.error('Failed to add to basket:', error);
    },
  });

  if (loadingProduct) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !productData) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Product not found or failed to load
        </Alert>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const product = (productData?.data as any)?.product;

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4">Product not found</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const handleAddToBasket = () => {
    addToBasket({
      body: {
        product_id: product.id,
        action: 'add',
      },
    });
  };

  // Get first image from product
  const productImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 4, color: 'text.secondary' }}
        >
          Back to Shop
        </Button>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 6,
          }}
        >
          <Card elevation={0}>
            {productImage ? (
              <CardMedia
                component="img"
                image={productImage}
                alt={product.title}
                sx={{
                  borderRadius: 3,
                  aspectRatio: '1 / 1',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Box
                sx={{
                  borderRadius: 3,
                  aspectRatio: '1 / 1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                }}
              >
                <ImageNotSupported sx={{ fontSize: 100, color: 'grey.400' }} />
              </Box>
            )}
          </Card>

          <Box sx={{ position: 'sticky', top: 100 }}>
            <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
              {product.title}
            </Typography>

            <Typography
              variant="h3"
              sx={{
                mb: 3,
                fontWeight: 700,
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #6366f1 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ${product.price.toFixed(2)}
            </Typography>

            <Chip
              label={product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              color={product.stock > 0 ? 'success' : 'error'}
              sx={{ mb: 4 }}
            />

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
              {product.description || 'No description available'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={handleAddToBasket}
                disabled={loading || product.stock === 0}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Adding...' : 'Add to Basket'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

