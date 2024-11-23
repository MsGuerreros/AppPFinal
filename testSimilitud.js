const fetch = require('node-fetch');

(async () => {
    try {
        const nombre = 'T-309-21'; // Reemplaza con un nombre válido
        const minSimilitud = 30;

        const response = await fetch(`http://localhost:3001/api/similitud/${nombre}?minSimilitud=${minSimilitud}`);
        const data = await response.json();

        console.log('Respuesta del servidor:', data);
    } catch (error) {
        console.error('Error probando el servidor de similitudes:', error.message);
    }
})();
