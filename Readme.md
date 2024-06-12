# Dashboard de Análisis de Compras

Este proyecto es un dashboard de análisis de compras que utiliza React para el frontend y Node.js para el backend. El dashboard muestra varios gráficos que proporcionan información sobre las compras, clientes y productos en un ecommerce.

## Proceso ETL

### Extracción

1. **Descarga de archivos desde el bucket de almacenamiento**:
   - Se obtienen archivos JSON y CSV desde un bucket de almacenamiento especificado.
   - Los archivos se descargan y su contenido se convierte en cadena.

### Transformación

2. **Transformación y almacenamiento de datos**:
   - **Productos**:
     - Se verifica que el `objectID` y el `name` no sean vacíos para asegurar que todos los productos tengan identificadores y nombres válidos.
     - Se asegura que no se almacenen productos con `objectID` repetidos utilizando un conjunto para rastrear los IDs únicos y evitar duplicados.
     - Se omiten productos que no cumplan con estos criterios, imprimiendo un mensaje en la consola para cada omisión.
     - Se truncan los nombres de los productos a 25 caracteres para facilitar su visualización en el dashboard.
   - **Órdenes**:
     - Se rellenan los campos numéricos con 0 y los campos de texto con una cadena vacía si su valor es 'NA'.
     - Se verifica que el `order_id`, `product_id` y `customer_id` no sean vacíos.
     - Se eliminan filas con valores negativos en los campos numéricos.
     - No se eliminan las órdenes que tienen un `product_id` que no tiene correspondencia en `objectID` de los productos. Estas órdenes se consideran válidas porque representan compras reales, aunque no se pueda obtener información detallada del producto. Mantener estas órdenes asegura que no se pierda información valiosa. En los gráficos donde se necesita el nombre del producto, solo se usan las órdenes con `product_id` que tengan un `objectID` correspondiente en el archivo de productos. Para los gráficos donde no se requiere información adicional de los productos, estas órdenes se incluyen en los cálculos.

### Carga

3. **Carga de datos**:
   - Los datos transformados y limpios se almacenan en archivos JSON (`products.json` y `orders.json`) en un directorio específico de datos.
   - Antes de procesar nuevos datos, se limpia el directorio de datos para asegurar que solo se almacenen datos actualizados y válidos.

### Actualización de Datos Manual

Para permitir a los usuarios actualizar los datos manualmente en el dashboard, se ha implementado un botón "Actualizar Datos" que está conectado con el endpoint `/api/data`. Esto proporciona una manera fácil y directa para que los usuarios soliciten una actualización de los datos en cualquier momento.

Cuando el usuario hace clic en el botón "Actualizar Datos", se muestra una superposición borrosa que indica que la actualización está en progreso. Una vez completada la actualización, la superposición desaparece y los datos actualizados se muestran en el dashboard.

## Gráficos del Dashboard

Todos los gráficos del dashboard tienen la opción de ver el detalle de cada barra pasando el cursor por encima para una mejor visualización de la información.

### 1. Producto más comprado

**Descripción**: Este gráfico muestra los productos más comprados basados en la cantidad de compras.

**Datos mostrados**:
- Eje Y: Nombre del producto (truncado a 25 caracteres)
- Eje X: Cantidad de compras

**Justificación**: Se agrupa por `product_id` y se suma la cantidad de productos comprados (`quantity`) en todas las órdenes de ese producto.

### 2. Categoría de producto más popular

**Descripción**: Este gráfico muestra las categorías de producto más populares basadas en la cantidad de compras.

**Datos mostrados**:
- Eje X: Categoría del producto
- Eje Y: Cantidad de compras

**Justificación**: Se agrupa por categoría (`product_category`) y se suma la cantidad de productos comprados (`quantity`) en todas las órdenes de esa categoría.

### 3. Cliente que ha realizado más compras

**Descripción**: Este gráfico muestra los clientes que han realizado más compras.

**Datos mostrados**:
- Eje Y: ID del cliente
- Eje X: Cantidad de compras

**Justificación**: Se agrupa por cliente (`customer_id`) y se suma la cantidad de productos comprados (`quantity`) en todas las órdenes de ese cliente.

### 4. Cantidad total gastada por el cliente que más ha gastado

**Descripción**: Este gráfico muestra la cantidad total gastada por los clientes.

**Datos mostrados**:
- Eje X: ID del cliente
- Eje Y: Cantidad total gastada

**Justificación**: Se agrupa por cliente (`customer_id`) y se suma el monto pagado (`payment` multiplicado por `quantity`) en todas las órdenes de ese cliente.

### 5. Calificación promedio de los productos comprados

**Descripción**: Este gráfico muestra la calificación promedio de los productos comprados.

**Datos mostrados**:
- Eje X: Nombre del producto (truncado a 25 caracteres)
- Eje Y: Calificación promedio

**Justificación**: Se agrupa por `product_id` y se calcula el promedio de las calificaciones (`rating`) en todas las órdenes de ese producto.

### 6. Distribución de los métodos de pago utilizados

**Descripción**: Este gráfico muestra la distribución de los métodos de pago utilizados en las compras.

**Datos mostrados**:
- Categorías: Método de pago
- Tamaño: Cantidad de compras con ese método

**Justificación**: Se agrupa por método de pago (`payment_type`) y se cuenta la cantidad de órdenes que utilizaron cada método, asegurándose de no contar más de una vez el mismo `order_id`.

### 7. Ciudad con más compras realizadas

**Descripción**: Este gráfico muestra las ciudades con más compras realizadas.

**Datos mostrados**:
- Categorías: Ciudades
- Tamaño: Cantidad de compras de esa ciudad

**Justificación**: Se agrupa por ciudad (`customer_city`) y se cuenta la cantidad de órdenes en cada ciudad, asegurándose de no contar más de una vez el mismo `order_id`. Solo se muestran las 10 ciudades con más compras, agrupando el resto como "Otras".

### 8. Tasa de devoluciones (cancelaciones) de productos

**Descripción**: Este gráfico muestra la tasa de devoluciones de productos.

**Datos mostrados**:
- Eje X: Estado de la orden
- Eje Y: Cantidad de compras

**Justificación**: Se agrupa por estado de la orden (`order_status`) y se cuenta la cantidad de órdenes en cada estado, asegurándose de no contar más de una vez el mismo `order_id`.

### 9. Peso promedio de los productos comprados

**Descripción**: Este gráfico muestra el peso promedio de los productos comprados.

**Datos mostrados**:
- Eje X: Nombre del producto (truncado a 25 caracteres)
- Eje Y: Peso promedio

**Justificación**: Se agrupa por `product_id` y se calcula el promedio del peso (`product_weight_g`) en todas las órdenes de ese producto.

### 10. Ventas a lo largo del tiempo

**Descripción**: Este gráfico muestra la cantidad de ventas a lo largo del tiempo.

**Datos mostrados**:
- Eje X: Timestamp
- Eje Y: Cantidad de compras

**Justificación**: Se agrupan las órdenes por `timestamp` y se cuenta la cantidad de compras realizadas en cada intervalo de tiempo.

---

## Bibliografía

- Documentación de React: https://reactjs.org/docs/getting-started.html
- Documentación de Node.js: https://nodejs.org/en/docs/
- Documentación de Express: https://expressjs.com/
- Documentación de Recharts: https://recharts.org/en-US/api
- Documentación de MUI (Material-UI): https://mui.com/
- ChatGPT: Asistencia en la comprensión y estructura del código, interfaz gráfica, actualización periódica de datos y soporte para dudas técnicas.