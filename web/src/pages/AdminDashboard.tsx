import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    Button,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    Paper,
    CircularProgress,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Tabs,
    Tab,
    TablePagination,
} from '@mui/material';
import {
    Palette,
    TrendingUp,
    ShoppingCart,
    Save,
    Add,
    Edit,
    Delete,
    CheckCircle,
    Cancel,
    Inventory,
    Receipt,
    CloudUpload,
    Image as ImageIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGetMe } from '../hooks';
import { useTheme } from '../contexts/ThemeContext';
import { themeConfigs, type ThemeName } from '../themes';
import { getImageUrl } from '../http';
import {
    postAdminTheme,
    getAdminProducts,
    getAdminOrders,
    getAdminAnalytics,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct,
    updateAdminOrder,
    uploadProductImage,
    deleteProductImage,
    type Product,
    type Order,
    type CreateProductBody,
    type UpdateProductBody,
} from '../api/admin';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { data: userData, loading: userLoading, error: userError } = useGetMe();
    const { themeName, refetchTheme } = useTheme();

    const [tabValue, setTabValue] = useState(0);
    const [selectedTheme, setSelectedTheme] = useState<ThemeName>(themeName);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Analytics state
    const [analytics, setAnalytics] = useState({
        total_sales: 0,
        total_orders: 0,
        completed_orders: 0,
        pending_orders: 0,
        cancelled_orders: 0,
    });

    // Products state
    const [products, setProducts] = useState<Product[]>([]);
    const [productsTotal, setProductsTotal] = useState(0);
    const [productsPage, setProductsPage] = useState(0);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productDialogOpen, setProductDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productForm, setProductForm] = useState<CreateProductBody>({
        title: '',
        description: '',
        price: 0,
        stock: 0,
    });

    // Orders state
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersTotal, setOrdersTotal] = useState(0);
    const [ordersPage, setOrdersPage] = useState(0);
    const [ordersPerPage, setOrdersPerPage] = useState(10);
    const [orderStatusFilter, setOrderStatusFilter] = useState<string>('');
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        setSelectedTheme(themeName);
    }, [themeName]);

    useEffect(() => {
        if (!userLoading && userData) {
            const user = (userData.data as any)?.user || (userData.data as any);
            if (user?.role !== 'admin') {
                navigate('/');
            }
        }
    }, [userData, userLoading, navigate]);

    useEffect(() => {
        loadAnalytics();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [productsPage, productsPerPage]);

    useEffect(() => {
        loadOrders();
    }, [ordersPage, ordersPerPage, orderStatusFilter]);

    const loadAnalytics = async () => {
        try {
            const response = await getAdminAnalytics();
            setAnalytics(response.data);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        }
    };

    const loadProducts = async () => {
        setLoadingProducts(true);
        try {
            const response = await getAdminProducts({
                page: productsPage + 1,
                per_page: productsPerPage,
            });
            setProducts(response.data.products);
            setProductsTotal(response.data.total);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const loadOrders = async () => {
        setLoadingOrders(true);
        try {
            const params: any = {
                page: ordersPage + 1,
                per_page: ordersPerPage,
            };
            if (orderStatusFilter) {
                params.status = orderStatusFilter;
            }
            const response = await getAdminOrders(params);
            setOrders(response.data.orders);
            setOrdersTotal(response.data.total);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    if (userLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (userError) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Alert severity="error" sx={{ mb: 3, border: 1, borderColor: 'divider', boxShadow: 'none' }}>
                    Please log in as an administrator to access this page.
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate('/auth')}
                    sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                >
                    Go to Login
                </Button>
            </Container>
        );
    }

    const user = (userData?.data as any)?.user || (userData?.data as any);
    if (user?.role !== 'admin') return null;

    const handleSaveTheme = async () => {
        setSaving(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            await postAdminTheme({ theme: selectedTheme });
            await refetchTheme();
            setSuccessMessage('Theme updated successfully for all users!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to update theme');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setSaving(false);
        }
    };

    const handleOpenProductDialog = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setProductForm({
                title: product.title,
                description: product.description || '',
                price: product.price,
                stock: product.stock,
            });
        } else {
            setEditingProduct(null);
            setProductForm({
                title: '',
                description: '',
                price: 0,
                stock: 0,
            });
        }
        setProductDialogOpen(true);
    };

    const handleCloseProductDialog = () => {
        setProductDialogOpen(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = async () => {
        try {
            if (editingProduct) {
                await updateAdminProduct(editingProduct.id, productForm as UpdateProductBody);
                setSuccessMessage('Product updated successfully!');
            } else {
                await createAdminProduct(productForm);
                setSuccessMessage('Product created successfully!');
            }
            handleCloseProductDialog();
            loadProducts();
            loadAnalytics();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to save product');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingProduct || !event.target.files || event.target.files.length === 0) {
            return;
        }

        const file = event.target.files[0];
        
        try {
            await uploadProductImage(editingProduct.id, file);
            setSuccessMessage('Image uploaded successfully!');
            // Reload the product to get updated images
            const response = await getAdminProducts({ page: productsPage + 1, per_page: productsPerPage });
            const updatedProduct = response.data.products.find(p => p.id === editingProduct.id);
            if (updatedProduct) {
                setEditingProduct(updatedProduct);
            }
            loadProducts();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to upload image');
            setTimeout(() => setErrorMessage(''), 3000);
        }

        // Reset file input
        event.target.value = '';
    };

    const handleImageDelete = async (imageId: string) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            await deleteProductImage(imageId);
            setSuccessMessage('Image deleted successfully!');
            // Reload the product to get updated images
            if (editingProduct) {
                const response = await getAdminProducts({ page: productsPage + 1, per_page: productsPerPage });
                const updatedProduct = response.data.products.find(p => p.id === editingProduct.id);
                if (updatedProduct) {
                    setEditingProduct(updatedProduct);
                }
            }
            loadProducts();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to delete image');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteAdminProduct(id);
            setSuccessMessage('Product deleted successfully!');
            loadProducts();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to delete product');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, status: 'fulfilled' | 'cancelled') => {
        try {
            await updateAdminOrder(orderId, { status });
            setSuccessMessage(`Order ${status} successfully!`);
            loadOrders();
            loadAnalytics();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to update order');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const panel = {
        p: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 'none',
    };

    const statPanel = {
        ...panel,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
    };

    const iconBadge = {
        width: 36,
        height: 36,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        bgcolor: 'action.hover',
        color: 'text.primary',
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'fulfilled':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="xl" sx={{ display: 'grid', gap: 3 }}>
                <Box sx={{ display: 'grid', gap: 1 }}>
                    <Typography variant="h3" sx={{ letterSpacing: 0.2 }}>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage products, orders, and store appearance.
                    </Typography>
                </Box>

                {successMessage && (
                    <Alert severity="success" sx={{ ...panel, mb: 0 }}>
                        {successMessage}
                    </Alert>
                )}

                {errorMessage && (
                    <Alert severity="error" sx={{ ...panel, mb: 0 }}>
                        {errorMessage}
                    </Alert>
                )}

                {/* Analytics Cards */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
                        gap: 3,
                    }}
                >
                    <Paper variant="outlined" sx={statPanel}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={iconBadge}>
                                <TrendingUp fontSize="small" />
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Total Sales
                            </Typography>
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                            ${analytics.total_sales.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {analytics.completed_orders} completed orders
                        </Typography>
                    </Paper>

                    <Paper variant="outlined" sx={statPanel}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={iconBadge}>
                                <ShoppingCart fontSize="small" />
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Total Orders
                            </Typography>
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                            {analytics.total_orders}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            All time orders
                        </Typography>
                    </Paper>

                    <Paper variant="outlined" sx={statPanel}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={iconBadge}>
                                <Receipt fontSize="small" />
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Pending Orders
                            </Typography>
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                            {analytics.pending_orders}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Awaiting fulfillment
                        </Typography>
                    </Paper>

                    <Paper variant="outlined" sx={statPanel}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={iconBadge}>
                                <Inventory fontSize="small" />
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Products
                            </Typography>
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                            {productsTotal}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            In catalog
                        </Typography>
                    </Paper>
                </Box>

                {/* Main Content Tabs */}
                <Card variant="outlined" sx={{ ...panel, p: 0 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
                        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                            <Tab label="Theme Settings" />
                            <Tab label="Products" />
                            <Tab label="Orders" />
                        </Tabs>
                    </Box>

                    {/* Theme Settings Tab */}
                    <TabPanel value={tabValue} index={0}>
                        <Box sx={{ px: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Box sx={iconBadge}>
                            <Palette fontSize="small" />
                        </Box>
                        <Box>
                            <Typography variant="h6">Theme Settings</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Choose the theme that all users will see
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
                            gap: 2,
                            alignItems: 'center',
                        }}
                    >
                        <FormControl fullWidth>
                            <InputLabel>Select Theme</InputLabel>
                            <Select
                                value={selectedTheme}
                                label="Select Theme"
                                onChange={(e) => setSelectedTheme(e.target.value as ThemeName)}
                                        MenuProps={{
                                            PaperProps: { elevation: 0, sx: { border: 1, borderColor: 'divider' } },
                                        }}
                            >
                                {themeConfigs.map((config) => (
                                    <MenuItem key={config.name} value={config.name}>
                                        <Box sx={{ display: 'grid' }}>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {config.label}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {config.description}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Save />}
                            onClick={handleSaveTheme}
                            disabled={saving || selectedTheme === themeName}
                            sx={{ minWidth: 200, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                        >
                            {saving ? 'Saving...' : 'Apply Theme'}
                        </Button>
                    </Box>

                    <Box sx={{ mt: 3, px: 2, py: 1.5, borderRadius: 1.5, border: 1, borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.secondary">
                            <strong>Current Theme:</strong>{' '}
                            {themeConfigs.find((c) => c.name === themeName)?.label || 'Luxury'}
                                    {selectedTheme !== themeName && (
                                        <>
                                            {' '}
                                            • <strong style={{ color: 'orange' }}>Unsaved changes</strong>
                                        </>
                                    )}
                                </Typography>
                            </Box>
                                </Box>
                    </TabPanel>

                    {/* Products Tab */}
                    <TabPanel value={tabValue} index={1}>
                        <Box sx={{ px: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6">Product Management</Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={() => handleOpenProductDialog()}
                                    sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                                >
                                    Add Product
                                </Button>
                            </Box>

                            {loadingProducts ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Title</TableCell>
                                                    <TableCell>Price</TableCell>
                                                    <TableCell>Stock</TableCell>
                                                    <TableCell>Views</TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {products.map((product) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell>{product.title}</TableCell>
                                                        <TableCell>${product.price.toFixed(2)}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={product.stock}
                                                                size="small"
                                                                color={product.stock > 0 ? 'success' : 'error'}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{product.views}</TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenProductDialog(product)}
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDeleteProduct(product.id)}
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <TablePagination
                                        component="div"
                                        count={productsTotal}
                                        page={productsPage}
                                        onPageChange={(_, newPage) => setProductsPage(newPage)}
                                        rowsPerPage={productsPerPage}
                                        onRowsPerPageChange={(e) => {
                                            setProductsPerPage(parseInt(e.target.value, 10));
                                            setProductsPage(0);
                                        }}
                                    />
                                </>
                            )}
                            </Box>
                    </TabPanel>

                    {/* Orders Tab */}
                    <TabPanel value={tabValue} index={2}>
                        <Box sx={{ px: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6">Order Management</Typography>
                                <FormControl sx={{ minWidth: 200 }}>
                                    <InputLabel>Filter by Status</InputLabel>
                                    <Select
                                        value={orderStatusFilter}
                                        label="Filter by Status"
                                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                                    >
                                        <MenuItem value="">All Orders</MenuItem>
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="completed">Completed</MenuItem>
                                        <MenuItem value="fulfilled">Fulfilled</MenuItem>
                                        <MenuItem value="cancelled">Cancelled</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {loadingOrders ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <CircularProgress />
                            </Box>
                            ) : (
                                <>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Order ID</TableCell>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Total</TableCell>
                                                    <TableCell>Items</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {orders.map((order) => (
                                                    <TableRow key={order.id}>
                                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                                            {order.id.substring(0, 8)}...
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(order.created_at).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>${order.total_price.toFixed(2)}</TableCell>
                                                        <TableCell>{order.items.length}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={order.status}
                                                                size="small"
                                                                color={getStatusColor(order.status)}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {order.status === 'pending' && (
                                                                <>
                                                                    <IconButton
                                                                        size="small"
                                                                        color="success"
                                                                        onClick={() =>
                                                                            handleUpdateOrderStatus(order.id, 'fulfilled')
                                                                        }
                                                                        title="Fulfill Order"
                                                                    >
                                                                        <CheckCircle fontSize="small" />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        size="small"
                                                                        color="error"
                                                                        onClick={() =>
                                                                            handleUpdateOrderStatus(order.id, 'cancelled')
                                                                        }
                                                                        title="Cancel Order"
                                                                    >
                                                                        <Cancel fontSize="small" />
                                                                    </IconButton>
                                                                </>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <TablePagination
                                        component="div"
                                        count={ordersTotal}
                                        page={ordersPage}
                                        onPageChange={(_, newPage) => setOrdersPage(newPage)}
                                        rowsPerPage={ordersPerPage}
                                        onRowsPerPageChange={(e) => {
                                            setOrdersPerPage(parseInt(e.target.value, 10));
                                            setOrdersPage(0);
                                        }}
                                    />
                                </>
                            )}
                            </Box>
                    </TabPanel>
                </Card>

                {/* Product Dialog */}
                <Dialog
                    open={productDialogOpen}
                    onClose={handleCloseProductDialog}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        elevation: 0,
                        sx: { border: 1, borderColor: 'divider' },
                    }}
                >
                    <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
                            <TextField
                                label="Title"
                                fullWidth
                                required
                                value={productForm.title}
                                onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                            />
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={productForm.description}
                                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            />
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <TextField
                                    label="Price"
                                    fullWidth
                                    required
                                    type="number"
                                    value={productForm.price}
                                    onChange={(e) =>
                                        setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })
                                    }
                                />
                                <TextField
                                    label="Stock"
                                    fullWidth
                                    required
                                    type="number"
                                    value={productForm.stock}
                                    onChange={(e) =>
                                        setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })
                                    }
                                />
                            </Box>

                            {editingProduct && (
                                <Box>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <ImageIcon fontSize="small" />
                                            Product Images
                                        </Typography>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            size="small"
                                            startIcon={<CloudUpload />}
                                            sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                                        >
                                            Upload Image
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </Button>
                                    </Box>

                                    {editingProduct.images && editingProduct.images.length > 0 ? (
                                        <Box
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                                gap: 2,
                                            }}
                                        >
                                            {editingProduct.images.map((image, index) => {
                                                const imageUrl = getImageUrl(image.path) || '';
                                                return (
                                                    <Box
                                                        key={image.id}
                                                        sx={{
                                                            position: 'relative',
                                                            borderRadius: 1,
                                                            overflow: 'hidden',
                                                            border: 1,
                                                            borderColor: 'divider',
                                                            aspectRatio: '1/1',
                                                        }}
                                                    >
                                                        <img
                                                            src={imageUrl}
                                                            alt={`Product ${index + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                            }}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.style.display = 'none';
                                                                if (target.parentElement) {
                                                                    target.parentElement.style.display = 'flex';
                                                                    target.parentElement.style.alignItems = 'center';
                                                                    target.parentElement.style.justifyContent = 'center';
                                                                    target.parentElement.style.background = '#f5f5f5';
                                                                    const icon = document.createElement('div');
                                                                    icon.innerHTML = '🖼️';
                                                                    icon.style.fontSize = '32px';
                                                                    target.parentElement.appendChild(icon);
                                                                }
                                                            }}
                                                        />
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 4,
                                                                right: 4,
                                                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(255, 255, 255, 1)',
                                                                },
                                                            }}
                                                            onClick={() => handleImageDelete(image.id)}
                                                        >
                                                            <Delete fontSize="small" color="error" />
                                                        </IconButton>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                                            No images uploaded yet
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseProductDialog}>Cancel</Button>
                        <Button
                            onClick={handleSaveProduct}
                            variant="contained"
                            sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                        >
                            {editingProduct ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}
