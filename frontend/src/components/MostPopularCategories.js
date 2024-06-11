import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BASE_URL = process.env.REACT_APP_API_URL;

function MostPopularCategories() {
  const [categoryData, setCategoryData] = useState([]);
  const [mostPopularCategory, setMostPopularCategory] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/most-popular-categories`)
      .then(response => {
        setCategoryData(response.data);
        if (response.data.length > 0) {
          setMostPopularCategory(response.data[0].product_category);
        }
      })
      .catch(error => {
        console.error('Error al obtener datos de categorías más populares:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        2. ¿Cuál es la categoría de producto más popular basada en las compras?
      </Typography>
      {mostPopularCategory && (
        <Typography variant="body1" gutterBottom>
          La categoría más popular es: {mostPopularCategory}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={categoryData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="product_category" 
            label={{ value: 'Categoría del producto', position: 'insideBottomRight', offset: -5 }} 
          />
          <YAxis 
            label={{ value: 'Cantidad de compras', angle: -90, position: 'insideLeft', offset: 0 }} 
            allowDecimals={false} 
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default MostPopularCategories;