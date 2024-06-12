import React, { useState } from 'react';
import { Container, Button, Box, Typography, CircularProgress, Backdrop } from '@mui/material';
import axios from 'axios';
import MostPurchasedProducts from './MostPurchasedProducts';
import MostPopularCategories from './MostPopularCategories';
import MostFrequentCustomers from './MostFrequentCustomers';
import TopSpendingCustomers from './TopSpendingCustomers';
import AverageRatingProducts from './AverageRatingProducts';
import PaymentMethodsDistribution from './PaymentMethodsDistribution';
import CityWithMostPurchases from './CityWithMostPurchases';
import SalesOverTime from './SalesOverTime';
import OrderCancellationRate from './OrderCancellationRate';
import AverageProductWeight from './AverageProductWeight';

const BASE_URL = process.env.REACT_APP_API_URL;

function Dashboard() {
  const [loading, setLoading] = useState(false);

  const handleUpdateData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/data`);
      alert('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar datos:', error);
      alert('Error al actualizar datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h1" align="center" gutterBottom>
        Dashboard
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
        <Button variant="contained" color="primary" onClick={handleUpdateData} sx={{ mr: 2 }}>
          Actualizar Datos
        </Button>
        <Typography variant="body1">
          Haga clic en el botón para actualizar la información.
        </Typography>
      </Box>
      <MostPurchasedProducts />
      <MostPopularCategories />
      <MostFrequentCustomers />
      <TopSpendingCustomers />
      <AverageRatingProducts />
      <PaymentMethodsDistribution />
      <CityWithMostPurchases />
      <OrderCancellationRate />
      <AverageProductWeight />
      <SalesOverTime />

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Esperando a la actualización de los datos...
        </Typography>
      </Backdrop>
    </Container>
  );
}

export default Dashboard;