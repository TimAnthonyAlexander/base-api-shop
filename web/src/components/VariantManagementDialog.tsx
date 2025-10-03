import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Alert,
    CircularProgress,
    Chip,
    Stack,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    Tabs,
    Tab,
} from '@mui/material';
import { Delete, Add, Close, Search } from '@mui/icons-material';
import {
    getAdminProductVariants,
    createProductVariant,
    ungroupProduct,
    groupProducts,
    type Product,
    type CreateVariantBody,
} from '../api/admin';
import { getProductSearch } from '../client';

interface VariantManagementDialogProps {
    open: boolean;
    onClose: () => void;
    product: Product;
    onSuccess: () => void;
}

export default function VariantManagementDialog({
    open,
    onClose,
    product,
    onSuccess,
}: VariantManagementDialogProps) {
    const [variants, setVariants] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState(0);

    // New variant form
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newVariant, setNewVariant] = useState<CreateVariantBody>({
        title: '',
        description: product.description,
        price: product.price,
        stock: 0,
    });

    // Search for existing products
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const [addingProduct, setAddingProduct] = useState(false);

    useEffect(() => {
        if (open) {
            loadVariants();
        }
    }, [open, product.id]);

    const loadVariants = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getAdminProductVariants(product.id);
            setVariants(response.data.variants);
        } catch (e) {
            setError('Failed to load variants');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateVariant = async () => {
        if (!newVariant.title) {
            setError('Title is required');
            return;
        }

        setCreating(true);
        setError('');
        try {
            await createProductVariant(product.id, newVariant);
            setSuccess('Variant created successfully!');
            setShowCreateForm(false);
            setNewVariant({
                title: '',
                description: product.description,
                price: product.price,
                stock: 0,
            });
            await loadVariants();
            onSuccess();
            setTimeout(() => setSuccess(''), 3000);
        } catch (e) {
            setError('Failed to create variant');
            console.error(e);
        } finally {
            setCreating(false);
        }
    };

    const handleUngroup = async (variantId: string) => {
        if (!window.confirm('Remove this product from the variant group?')) return;

        try {
            await ungroupProduct(variantId);
            setSuccess('Product ungrouped successfully!');
            await loadVariants();
            onSuccess();
            setTimeout(() => setSuccess(''), 3000);
        } catch (e) {
            setError('Failed to ungroup product');
            console.error(e);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        setError('');
        try {
            const response = await getProductSearch({ query: searchQuery });
            const products = (response.data as any)?.products || [];
            // Filter out products that are already in this variant group
            const variantIds = variants.map((v) => v.id);
            const filtered = products.filter((p: any) => !variantIds.includes(p.id) && p.id !== product.id);
            setSearchResults(filtered);
        } catch (e) {
            setError('Search failed');
            console.error(e);
        } finally {
            setSearching(false);
        }
    };

    const handleAddExistingProduct = async (productId: string) => {
        setAddingProduct(true);
        setError('');
        try {
            // Group this product with the current variant group
            const productIds = [product.id, productId];
            await groupProducts({ product_ids: productIds });
            setSuccess('Product added to variant group!');
            setSearchQuery('');
            setSearchResults([]);
            await loadVariants();
            onSuccess();
            setTimeout(() => setSuccess(''), 3000);
        } catch (e) {
            setError('Failed to add product to variant group');
            console.error(e);
        } finally {
            setAddingProduct(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Manage Variants</Typography>
                <IconButton size="small" onClick={onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Base Product: {product.title}
                    </Typography>
                    {product.variant_group && (
                        <Typography variant="caption" color="text.secondary">
                            Variant Group: {product.variant_group.substring(0, 8)}...
                        </Typography>
                    )}
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
                            <Tab label="Current Variants" />
                            <Tab label="Add Existing Product" />
                            <Tab label="Create New Variant" />
                        </Tabs>

                        {/* Current Variants Tab */}
                        {activeTab === 0 && (
                            <>
                                {variants.length > 0 ? (
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                            Variants in this Group ({variants.length})
                                        </Typography>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Title</TableCell>
                                                    <TableCell>Price</TableCell>
                                                    <TableCell>Stock</TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {variants.map((variant) => (
                                                    <TableRow key={variant.id}>
                                                        <TableCell>
                                                            {variant.title}
                                                            {variant.id === product.id && (
                                                                <Chip label="Current" size="small" sx={{ ml: 1 }} />
                                                            )}
                                                        </TableCell>
                                                        <TableCell>${variant.price.toFixed(2)}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={variant.stock}
                                                                size="small"
                                                                color={variant.stock > 0 ? 'success' : 'error'}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleUngroup(variant.id)}
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                ) : (
                                    <Alert severity="info">
                                        No variants yet. Add an existing product or create a new variant to get started.
                                    </Alert>
                                )}
                            </>
                        )}

                        {/* Add Existing Product Tab */}
                        {activeTab === 1 && (
                            <Box>
                                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                    Search for Products
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Search by product title..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button size="small" onClick={handleSearch} disabled={searching}>
                                                    {searching ? <CircularProgress size={20} /> : 'Search'}
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />

                                {searchResults.length > 0 ? (
                                    <Box sx={{ maxHeight: 300, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                                        <List dense>
                                            {searchResults.map((result: any) => (
                                                <ListItem
                                                    key={result.id}
                                                    secondaryAction={
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => handleAddExistingProduct(result.id)}
                                                            disabled={addingProduct}
                                                            startIcon={addingProduct ? <CircularProgress size={16} /> : <Add />}
                                                        >
                                                            Add
                                                        </Button>
                                                    }
                                                >
                                                    <ListItemText
                                                        primary={result.title}
                                                        secondary={`$${result.price.toFixed(2)} • Stock: ${result.stock}`}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                ) : searchQuery && !searching ? (
                                    <Alert severity="info">No products found. Try a different search term.</Alert>
                                ) : null}
                            </Box>
                        )}

                        {/* Create New Variant Tab */}
                        {activeTab === 2 && (
                            <Box>
                                {!showCreateForm ? (
                                    <>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            Create a new product variant based on the current product. The new variant will share the same variant group.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<Add />}
                                            onClick={() => setShowCreateForm(true)}
                                            fullWidth
                                        >
                                            Start Creating Variant
                                        </Button>
                                    </>
                                ) : (
                                    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                                            Create New Variant
                                        </Typography>
                                        <Stack spacing={2}>
                                    <TextField
                                        label="Title"
                                        value={newVariant.title}
                                        onChange={(e) => setNewVariant({ ...newVariant, title: e.target.value })}
                                        fullWidth
                                        size="small"
                                        required
                                    />
                                    <TextField
                                        label="Description"
                                        value={newVariant.description || ''}
                                        onChange={(e) => setNewVariant({ ...newVariant, description: e.target.value })}
                                        fullWidth
                                        size="small"
                                        multiline
                                        rows={2}
                                    />
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                        <TextField
                                            label="Price"
                                            type="number"
                                            value={newVariant.price || ''}
                                            onChange={(e) =>
                                                setNewVariant({ ...newVariant, price: parseFloat(e.target.value) || 0 })
                                            }
                                            fullWidth
                                            size="small"
                                            inputProps={{ step: 0.01, min: 0 }}
                                        />
                                        <TextField
                                            label="Stock"
                                            type="number"
                                            value={newVariant.stock || ''}
                                            onChange={(e) =>
                                                setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })
                                            }
                                            fullWidth
                                            size="small"
                                            inputProps={{ min: 0 }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleCreateVariant}
                                            disabled={creating}
                                            startIcon={creating ? <CircularProgress size={16} /> : <Add />}
                                        >
                                            {creating ? 'Creating...' : 'Create'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                setShowCreateForm(false);
                                                setNewVariant({
                                                    title: '',
                                                    description: product.description,
                                                    price: product.price,
                                                    stock: 0,
                                                });
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Stack>
                            </Box>
                                )}
                            </Box>
                        )}
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

