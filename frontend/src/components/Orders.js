import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
const BASE_URL = process.env.REACT_APP_API_URL;

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/orders`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error al obtener órdenes:', error);
      });
  }, []);

  return (
    <Container>
      <h1>Lista de Órdenes</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer ID</TableCell>
              <TableCell>Product ID</TableCell>
              <TableCell>Categoría del Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio MRP</TableCell>
              <TableCell>Pago</TableCell>
              <TableCell>Fecha y Hora</TableCell>
              <TableCell>Calificación</TableCell>
              <TableCell>Tipo de Pago</TableCell>
              <TableCell>Estado de la Orden</TableCell>
              <TableCell>Ciudad del Cliente</TableCell>
              <TableCell>Estado del Cliente</TableCell>
              <TableCell>Ciudad del Vendedor</TableCell>
              <TableCell>Estado del Vendedor</TableCell>
              <TableCell>Cuotas de Pago</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={`${order.order_id}-${order.customer_id}-${order.product_id}`}>
                <TableCell>{order.order_id}</TableCell>
                <TableCell>{order.customer_id}</TableCell>
                <TableCell>{order.product_id}</TableCell>
                <TableCell>{order.product_category}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.price_MRP}</TableCell>
                <TableCell>{order.payment}</TableCell>
                <TableCell>{order.timestamp}</TableCell>
                <TableCell>{order.rating}</TableCell>
                <TableCell>{order.payment_type}</TableCell>
                <TableCell>{order.order_status}</TableCell>
                <TableCell>{order.customer_city}</TableCell>
                <TableCell>{order.customer_state}</TableCell>
                <TableCell>{order.seller_city}</TableCell>
                <TableCell>{order.seller_state}</TableCell>
                <TableCell>{order.payment_installments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Orders;