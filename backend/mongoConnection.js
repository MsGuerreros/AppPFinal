require('dotenv').config();
const { MongoClient } = require('mongodb');

let db;

async function connectMongoDB() {
    try {
        const client = new MongoClient(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        await client.connect();
        db = client.db('providencias_db');
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error.message);
    }
}

function getMongoDB() {
    return db;
}

module.exports = { connectMongoDB, getMongoDB };
