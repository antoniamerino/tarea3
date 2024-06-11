import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
const BASE_URL = process.env.REACT_APP_API_URL;

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/products`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
      });
  }, []);

  return (
    <Container>
      <h1>Lista de Productos</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Categorías</TableCell>
              <TableCell>Categorías Jerárquicas</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Rango de Precio</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Envío Gratis</TableCell>
              <TableCell>Popularidad</TableCell>
              <TableCell>Calificación</TableCell>
              <TableCell>ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.name}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.categories.join(', ')}</TableCell>
                <TableCell>
                  {Object.values(product.hierarchicalCategories).join(' > ')}
                </TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.price_range}</TableCell>
                <TableCell>
                  <img src={product.image} alt={product.name} style={{ width: '50px' }} />
                </TableCell>
                <TableCell>
                  <a href={product.url} target="_blank" rel="noopener noreferrer">Ver Producto</a>
                </TableCell>
                <TableCell>{product.free_shipping ? 'Sí' : 'No'}</TableCell>
                <TableCell>{product.popularity}</TableCell>
                <TableCell>{product.rating}</TableCell>
                <TableCell>{product.objectID}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Products;
