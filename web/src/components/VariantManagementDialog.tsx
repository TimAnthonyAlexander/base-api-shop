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
    ListItemButton,
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
                        {variants.length > 0 && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    Current Variants ({variants.length})
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
                        )}

                        {!showCreateForm ? (
                            <Button
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={() => setShowCreateForm(true)}
                                fullWidth
                            >
                                Create New Variant
                            </Button>
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
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

