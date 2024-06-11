import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const BASE_URL = process.env.REACT_APP_API_URL;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE02', '#FF3D67', '#8884d8', '#82ca9d', '#FF8C00', '#FF6347', '#40E0D0'];

function PaymentMethodDistribution() {
  const [paymentData, setPaymentData] = useState([]);
  const [topPaymentMethod, setTopPaymentMethod] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/payment-method-distribution`)
      .then(response => {
        setPaymentData(response.data);
        if (response.data.length > 0) {
          const topMethod = response.data.reduce((prev, current) => (prev.count > current.count) ? prev : current);
          setTopPaymentMethod(topMethod);
        }
      })
      .catch(error => {
        console.error('Error al obtener datos de métodos de pago:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        6. ¿Cuál es la distribución de los métodos de pago utilizados?
      </Typography>
      {topPaymentMethod && (
        <Typography variant="body1" gutterBottom>
          El método de pago más utilizado es {topPaymentMethod.payment_type}, utilizado {topPaymentMethod.count} veces.
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={paymentData}
            dataKey="count"
            nameKey="payment_type"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {paymentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default PaymentMethodDistribution;