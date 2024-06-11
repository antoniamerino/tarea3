import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BASE_URL = process.env.REACT_APP_API_URL;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE02', '#FF3D67', '#8884d8', '#82ca9d', '#FF8C00', '#FF6347', '#40E0D0'];

function CityWithMostPurchases() {
  const [cityPurchaseData, setCityPurchaseData] = useState([]);
  const [topCity, setTopCity] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/city-purchases`)
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          setCityPurchaseData(data);
          const citiesExcludingOthers = data.filter(city => city.customer_city !== 'Otras');
          if (citiesExcludingOthers.length > 0) {
            const topCity = citiesExcludingOthers.reduce((prev, current) => (prev.count > current.count) ? prev : current);
            setTopCity(topCity);
          }
        } else {
          console.error('Los datos de la ciudad no son un array:', data);
          setCityPurchaseData([]);
        }
      })
      .catch(error => {
        console.error('Error al obtener datos de compras por ciudad:', error);
        setCityPurchaseData([]);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        7. ¿Cuál es la ciudad con más compras realizadas?
      </Typography>
      {topCity && (
        <Typography variant="body1" gutterBottom>
          La ciudad con más compras realizadas es {topCity.customer_city} con {topCity.count} compras. La categoría "Otras" es un conjunto del resto de ciudades con menor cantidad de compras.
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={cityPurchaseData}
            dataKey="count"
            nameKey="customer_city"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {cityPurchaseData.map((entry, index) => (
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

export default CityWithMostPurchases;