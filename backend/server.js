const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { extractData } = require('./dataService');

const app = express();
const PORT = process.env.PORT || 5000;

// Permitir CORS para todas las rutas y orígenes
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('/api/data', async (req, res) => {
  console.log('Petición recibida para /api/data');
  try {
    await extractData();
    res.send('Datos extraídos y transformados correctamente');
  } catch (error) {
    console.error('Error al extraer datos:', error);
    res.status(500).send('Error al extraer datos');
  }
});

app.get('/api/products', (req, res) => {
  const productsPath = path.join(__dirname, 'data', 'products.json');
  if (fs.existsSync(productsPath)) {
    const products = fs.readFileSync(productsPath, 'utf-8');
    res.json(JSON.parse(products));
  } else {
    res.status(404).send('Archivo de productos no encontrado');
  }
});

app.get('/api/orders', (req, res) => {
  const ordersPath = path.join(__dirname, 'data', 'orders.json');
  if (fs.existsSync(ordersPath)) {
    const orders = fs.readFileSync(ordersPath, 'utf-8');
    res.json(JSON.parse(orders));
  } else {
    res.status(404).send('Archivo de órdenes no encontrado');
  }
});

app.get('/api/most-purchased-products', (req, res) => {
  const ordersPath = path.join(__dirname, 'data', 'orders.json');
  const productsPath = path.join(__dirname, 'data', 'products.json');
  
  if (fs.existsSync(ordersPath) && fs.existsSync(productsPath)) {
    const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

    const productQuantities = orders.reduce((acc, order) => {
      if (acc[order.product_id]) {
        acc[order.product_id] += parseInt(order.quantity, 10);
      } else {
        acc[order.product_id] = parseInt(order.quantity, 10);
      }
      return acc;
    }, {});

    const productNames = products.reduce((acc, product) => {
      acc[product.objectID] = product.name;
      return acc;
    }, {});

    const sortedProductQuantities = Object.entries(productQuantities)
      .filter(([product_id]) => productNames[product_id]) // Omitir productos sin nombre
      .map(([product_id, quantity]) => ({
        product_id,
        quantity,
        name: productNames[product_id]
      }))
      .sort((a, b) => b.quantity - a.quantity);

    res.json(sortedProductQuantities);
  } else {
    res.status(404).send('Archivo de órdenes o productos no encontrado');
  }
});

app.get('/api/most-popular-categories', (req, res) => {
  const ordersPath = path.join(__dirname, 'data', 'orders.json');
  if (fs.existsSync(ordersPath)) {
    const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));

    // Agrupar por product_category y sumar la cantidad de productos comprados para cada categoría
    const categoryQuantities = orders.reduce((acc, order) => {
      acc[order.product_category] = (acc[order.product_category] || 0) + parseInt(order.quantity, 10);
      return acc;
    }, {});

    // Convertir el objeto en un array de objetos y ordenar por cantidad de productos comprados
    const sortedCategoryQuantities = Object.entries(categoryQuantities)
      .map(([product_category, quantity]) => ({ product_category, quantity }))
      .sort((a, b) => b.quantity - a.quantity);

    res.json(sortedCategoryQuantities);
  } else {
    res.status(404).send('Archivo de órdenes no encontrado');
  }
});
  
app.get('/api/most-frequent-customers', (req, res) => {
  const ordersPath = path.join(__dirname, 'data', 'orders.json');
  if (fs.existsSync(ordersPath)) {
    const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
    
    const customerQuantities = orders.reduce((acc, order) => {
      acc[order.customer_id] = (acc[order.customer_id] || 0) + 1;
      return acc;
    }, {});

    const sortedCustomerQuantities = Object.entries(customerQuantities)
      .map(([customer_id, quantity]) => ({ customer_id, quantity }))
      .sort((a, b) => b.quantity - a.quantity);

    res.json(sortedCustomerQuantities);
  } else {
    res.status(404).send('Archivo de órdenes no encontrado');
  }
});

app.get('/api/top-spending-customers', (req, res) => {
    const ordersPath = path.join(__dirname, 'data', 'orders.json');
    if (fs.existsSync(ordersPath)) {
      const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
  
      // Agrupar por customer_id y sumar la cantidad total gastada (payment * quantity)
      const customerSpending = orders.reduce((acc, order) => {
        const totalSpent = parseFloat(order.payment) * parseInt(order.quantity, 10);
        acc[order.customer_id] = (acc[order.customer_id] || 0) + totalSpent;
        return acc;
      }, {});
  
      // Convertir el objeto en un array de objetos y ordenar por cantidad total gastada
      const sortedCustomerSpending = Object.entries(customerSpending)
        .map(([customer_id, totalSpent]) => ({ customer_id, totalSpent }))
        .sort((a, b) => b.totalSpent - a.totalSpent);
  
      res.json(sortedCustomerSpending);
    } else {
      res.status(404).send('Archivo de órdenes no encontrado');
    }
});

app.get('/api/average-rating-products', (req, res) => {
  const ordersPath = path.join(__dirname, 'data', 'orders.json');
  const productsPath = path.join(__dirname, 'data', 'products.json');

  if (fs.existsSync(ordersPath) && fs.existsSync(productsPath)) {
    const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

    const productNames = products.reduce((acc, product) => {
      acc[product.objectID] = product.name;
      return acc;
    }, {});

    const ratingData = orders.reduce((acc, order) => {
      if (productNames[order.product_id]) {
        if (!acc[order.product_id]) {
          acc[order.product_id] = { name: productNames[order.product_id], totalRating: 0, count: 0 };
        }
        acc[order.product_id].totalRating += parseInt(order.rating, 10);
        acc[order.product_id].count += 1;
      }
      return acc;
    }, {});

    const averageRatingData = Object.values(ratingData).map(item => ({
      name: item.name,
      averageRating: item.totalRating / item.count,
    }));

    res.json(averageRatingData);
  } else {
    res.status(404).send('Archivo de órdenes o productos no encontrado');
  }
});

