import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const BASE_URL = process.env.REACT_APP_API_URL;

function TopSpendingCustomers() {
  const [customerSpendingData, setCustomerSpendingData] = useState([]);
  const [topSpendingCustomer, setTopSpendingCustomer] = useState(null);
  const [topSpendingAmount, setTopSpendingAmount] = useState(0);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/top-spending-customers`)
      .then(response => {
        console.log('Datos recibidos:', response.data); // Verificar los datos recibidos
        
        // Ordenar los datos en el frontend
        const sortedData = response.data.sort((a, b) => b.totalSpent - a.totalSpent);
        setCustomerSpendingData(sortedData);

        if (sortedData.length > 0) {
          setTopSpendingCustomer(sortedData[0].customer_id);
          setTopSpendingAmount(sortedData[0].totalSpent);
        }
      })
      .catch(error => {
        console.error('Error al obtener datos de los clientes que más gastan:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        4. ¿Cuál es la cantidad total gastada por el cliente que más ha gastado?
      </Typography>
      {topSpendingCustomer && (
        <Typography variant="body1" gutterBottom>
          El cliente que más ha gastado es ID: {topSpendingCustomer} con un total de ${topSpendingAmount.toFixed(2)} gastado.
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={customerSpendingData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="customer_id" label={{ value: 'ID del Cliente', position: 'insideBottomRight', offset: -10 }} />
          <YAxis label={{ value: 'Total Gastado ($)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSpent" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default TopSpendingCustomers;