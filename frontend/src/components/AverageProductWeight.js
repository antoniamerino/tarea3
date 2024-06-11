import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const BASE_URL = process.env.REACT_APP_API_URL;

function AverageProductWeight() {
  const [productWeightData, setProductWeightData] = useState([]);
  const [overallAverageWeight, setOverallAverageWeight] = useState(0);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/average-product-weight`)
      .then(response => {
        const data = response.data;
        setProductWeightData(data);

        // Calcular el peso promedio general
        const totalWeight = data.reduce((sum, product) => sum + product.averageWeight, 0);
        const averageWeight = totalWeight / data.length;
        setOverallAverageWeight(averageWeight);
      })
      .catch(error => {
        console.error('Error al obtener datos de peso promedio de productos:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        9. ¿Cuál es el peso promedio de los productos comprados?
      </Typography>
      <Typography variant="body1" gutterBottom>
        El peso promedio de todos los productos es {overallAverageWeight.toFixed(2)} gramos. Para ver el peso promedio de cada producto se muestra el grafico:
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={productWeightData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" label={{ value: 'Nombre del producto', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Peso promedio (g)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="averageWeight" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default AverageProductWeight;