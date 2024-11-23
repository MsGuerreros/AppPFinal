require('dotenv').config();
const express = require('express');
const { connectMongoDB, getMongoDB } = require('./mongoConnection');
const { connectNeo4j, getNeo4jDriver } = require('./neo4jConnection');

const app = express();
const port = 3000;

let db, neo4jDriver;

// Inicializar conexiones a MongoDB y Neo4j
(async () => {
    await connectMongoDB();
    db = getMongoDB();
    await connectNeo4j();
    neo4jDriver = getNeo4jDriver();
})();

app.use(express.json());

app.get('/api/providencia/:nombre', async (req, res) => {
    const nombre = req.params.nombre;
    const result = await db.collection('providencias').findOne({ providencia: nombre });
    res.json(result || { error: "No encontrado" });
});

app.get('/api/tipo/:tipo', async (req, res) => {
    const tipo = req.params.tipo;
    const results = await db.collection('providencias').find({ tipo }).toArray();
    res.json(results);
});

app.get('/api/anio/:anio', async (req, res) => {
    const anio = req.params.anio;
    const results = await db.collection('providencias').find({ anio }).toArray();
    res.json(results);
});

app.get('/api/texto', async (req, res) => {
    const query = req.query.query;
    const results = await db.collection('providencias').find({ $text: { $search: query } }).toArray();
    res.json(results);
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
