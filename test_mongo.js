const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);

async function testMongoConnection() {
    try {
        await client.connect();
        console.log("Conectado a MongoDB");
        const db = client.db('providencias_db');
        const collection = db.collection('providencias');
        const count = await collection.countDocuments();
        console.log(`Total documentos en la colección: ${count}`);
    } catch (error) {
        console.error("Error conectando a MongoDB:", error);
    } finally {
        client.close();
    }
}

testMongoConnection();
