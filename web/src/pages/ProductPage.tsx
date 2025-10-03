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
    TextField,
    IconButton,
    Stack,
    Paper,
} from '@mui/material';
import { ShoppingCart, ArrowBack, ImageNotSupported, Add, Delete, Edit, Check, Close } from '@mui/icons-material';
import { usePostBasket, useGetProductById, useGetMe } from '../hooks';
import { useState, useEffect } from 'react';
import { getImageUrl } from '../http';
import {
    addProductAttribute,
    updateProductAttribute,
    deleteProductAttribute,
    type ProductAttribute,
} from '../api/admin';
import { getProductVariants, type ProductVariant } from '../api/variants';

type User = { id: string; role?: string | null };
type MePayload = { user?: User } | User;
type ApiResponse<T> = { data: T };

type Product = {
    id: string;
    title: string;
    description?: string | null;
    price: number;
    stock: number;
    images?: string[] | null;
    attributes?: ProductAttribute[] | null;
};

export default function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [successMessage, setSuccessMessage] = useState('');
    const [editingAttributeId, setEditingAttributeId] = useState<string | null>(null);
    const [editAttribute, setEditAttribute] = useState('');
    const [editValue, setEditValue] = useState('');
    const [isAddingAttribute, setIsAddingAttribute] = useState(false);
    const [newAttribute, setNewAttribute] = useState('');
    const [newValue, setNewValue] = useState('');
    const [attributeError, setAttributeError] = useState('');
    const [variants, setVariants] = useState<ProductVariant[]>([]);

    const { data: meRaw } = useGetMe(undefined, { enabled: true });
    const me = meRaw as unknown as ApiResponse<MePayload> | undefined;
    const user: User | undefined =
        me?.data && typeof me.data === 'object' && 'user' in me.data
            ? (me.data as { user?: User }).user
            : (me?.data as User | undefined);
    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';

    const { data: productRaw, loading: loadingProduct, error } = useGetProductById(
        { id: id ?? '' },
        undefined,
        { enabled: !!id }
    );

    const { mutate: addToBasket, loading } = usePostBasket({
        onSuccess: () => {
            setSuccessMessage('Added to basket!');
            setTimeout(() => setSuccessMessage(''), 3000);
        },
        onError: (e: unknown) => {
            console.error('Failed to add to basket:', e);
        },
    });

    const productPayload = productRaw as ApiResponse<{ product: Product } | Product> | undefined;
    const product: Product | undefined =
        productPayload?.data && typeof productPayload.data === 'object' && 'product' in productPayload.data
            ? (productPayload.data as { product: Product }).product
            : ((productPayload?.data as Product | undefined) ?? undefined);

    useEffect(() => {
        if (product?.id) {
            getProductVariants(product.id)
                .then((response) => setVariants(response.data.variants))
                .catch((e) => {
                    console.error('Failed to load variants:', e);
                    setVariants([]);
                });
        }
    }, [product?.id]);

    const handleAddToBasket = () => {
        if (!product) return;
        addToBasket({ body: { product_id: product.id, action: 'add' } });
    };

    const imagePath = product?.images && product.images.length > 0 ? product.images[0] : null;
    const productImage = imagePath ? getImageUrl(imagePath) : null;
    const attributes: ProductAttribute[] = (product?.attributes as ProductAttribute[] | null) ?? [];

    const handleAddAttribute = async () => {
        if (!product) return;
        if (!newAttribute || !newValue) {
            setAttributeError('Both attribute name and value are required');
            return;
        }
        try {
            await addProductAttribute(product.id, { attribute: newAttribute, value: newValue });
            setNewAttribute('');
            setNewValue('');
            setIsAddingAttribute(false);
            setAttributeError('');
            window.location.reload();
        } catch (e) {
            setAttributeError('Failed to add attribute');
            console.error(e);
        }
    };

    const handleUpdateAttribute = async (attributeId: string) => {
        try {
            await updateProductAttribute(attributeId, { attribute: editAttribute, value: editValue });
            setEditingAttributeId(null);
            setEditAttribute('');
            setEditValue('');
            window.location.reload();
        } catch (e) {
            console.error('Failed to update attribute:', e);
        }
    };

    const handleDeleteAttribute = async (attributeId: string) => {
        try {
            await deleteProductAttribute(attributeId);
            window.location.reload();
        } catch (e) {
            console.error('Failed to delete attribute:', e);
        }
    };

    const startEditingAttribute = (attr: ProductAttribute) => {
        setEditingAttributeId(attr.id);
        setEditAttribute(attr.attribute);
        setEditValue(attr.value);
    };

    const cancelEditingAttribute = () => {
        setEditingAttributeId(null);
        setEditAttribute('');
        setEditValue('');
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mb: 4, color: 'text.secondary' }}>
                    Back to Shop
                </Button>

                {successMessage && <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>}

                {loadingProduct && (
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <CircularProgress />
                    </Box>
                )}

                {!loadingProduct && (error || !product) && (
                    <Box sx={{ py: 8 }}>
                        <Alert severity="error" sx={{ mb: 2 }}>Product not found or failed to load</Alert>
                        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Back to Home</Button>
                    </Box>
                )}

                {!loadingProduct && !error && product && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6 }}>
                        <Card elevation={0}>
                            {productImage ? (
                                <CardMedia
                                    component="img"
                                    image={productImage}
                                    alt={product.title}
                                    sx={{ borderRadius: 3, aspectRatio: '1 / 1', objectFit: 'cover' }}
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

                            {variants.length > 1 && (
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        Available Variants
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                        {variants.map((variant) => (
                                            <Card
                                                key={variant.id}
                                                elevation={0}
                                                sx={{
                                                    cursor: variant.is_current ? 'default' : 'pointer',
                                                    border: '2px solid',
                                                    borderColor: variant.is_current ? 'primary.main' : 'grey.200',
                                                    borderRadius: 2,
                                                    transition: 'all 0.2s ease',
                                                    ...(!variant.is_current && {
                                                        '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)', boxShadow: 2 }
                                                    }),
                                                    width: 140,
                                                    position: 'relative',
                                                    bgcolor: variant.is_current ? 'primary.50' : 'background.paper',
                                                }}
                                                onClick={() => !variant.is_current && navigate(`/product/${variant.id}`)}
                                            >
                                            {variant.is_current && (
                                                <Chip 
                                                    label="Selected" 
                                                    size="small" 
                                                    color="primary"
                                                    sx={{ 
                                                        position: 'absolute', 
                                                        top: 8, 
                                                        right: 8, 
                                                        zIndex: 1,
                                                        height: 20,
                                                        fontSize: '0.65rem',
                                                    }} 
                                                />
                                            )}
                                            {variant.image && (
                                                <CardMedia
                                                    component="img"
                                                    image={getImageUrl(variant.image) || ''}
                                                    alt={variant.title}
                                                    sx={{ 
                                                        height: 120, 
                                                        objectFit: 'cover',
                                                        opacity: variant.is_current ? 1 : 0.9,
                                                    }}
                                                />
                                            )}
                                            <Box sx={{ p: 1.5 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: '0.75rem',
                                                        mb: 0.5,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        color: variant.is_current ? 'primary.main' : 'text.primary',
                                                    }}
                                                >
                                                    {Object.entries(variant.attributes)
                                                        .map(([_, value]) => String(value))
                                                        .join(' • ') || 'Variant'}
                                                </Typography>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        fontWeight: 700, 
                                                        color: variant.is_current ? 'primary.main' : 'text.secondary', 
                                                        fontSize: '0.875rem' 
                                                    }}
                                                >
                                                    ${variant.price.toFixed(2)}
                                                </Typography>
                                                {variant.stock === 0 && (
                                                    <Chip label="Out of Stock" size="small" color="error" sx={{ mt: 0.5, height: 18, fontSize: '0.65rem' }} />
                                                )}
                                            </Box>
                                            </Card>
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {attributes.length > 0 && (
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        Specifications
                                    </Typography>
                                    <Stack spacing={1.5}>
                                        {attributes.map((attr) => (
                                            <Paper
                                                key={attr.id}
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    bgcolor: 'grey.50',
                                                    borderRadius: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                {editingAttributeId === attr.id ? (
                                                    <Box sx={{ display: 'flex', gap: 1, flex: 1, alignItems: 'center' }}>
                                                        <TextField
                                                            size="small"
                                                            value={editAttribute}
                                                            onChange={(e) => setEditAttribute(e.target.value)}
                                                            placeholder="Attribute"
                                                            sx={{ flex: 1 }}
                                                        />
                                                        <TextField
                                                            size="small"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            placeholder="Value"
                                                            sx={{ flex: 1 }}
                                                        />
                                                        <IconButton size="small" color="primary" onClick={() => handleUpdateAttribute(attr.id)}>
                                                            <Check />
                                                        </IconButton>
                                                        <IconButton size="small" onClick={cancelEditingAttribute}>
                                                            <Close />
                                                        </IconButton>
                                                    </Box>
                                                ) : (
                                                    <>
                                                        <Box>
                                                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                                                                {attr.attribute}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {attr.value}
                                                            </Typography>
                                                        </Box>
                                                        {isAdmin && (
                                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                <IconButton size="small" onClick={() => startEditingAttribute(attr)}>
                                                                    <Edit fontSize="small" />
                                                                </IconButton>
                                                                <IconButton size="small" color="error" onClick={() => handleDeleteAttribute(attr.id)}>
                                                                    <Delete fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        )}
                                                    </>
                                                )}
                                            </Paper>
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            {isAdmin && (
                                <Box sx={{ mb: 4 }}>
                                    {!isAddingAttribute ? (
                                        <Button startIcon={<Add />} variant="outlined" size="small" onClick={() => setIsAddingAttribute(true)}>
                                            Add Specification
                                        </Button>
                                    ) : (
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                            <Stack spacing={2}>
                                                <TextField
                                                    size="small"
                                                    label="Attribute Name"
                                                    value={newAttribute}
                                                    onChange={(e) => setNewAttribute(e.target.value)}
                                                    placeholder="e.g. Color, Size, Material"
                                                    fullWidth
                                                />
                                                <TextField
                                                    size="small"
                                                    label="Value"
                                                    value={newValue}
                                                    onChange={(e) => setNewValue(e.target.value)}
                                                    placeholder="e.g. Red, Large, Cotton"
                                                    fullWidth
                                                />
                                                {attributeError && <Alert severity="error" sx={{ py: 0.5 }}>{attributeError}</Alert>}
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Button variant="contained" size="small" onClick={handleAddAttribute} startIcon={<Check />}>
                                                        Add
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => {
                                                            setIsAddingAttribute(false);
                                                            setNewAttribute('');
                                                            setNewValue('');
                                                            setAttributeError('');
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    )}
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {isAuthenticated ? (
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
                                ) : (
                                    <Button variant="contained" size="large" fullWidth onClick={() => navigate('/auth')} sx={{ py: 1.5 }}>
                                        Sign in to Purchase
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
