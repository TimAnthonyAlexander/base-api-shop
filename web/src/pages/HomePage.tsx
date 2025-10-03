import {
    Box,
    Container,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    TextField,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import { Search, ShoppingBag, ImageNotSupported } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGetProductRecommendations, useGetProductSearch } from '../hooks';
import { getImageUrl } from '../http';

export default function HomePage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch recommendations (shown when not searching)
    const { data: recommendationsData, loading: loadingRecommendations } = useGetProductRecommendations(
        { limit: 33 },
        { enabled: !debouncedQuery }
    );

    // Fetch search results (shown when searching)
    const { data: searchData, loading: loadingSearch } = useGetProductSearch(
        { query: debouncedQuery },
        { enabled: !!debouncedQuery }
    );

    const products = debouncedQuery
        ? ((searchData?.data as any)?.products || [])
        : ((recommendationsData?.data as any)?.products || []);

    const loading = debouncedQuery ? loadingSearch : loadingRecommendations;

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #fafafa 0%, #f0f0ff 100%)',
                    pt: { xs: 8, md: 12 },
                    pb: { xs: 12, md: 16 },
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                fontWeight: 700,
                                mb: 3,
                                background: 'linear-gradient(135deg, #1a1a1a 0%, #6366f1 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Discover Minimalist Excellence
                        </Typography>
                        <Typography
                            variant="h5"
                            color="text.secondary"
                            sx={{ mb: 6, fontWeight: 400, lineHeight: 1.6 }}
                        >
                            Curated collection of thoughtfully designed products
                        </Typography>

                        {/* Search Bar */}
                        <TextField
                            fullWidth
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                maxWidth: 600,
                                mx: 'auto',
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'white',
                                    borderRadius: 3,
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Container>
            </Box>

            {/* Products Grid */}
            <Container maxWidth="xl" sx={{ py: 8 }}>
                {!debouncedQuery && (
                    <Typography variant="h3" sx={{ mb: 4, fontWeight: 600 }}>
                        Recommended for You
                    </Typography>
                )}

                {debouncedQuery && (
                    <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
                        Search results for "{debouncedQuery}"
                    </Typography>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                },
                                gap: 4,
                            }}
                        >
                            {products.map((product: any) => {
                                const imagePath = product.images && product.images.length > 0
                                    ? product.images[0]
                                    : null;
                                const imageUrl = getImageUrl(imagePath);

                                return (
                                    <Card
                                        key={product.id}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        {imageUrl ? (
                                            <CardMedia
                                                component="img"
                                                height="300"
                                                image={imageUrl}
                                                alt={product.title}
                                                sx={{
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    height: 300,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    bgcolor: 'grey.100',
                                                }}
                                            >
                                                <ImageNotSupported sx={{ fontSize: 60, color: 'grey.400' }} />
                                            </Box>
                                        )}
                                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                                                {product.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {product.description || 'No description available'}
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
                                                ${Number(product.price || 0).toFixed(2)}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ p: 3, pt: 0 }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                startIcon={<ShoppingBag />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/product/${product.id}`);
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </CardActions>
                                    </Card>
                                );
                            })}
                        </Box>

                        {products.length === 0 && !loading && (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h5" color="text.secondary">
                                    {debouncedQuery
                                        ? 'No products found matching your search'
                                        : 'No products available yet'}
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
}

