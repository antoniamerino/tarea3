import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BASE_URL = process.env.REACT_APP_API_URL;

function AverageRatingProducts() {
  const [productRatingData, setProductRatingData] = useState([]);
  const [overallAverageRating, setOverallAverageRating] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/average-rating-products`)
      .then(response => {
        setProductRatingData(response.data);
      })
      .catch(error => {
        console.error('Error al obtener datos de calificación promedio de productos:', error);
      });

      axios.get(`${BASE_URL}/api/average-rating`)
      .then(response => {
        setOverallAverageRating(response.data.averageRating);
      })
      .catch(error => {
        console.error('Error al obtener el promedio de calificación:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        5. ¿Cuál es la calificación promedio de los productos comprados?
      </Typography>
      {overallAverageRating !== null ? (
        <Typography variant="body1" gutterBottom>
          La calificación promedio general de todos los productos es: {overallAverageRating.toFixed(2)}. El promedio específico para cada producto se detalla en el siguiente gráfico:
        </Typography>
      ) : (
        <Typography variant="body1" gutterBottom>
          No se pudo calcular la calificación promedio general.
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={productRatingData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" label={{ value: 'Nombre del Producto', position: 'insideBottomRight', offset: -10 }} />
          <YAxis label={{ value: 'Calificación Promedio', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="averageRating" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default AverageRatingProducts;