app.get('/api/average-rating', (req, res) => {
    const ordersPath = path.join(__dirname, 'data', 'orders.json');
    if (fs.existsSync(ordersPath)) {
      const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
  
      // Filtrar órdenes con calificación válida
      const validRatings = orders.filter(order => order.rating !== null && order.rating !== undefined && order.rating !== '');
  
      if (validRatings.length > 0) {
        // Calcular el promedio de las calificaciones de todos los productos en las órdenes válidas
        const totalRating = validRatings.reduce((acc, order) => {
          return acc + parseInt(order.rating, 10);
        }, 0);
  
        const averageRating = totalRating / validRatings.length;
  
        res.json({ averageRating });
      } else {
        console.log('No valid ratings found.');
        res.json({ averageRating: 0 });
      }
    } else {
      console.log('Orders file not found.');
      res.status(404).send('Archivo de órdenes no encontrado');
    }
  });
  
  app.get('/api/payment-method-distribution', (req, res) => {
    const ordersPath = path.join(__dirname, 'data', 'orders.json');
    if (fs.existsSync(ordersPath)) {
      const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
  
      const uniqueOrders = Array.from(new Set(orders.map(order => order.order_id)));
      const paymentMethodCounts = uniqueOrders.reduce((acc, order_id) => {
        const order = orders.find(o => o.order_id === order_id);
        if (order) {
          acc[order.payment_type] = (acc[order.payment_type] || 0) + 1;
        }
        return acc;
      }, {});
  
      const paymentMethodDistribution = Object.entries(paymentMethodCounts)
        .map(([payment_type, count]) => ({ payment_type, count }));
  
      res.json(paymentMethodDistribution);
    } else {
      res.status(404).send('Archivo de órdenes no encontrado');
    }
  });
  
  app.get('/api/order-cancellation-rate', (req, res) => {
    const ordersPath = path.join(__dirname, 'data', 'orders.json');
    if (fs.existsSync(ordersPath)) {
      const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
  
      const uniqueOrders = Array.from(new Set(orders.map(order => order.order_id)));
      const orderStatusCounts = uniqueOrders.reduce((acc, order_id) => {
        const order = orders.find(o => o.order_id === order_id);
        if (order) {
          acc[order.order_status] = (acc[order.order_status] || 0) + 1;
        }
        return acc;
      }, {});
  
      const orderStatusDistribution = Object.entries(orderStatusCounts)
        .map(([order_status, count]) => ({ order_status, count }));
  
      res.json(orderStatusDistribution);
    } else {
      res.status(404).send('Archivo de órdenes no encontrado');
    }
  });
  
app.get('/api/average-product-weight', (req, res) => {
  const ordersPath = path.join(__dirname, 'data', 'orders.json');
  const productsPath = path.join(__dirname, 'data', 'products.json');
  
  if (fs.existsSync(ordersPath) && fs.existsSync(productsPath)) {
    const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    
    const productWeights = orders.reduce((acc, order) => {
      const product = products.find(p => p.objectID === order.product_id);
      if (product) {
        if (!acc[order.product_id]) {
          acc[order.product_id] = { weight: 0, count: 0, name: product.name };
        }
        acc[order.product_id].weight += parseFloat(order.product_weight_g);
        acc[order.product_id].count += 1;
      }
      return acc;
    }, {});

    const averageWeights = Object.entries(productWeights).map(([product_id, data]) => ({
      product_id,
      averageWeight: data.weight / data.count,
      name: data.name
    }));

    res.json(averageWeights);
  } else {
    res.status(404).send('Archivo de órdenes o productos no encontrado');
  }
});

app.get('/api/city-purchases', (req, res) => {
    const ordersPath = path.join(__dirname, 'data', 'orders.json');
    if (fs.existsSync(ordersPath)) {
      const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
  
      const uniqueOrders = Array.from(new Set(orders.map(order => order.order_id)));
      const cityPurchaseCounts = uniqueOrders.reduce((acc, order_id) => {
        const order = orders.find(o => o.order_id === order_id);
        if (order) {
          acc[order.customer_city] = (acc[order.customer_city] || 0) + 1;
        }
        return acc;
      }, {});
  
      let cityPurchases = Object.entries(cityPurchaseCounts)
        .map(([customer_city, count]) => ({ customer_city, count }))
        .sort((a, b) => b.count - a.count);
  
      const topCities = cityPurchases.slice(0, 10);
      const otherCitiesCount = cityPurchases.slice(10).reduce((acc, city) => acc + city.count, 0);
  
      if (otherCitiesCount > 0) {
        topCities.push({ customer_city: 'Otras', count: otherCitiesCount });
      }
  
      res.json(topCities);
    } else {
      res.status(404).send('Archivo de órdenes no encontrado');
    }
  });  

  app.get('/api/sales-over-time', (req, res) => {
    const ordersPath = path.join(__dirname, 'data', 'orders.json');
    if (fs.existsSync(ordersPath)) {
      const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
  
      const salesOverTime = orders.reduce((acc, order) => {
        const date = new Date(order.timestamp).toISOString().split('T')[0]; // Formato YYYY-MM-DD
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += 1;
        return acc;
      }, {});
  
      const salesData = Object.entries(salesOverTime)
        .map(([date, count]) => ({
          timestamp: date,
          count
        }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
      res.json(salesData);
    } else {
      res.status(404).send('Archivo de órdenes no encontrado');
    }
  });  
  
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});