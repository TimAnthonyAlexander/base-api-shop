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
                <Alert severity="error" sx={{ mb: 2 }}>
                    Please log in as an administrator to access this page.
                </Alert>
                <Button variant="contained" onClick={() => navigate('/auth')}>
                    Go to Login
                </Button>
            </Container>
        );
    }

    const user = (userData?.data as any)?.user || (userData?.data as any);

    if (user?.role !== 'admin') {
        return null; // Will redirect in useEffect
    }

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

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your store's appearance, view analytics, and oversee operations.
                    </Typography>
                </Box>

                {successMessage && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {successMessage}
                    </Alert>
                )}

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {errorMessage}
                    </Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Theme Selector Card */}
                    <Card sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Palette sx={{ fontSize: 32, mr: 2, color: 'secondary.main' }} />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Theme Settings
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Choose the theme that all users will see
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
                            <Box sx={{ flex: 1, width: '100%' }}>
                                <FormControl fullWidth>
                                    <InputLabel>Select Theme</InputLabel>
                                    <Select
                                        value={selectedTheme}
                                        label="Select Theme"
                                        onChange={(e) => setSelectedTheme(e.target.value as ThemeName)}
                                    >
                                        {themeConfigs.map((config) => (
                                            <MenuItem key={config.name} value={config.name}>
                                                <Box>
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
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: 'auto' }, minWidth: { md: 200 } }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    startIcon={<Save />}
                                    onClick={handleSaveTheme}
                                    disabled={saving || selectedTheme === themeName}
                                >
                                    {saving ? 'Saving...' : 'Apply Theme'}
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                <strong>Current Theme:</strong> {themeConfigs.find(c => c.name === themeName)?.label || 'Luxury'}
                                {selectedTheme !== themeName && (
                                    <> • <strong style={{ color: 'orange' }}>Unsaved changes</strong></>
                                )}
                            </Typography>
                        </Box>
                    </Card>

                    {/* Stats Overview */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                        <Paper
                            sx={{
                                p: 3,
                                flex: 1,
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUp sx={{ fontSize: 28, mr: 1.5, color: 'secondary.main' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Total Sales
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
                                $0.00
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Coming soon: Real-time sales analytics
                            </Typography>
                        </Paper>

                        <Paper
                            sx={{
                                p: 3,
                                flex: 1,
                                background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.1) 0%, rgba(244, 114, 182, 0.05) 100%)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ShoppingCart sx={{ fontSize: 28, mr: 1.5, color: 'secondary.main' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Orders
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
                                0
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Coming soon: Order management dashboard
                            </Typography>
                        </Paper>

                        <Paper
                            sx={{
                                p: 3,
                                flex: 1,
                                background: 'linear-gradient(135deg, rgba(132, 204, 22, 0.1) 0%, rgba(132, 204, 22, 0.05) 100%)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <People sx={{ fontSize: 28, mr: 1.5, color: 'secondary.main' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Users
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
                                0
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Coming soon: User management tools
                            </Typography>
                        </Paper>
                    </Box>

                    {/* Coming Soon Sections */}
                    <Card sx={{ p: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                            Coming Soon
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                    📊 Sales Analytics
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Detailed sales reports, revenue tracking, and performance metrics
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                    📦 Order Management
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    View, filter, and manage customer orders in real-time
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                    👥 User Management
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Manage user accounts, roles, and permissions
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                    📈 Analytics Dashboard
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Comprehensive charts and graphs for business insights
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}

