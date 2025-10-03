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
} from '@mui/material';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';
import { usePostBasket } from '../hooks';
import { useState } from 'react';

// Same placeholder data as HomePage
const placeholderProducts = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear sound with active noise cancellation. Premium materials and ergonomic design for all-day comfort.',
    longDescription: 'These premium wireless headphones deliver exceptional audio quality with advanced active noise cancellation technology. Featuring 40mm drivers, Bluetooth 5.0 connectivity, and up to 30 hours of battery life. The lightweight design and memory foam ear cushions ensure comfortable all-day wear.',
    price: 299.99,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=800&fit=crop',
    features: ['Active Noise Cancellation', '30-hour battery life', 'Bluetooth 5.0', 'Premium materials'],
  },
  {
    id: '2',
    title: 'Smart Watch Pro',
    description: 'Track your fitness, stay connected',
    longDescription: 'Advanced fitness tracking meets elegant design. Monitor your heart rate, track workouts, receive notifications, and more. Water-resistant up to 50 meters with a battery that lasts up to 7 days.',
    price: 399.99,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=800&fit=crop',
    features: ['Heart rate monitor', '7-day battery', 'Water-resistant', 'GPS tracking'],
  },
  {
    id: '3',
    title: 'Minimalist Backpack',
    description: 'Perfect blend of style and functionality',
    longDescription: 'Crafted from durable water-resistant fabric with a minimalist design. Features a padded laptop compartment, multiple organization pockets, and ergonomic straps for comfortable carrying.',
    price: 89.99,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=800&fit=crop',
    features: ['Water-resistant', 'Laptop compartment', 'Ergonomic design', 'Durable materials'],
  },
  {
    id: '4',
    title: 'Ceramic Coffee Mug',
    description: 'Handcrafted, elegant design',
    longDescription: 'Handcrafted ceramic mug with a smooth matte finish. Perfect size for your morning coffee or afternoon tea. Microwave and dishwasher safe.',
    price: 24.99,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1200&h=800&fit=crop',
    features: ['Handcrafted ceramic', 'Microwave safe', 'Dishwasher safe', 'Perfect size'],
  },
  {
    id: '5',
    title: 'Leather Wallet',
    description: 'Premium leather, timeless design',
    longDescription: 'Crafted from genuine full-grain leather that ages beautifully. Slim design with RFID protection and multiple card slots. The perfect everyday carry.',
    price: 79.99,
    stock: 75,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=1200&h=800&fit=crop',
    features: ['Full-grain leather', 'RFID protection', 'Slim design', 'Multiple card slots'],
  },
  {
    id: '6',
    title: 'Desk Lamp',
    description: 'Modern lighting for your workspace',
    longDescription: 'Adjustable LED desk lamp with touch controls and multiple brightness levels. Energy-efficient LED technology provides perfect lighting for work or study.',
    price: 149.99,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&h=800&fit=crop',
    features: ['LED technology', 'Adjustable brightness', 'Touch controls', 'Energy-efficient'],
  },
];

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  
  const { mutate: addToBasket, loading } = usePostBasket({
    onSuccess: () => {
      setSuccessMessage('Added to basket!');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error) => {
      console.error('Failed to add to basket:', error);
    },
  });

  const product = placeholderProducts.find(p => p.id === id);

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
            <CardMedia
              component="img"
              image={product.image}
              alt={product.title}
              sx={{
                borderRadius: 3,
                aspectRatio: '1 / 1',
                objectFit: 'cover',
              }}
            />
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
              {product.longDescription}
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Features
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {product.features.map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    variant="outlined"
                    sx={{
                      borderColor: 'secondary.main',
                      color: 'secondary.main',
                    }}
                  />
                ))}
              </Box>
            </Box>

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

