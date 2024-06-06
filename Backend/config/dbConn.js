const { MongoClient } = require('mongodb');

const uri = process.env.DATABASE_URI;
const dbName = 'MantraCareDB';

class Database {
    constructor() {
        this.client = new MongoClient(uri,/* { useNewUrlParser: true, useUnifiedTopology: true } */);
        this.db = null;
    }

    connectToDB = async () => {
        try {
            await this.client.connect();
            this.db = this.client.db(dbName);
            console.log('Connected to the database' );
        } catch (error) {
            console.error(`Error connecting to the database: ${error}`);
        }
    }

    getDB() {
        if (!this.db) {
            throw new Error('Database not initialized. Call connectToDB first.');
        }
        return this.db
    }

    async closeConnection() {
        if (this.client) {
            await this.client.close();
            console.log('MongoDB connection closed');
        }
    }
}



module.exports = Database;