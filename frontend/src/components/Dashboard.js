import React from 'react';
import { Container } from '@mui/material';
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

function Dashboard() {
  return (
    <Container>
      <h1>Dashboard</h1>
      <h3>Si no aparece nada, espere 3 minutos y recargue que los datos se estan cargando</h3>
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
    </Container>
  );
}

export default Dashboard;