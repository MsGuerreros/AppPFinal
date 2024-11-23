require('dotenv').config();
const express = require('express');
const { connectNeo4j, getNeo4jDriver } = require('./neo4jConnection');

const app = express();
const port = 3001;
let neo4jDriver;

// Conexión a Neo4j
(async () => {
    await connectNeo4j();
    neo4jDriver = getNeo4jDriver();
    console.log("Conectado a Neo4j desde similitudServer.js");
})();

app.use(express.json());

// Ruta para buscar similitudes
app.get('/api/similitud/:nombre', async (req, res) => {
    const nombre = req.params.nombre;
    const similitudMinima = parseFloat(req.query.minSimilitud) || 0;

    try {
        const session = neo4jDriver.session();
        const result = await session.run(
            `MATCH (p1:Providencia {name: $nombre})-[r:SIMILAR]->(p2)
             WHERE r.index_simm >= $similitudMinima
             RETURN p1, p2, r.index_simm AS similitud`,
            { nombre, similitudMinima }
        );

        const similitudes = result.records.map(record => ({
            providencia1: record.get('p1').properties.name,
            providencia2: record.get('p2').properties.name,
            similitud: record.get('similitud'),
        }));

        res.json(similitudes);
    } catch (error) {
        console.error("Error en la búsqueda de similitudes:", error.message);
        res.status(500).json({ error: "Error en la búsqueda de similitudes" });
    }
});

app.listen(port, () => {
    console.log(`Servidor de Similitudes escuchando en el puerto ${port}`);
});
