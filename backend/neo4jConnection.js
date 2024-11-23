require('dotenv').config();
const neo4j = require('neo4j-driver');

let driver;

async function connectNeo4j() {
    try {
        console.log('Conectando a Neo4j...');
        driver = neo4j.driver(
            process.env.NEO4J_URI,
            neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
        );
        await driver.verifyConnectivity();
        console.log('Conectado a Neo4j');
    } catch (error) {
        console.error('Error al conectar a Neo4j:', error.message);
        throw error;
    }
}

function getNeo4jDriver() {
    return driver;
}

module.exports = {
    connectNeo4j,
    getNeo4jDriver
};
