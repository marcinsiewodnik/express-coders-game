const { MongoClient } = require('mongodb');

// Running in porduction and running for testing purposes 

let url = process.env.DBURL || 'mongodb://localhost:27017';
let dbName = process.env.DBNAME || 'quiz-test';

let client = null;

function resetClient() {

    client = null;
};

function getClient() {

    if (client === null) {

        throw new Error('Not connected to the database');

    } else {

        return client;
    }
}

exports.connect = async () => {

    client = await MongoClient.connect(url, { useUnifiedTopology: true });

    console.log("Connected to database");
}

exports.getDb = () => {

    const client = getClient();
    return client.db(dbName);
}

exports.drop = async () => {

    const client = getClient();
    const db = client.db(dbName);
    await db.dropDatabase();
}

exports.disconnect = async () => {

    const client = getClient();
    await client.close();
    resetClient();

    console.log("Disconnected from database!")
}
