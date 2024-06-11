import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BASE_URL = process.env.REACT_APP_API_URL;

function MostPurchasedProducts() {
  const [data, setData] = useState([]);
  const [mostPurchased, setMostPurchased] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/most-purchased-products`)
      .then(response => {
        setData(response.data);
        if (response.data.length > 0) {
          setMostPurchased(response.data[0].name);
        }
      })
      .catch(error => {
        console.error('Error al obtener datos de productos más comprados:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        1. ¿Cuál es el producto más comprado?
      </Typography>
      {mostPurchased && (
        <Typography variant="body1" gutterBottom>
          El producto más comprado es: {mostPurchased}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,  // Aumentar el margen izquierdo
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            label={{ value: 'Cantidad de compras', position: 'insideBottomRight', offset: -10 }} 
            allowDecimals={false}  // Mostrar solo números enteros
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            label={{ value: 'Nombre del producto', angle: 0, position: 'insideTop', offset: -20, dx: 180 }} // Mover nombre del eje Y hacia la izquierda
            width={200}  // Aumentar el ancho para visualizar mejor los nombres completos
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default MostPurchasedProducts;