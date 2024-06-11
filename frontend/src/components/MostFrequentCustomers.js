import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const BASE_URL = process.env.REACT_APP_API_URL;

function MostFrequentCustomers() {
  const [customerData, setCustomerData] = useState([]);
  const [mostFrequentCustomer, setMostFrequentCustomer] = useState(null);
  const [mostFrequentCustomerQuantity, setMostFrequentCustomerQuantity] = useState(0);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/most-frequent-customers`)
      .then(response => {
        setCustomerData(response.data);
        if (response.data.length > 0) {
          setMostFrequentCustomer(response.data[0].customer_id);
          setMostFrequentCustomerQuantity(response.data[0].quantity);
        }
      })
      .catch(error => {
        console.error('Error al obtener datos de clientes más frecuentes:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        3. ¿Cuál es el cliente que ha realizado más compras?
      </Typography>
      {mostFrequentCustomer && (
        <Typography variant="body1" gutterBottom>
          El cliente que ha realizado más compras es ID: {mostFrequentCustomer} con {mostFrequentCustomerQuantity} compras
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          layout="vertical"
          data={customerData}
          margin={{
            top: 20, right: 30, left: 100, bottom: 5,  // Aumentar el margen izquierdo
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            label={{ value: 'Cantidad de compras', position: 'insideBottomRight', offset: -10 }} 
            allowDecimals={false}
          />
          <YAxis 
            type="category" 
            dataKey="customer_id" 
            label={{ value: 'ID del cliente', angle: 0, position: 'insideTop', offset: -20 }} 
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default MostFrequentCustomers;