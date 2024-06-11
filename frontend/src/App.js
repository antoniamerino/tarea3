import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Container, Button, Box } from '@mui/material';
import Products from './components/Products';
import Orders from './components/Orders';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Container>
        <Navigation />
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Container>
    </Router>
  );
}

function Navigation() {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <Button variant="contained" color="primary" component={Link} to="/products" sx={{ mx: 2 }}>
        Ver Productos
      </Button>
      <Button variant="contained" color="secondary" component={Link} to="/orders" sx={{ mx: 2 }}>
        Ver Órdenes
      </Button>
      <Button variant="contained" component={Link} to="/" sx={{ mx: 2 }}>
        Ver Dashboard
      </Button>
      <Button variant="contained" onClick={() => navigate(-1)} sx={{ mx: 2 }}>
        Volver Atrás
      </Button>
    </Box>
  );
}

export default App;