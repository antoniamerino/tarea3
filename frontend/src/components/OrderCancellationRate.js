import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BASE_URL = process.env.REACT_APP_API_URL;

function OrderCancellationRate() {
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [cancellationRate, setCancellationRate] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/order-cancellation-rate`)
      .then(response => {
        setOrderStatusData(response.data);
        const cancelledOrders = response.data.find(status => status.order_status === 'cancelled')?.count || 0;
        const totalOrders = response.data.reduce((sum, status) => sum + status.count, 0);
        setCancellationRate((cancelledOrders / totalOrders) * 100);
      })
      .catch(error => {
        console.error('Error al obtener datos de tasas de cancelación de órdenes:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        8. ¿Cuál es la tasa de devoluciones (cancelaciones) de productos?
      </Typography>
      {cancellationRate !== null && (
        <Typography variant="body1" gutterBottom>
          La tasa de devoluciones (cancelaciones) de productos es del {cancellationRate.toFixed(2)}%.
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={orderStatusData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="order_status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default OrderCancellationRate;