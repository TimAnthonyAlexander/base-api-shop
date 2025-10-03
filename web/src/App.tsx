import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import BasketPage from './pages/BasketPage';
import OrdersPage from './pages/OrdersPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="basket" element={<BasketPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="auth" element={<AuthPage />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
