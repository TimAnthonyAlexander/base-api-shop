import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    Container,
    IconButton,
    Badge,
} from '@mui/material';
import { ShoppingCart, Person, AdminPanelSettings } from '@mui/icons-material';
import { useGetMe } from '../hooks';
import { useEffect, useState } from 'react';
import { getBasket } from '../client';

export default function Layout() {
    const navigate = useNavigate();

    const { data: meData } = useGetMe(undefined, { enabled: true });
    const isAuthenticated = !!meData;
    const user = (meData?.data as any)?.user || (meData?.data as any);
    const isAdmin = user?.role === 'admin';

    const [basketCount, setBasketCount] = useState(0);

    useEffect(() => {
        if (!isAuthenticated) {
            setBasketCount(0);
            return;
        }

        let inFlight = false;
        const tick = async () => {
            if (inFlight || document.visibilityState !== 'visible') return;
            inFlight = true;
            try {
                const res = await getBasket();
                const count = (res as any)?.data?.items?.length ?? 0;
                setBasketCount(prev => (prev !== count ? count : prev));
            } finally {
                inFlight = false;
            }
        };

        tick();
        const id = window.setInterval(tick, 3000);
        const onFocus = () => tick();
        const onVisibility = () => {
            if (document.visibilityState === 'visible') tick();
        };

        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            clearInterval(id);
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [isAuthenticated]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                        <Typography
                            variant="h5"
                            component={RouterLink}
                            to="/"
                            sx={{
                                fontWeight: 700,
                                color: 'primary.main',
                                textDecoration: 'none',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Shop
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Button
                                component={RouterLink}
                                to="/"
                                sx={{ color: 'text.primary', display: { xs: 'none', sm: 'inline-flex' } }}
                            >
                                Home
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/orders"
                                sx={{ color: 'text.primary', display: { xs: 'none', sm: 'inline-flex' } }}
                            >
                                Orders
                            </Button>

                            {isAdmin && (
                                <Button
                                    component={RouterLink}
                                    to="/admin"
                                    startIcon={<AdminPanelSettings />}
                                    sx={{
                                        color: 'text.primary',
                                        display: { xs: 'none', md: 'inline-flex' },
                                        fontWeight: 600,
                                    }}
                                >
                                    Admin
                                </Button>
                            )}

                            <IconButton component={RouterLink} to="/basket" sx={{ color: 'text.primary' }}>
                                <Badge badgeContent={basketCount} color="secondary">
                                    <ShoppingCart />
                                </Badge>
                            </IconButton>

                            <IconButton
                                onClick={() => navigate(isAuthenticated ? '/me' : '/auth')}
                                sx={{ color: 'text.primary' }}
                            >
                                <Person />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Box component="main" sx={{ flex: 1 }}>
                <Outlet />
            </Box>

            <Box
                component="footer"
                sx={{
                    py: 6,
                    px: 2,
                    mt: 'auto',
                    bgcolor: 'background.paper',
                    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                }}
            >
                <Container maxWidth="xl">
                    <Typography variant="body2" color="text.secondary" align="center">
                        Shop by Tim Anthony Alexander
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
                        Built with{' '}
                        <Typography
                            component="a"
                            variant="body2"
                            href="https://github.com/TimAnthonyAlexander/base-api"
                            target="_blank"
                            rel="noopener"
                            sx={{
                                color: 'secondary.main',
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' },
                            }}
                        >
                            BaseAPI
                        </Typography>
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}
