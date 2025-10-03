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
    Grid,
} from '@mui/material';
import {
    Palette,
    TrendingUp,
    ShoppingCart,
    People,
    Save,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGetMe } from '../hooks';
import { useTheme } from '../contexts/ThemeContext';
import { themeConfigs, type ThemeName } from '../themes';
import { postAdminTheme } from '../api/admin';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { data: userData, loading: userLoading, error: userError } = useGetMe();
    const { themeName, refetchTheme } = useTheme();

    const [selectedTheme, setSelectedTheme] = useState<ThemeName>(themeName);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="lg" sx={{ display: 'grid', gap: 3 }}>
                <Box sx={{ display: 'grid', gap: 1 }}>
                    <Typography variant="h3" sx={{ letterSpacing: 0.2 }}>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage appearance, analytics, and operations.
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

                <Card variant="outlined" sx={{ ...panel }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
                                MenuProps={{ PaperProps: { elevation: 0, sx: { border: 1, borderColor: 'divider' } } }}
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
                            {selectedTheme !== themeName && <> • <strong style={{ color: 'orange' }}>Unsaved changes</strong></>}
                        </Typography>
                    </Box>
                </Card>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
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
                                $0.00
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Coming soon: Real-time sales analytics
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper variant="outlined" sx={statPanel}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={iconBadge}>
                                    <ShoppingCart fontSize="small" />
                                </Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Orders
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                0
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Coming soon: Order management dashboard
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper variant="outlined" sx={statPanel}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={iconBadge}>
                                    <People fontSize="small" />
                                </Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Users
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                0
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Coming soon: User management tools
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Card variant="outlined" sx={{ ...panel, p: 3.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Coming Soon
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ ...panel, p: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    Sales Analytics
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Detailed sales reports, revenue tracking, and performance metrics
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ ...panel, p: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    Order Management
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    View, filter, and manage customer orders in real-time
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ ...panel, p: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    User Management
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Manage user accounts, roles, and permissions
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ ...panel, p: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    Analytics Dashboard
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Comprehensive charts and graphs for business insights
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </Box>
    );
}
