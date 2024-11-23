const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

async function testNeo4jConnection() {
    const session = driver.session();
    try {
        await driver.verifyConnectivity();
        console.log("Conectado a Neo4j");
    } catch (error) {
        console.error("Error conectando a Neo4j:", error);
    } finally {
        await session.close();
        await driver.close();
    }
}

testNeo4jConnection();