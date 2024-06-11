import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const BASE_URL = process.env.REACT_APP_API_URL;

function SalesOverTime() {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/sales-over-time`)
      .then(response => {
        setSalesData(response.data);
      })
      .catch(error => {
        console.error('Error al obtener datos de ventas a lo largo del tiempo:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        10. Ventas a lo largo del tiempo
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={salesData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" label={{ value: 'Fecha', position: 'insideBottomRight', offset: 0 }} />
          <YAxis label={{ value: 'Cantidad de compras', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default SalesOverTime;