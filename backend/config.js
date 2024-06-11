const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

// Leer credenciales desde el archivo
const credsPath = path.join(__dirname, 'taller-integracion-310700-41f361102b8b.json');
const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));

// Inicializar el cliente de Google Cloud Storage con las credenciales
const storage = new Storage({ credentials: creds });

const bucketName = '2024-1-tarea-3';

module.exports = { storage, bucketName };