const { storage, bucketName } = require('./config');
const fs = require('fs');
const path = require('path');

// Función principal del proceso ETL
async function extractData() {
  console.log('Iniciando extracción de datos...');
  await cleanDataDirectory(); // Limpiar directorio de datos antes de comenzar
  await listFiles(); // Listar y procesar archivos
  console.log('Extracción de datos completada.');
}

// Limpiar directorio de datos
async function cleanDataDirectory() {
  const dataDir = path.join(__dirname, 'data');
  if (fs.existsSync(dataDir)) {
    fs.rmSync(dataDir, { recursive: true, force: true });
    console.log('Directorio de datos existente eliminado.');
  }
  fs.mkdirSync(dataDir);
  console.log('Nuevo directorio de datos creado.');
}

// Listar y descargar archivos del bucket
async function listFiles() {
  console.log('Iniciando la lista de archivos...');
  const bucket = storage.bucket(bucketName);
  try {
    const [files] = await bucket.getFiles();
    console.log('Archivos en el bucket:', files.map(file => file.name));

    // Primero, procesa los archivos de productos (JSON)
    for (const file of files) {
      if (file.name.endsWith('.json')) {
        console.log(`Descargando ${file.name}...`);
        const contents = await downloadFileAsString(file);
        console.log(`Contenido de ${file.name} descargado.`);
        await transformAndStoreData(file.name, contents);
      }
    }

    // Luego, procesa los archivos de órdenes (CSV)
    for (const file of files) {
      if (file.name.endsWith('.csv')) {
        console.log(`Descargando ${file.name}...`);
        const contents = await downloadFileAsString(file);
        console.log(`Contenido de ${file.name} descargado.`);
        await transformAndStoreData(file.name, contents);
      }
    }

    console.log('Todos los archivos han sido descargados y procesados.');
  } catch (error) {
    console.error('Error al listar los archivos:', error);
  }
}

// Descargar contenido del archivo como cadena
async function downloadFileAsString(file) {
  const [contents] = await file.download();
  return contents.toString();
}

// Función para truncar el nombre del producto
const truncateName = (name, length = 25) => {
  return name.length > length ? `${name.substring(0, length)}...` : name;
};

// Transformar y almacenar datos
async function transformAndStoreData(fileName, data) {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  if (fileName.endsWith('.json')) {
    console.log(`Procesando archivo JSON: ${fileName}`);
    const products = JSON.parse(data);
    const productIDs = new Set(); // Conjunto para almacenar IDs únicos de productos
    const transformedProducts = products.reduce((acc, product) => {
      // Verificar que el objectID y el name no sean vacíos y que el objectID sea único
      if (product.objectID && product.name && !productIDs.has(product.objectID)) {
        productIDs.add(product.objectID);
        acc.push({
          objectID: product.objectID,
          name: truncateName(product.name), // Truncar nombre del producto
          description: product.description || '',
          brand: product.brand || '',
          categories: product.categories || '',
          hierarchicalCategories: product.hierarchicalCategories || '',
          type: product.type || '',
          price: product.price || 0,
          price_range: product.price_range || '',
          image: product.image || '',
          url: product.url || '',
          free_shipping: product.free_shipping || false,
          popularity: product.popularity || 0,
          rating: product.rating || 0
        });
      } else {
        console.log(`Producto con ID ${product.objectID} o nombre vacío, o ID ya existe. No se almacenará.`);
      }
      return acc;
    }, []);
    console.log(`Productos transformados: ${transformedProducts.length}`);
    fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(transformedProducts, null, 2));
  } else if (fileName.endsWith('.csv')) {
    console.log(`Procesando archivo CSV: ${fileName}`);
    const lines = data.split('\n');
    const headers = lines[0].split(';');
    const transformedOrders = [];
    const productsPath = path.join(dataDir, 'products.json');
    const products = fs.existsSync(productsPath) ? JSON.parse(fs.readFileSync(productsPath, 'utf-8')) : [];
    const productIDs = new Set(products.map(product => product.objectID));

    for (let i = 1; i < lines.length; i++) {
      const orderData = lines[i].split(';');
      if (orderData.length === headers.length) {
        const order = {};
        headers.forEach((header, index) => {
          let value = orderData[index];
          // Rellenar con 0 si el valor es NA en campos numéricos, o con '' en campos de texto
          if (value === 'NA') {
            if (['quantity', 'rating', 'payment', 'product_weight_g', 'price_MRP', 'product_length_cm', 'product_height_cm', 'product_width_cm'].includes(header)) {
              value = 0;
            } else {
              value = '';
            }
          } else if (header === 'price_MRP' || header === 'payment') {
            value = value.replace(',', '.'); // Reemplazar coma por punto para convertir a float
          }
          order[header] = value;
        });

        // Verificar que el order_id, product_id y customer_id no sean vacíos
        if (order.order_id && order.product_id && order.customer_id) {
          transformedOrders.push(order);
        } else {
          console.log(`Orden con ID ${order.order_id} no se almacenará debido a order_id, product_id o customer_id vacío.`);
        }
      }
    }

    // Log de órdenes antes de limpieza
    console.log(`Órdenes transformadas antes de limpieza: ${transformedOrders.length}`);

    // Eliminar filas con valores negativos
    const cleanedOrders = transformedOrders.filter(order => {
      return (
        order.quantity >= 0 &&
        order.product_weight_g >= 0 &&
        order.price_MRP >= 0 &&
        order.payment >= 0
      );
    });

    // Log de órdenes después de limpieza
    console.log(`Órdenes después de limpieza: ${cleanedOrders.length}`);

    fs.writeFileSync(path.join(dataDir, 'orders.json'), JSON.stringify(cleanedOrders, null, 2));
  }
  console.log(`Datos transformados y almacenados para ${fileName}`);
}

module.exports = { extractData };