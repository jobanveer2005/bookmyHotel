const mongoose = require('mongoose');
require('dotenv').config();

let memoryServerInstance = null;

async function startInMemoryMongoIfNeeded() {
    const useMemoryDb = String(process.env.USE_MEMORY_DB || '').toLowerCase() === 'true';
    if (!useMemoryDb) return null;

    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    memoryServerInstance = mongod;
    return memUri;
}

const connectDB = async () => {
    const configuredUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookmyhotel';
    let uriToUse = configuredUri;

    try {
        // If explicitly requested, prefer in-memory first
        const memUri = await startInMemoryMongoIfNeeded();
        if (memUri) uriToUse = memUri;

        await mongoose.connect(uriToUse);
        console.log(`MongoDB Connected${memoryServerInstance ? ' (in-memory)' : ''}...`);
    } catch (primaryErr) {
        console.error(`Primary MongoDB connection failed: ${primaryErr.message}`);

        // Fallback: try in-memory if not already attempted
        if (!memoryServerInstance) {
            try {
                const { MongoMemoryServer } = require('mongodb-memory-server');
                const mongod = await MongoMemoryServer.create();
                const memUri = mongod.getUri();
                memoryServerInstance = mongod;
                await mongoose.connect(memUri);
                console.log('MongoDB Connected (in-memory fallback)...');
                return;
            } catch (fallbackErr) {
                console.error(`In-memory MongoDB fallback failed: ${fallbackErr.message}`);
            }
        }

        process.exit(1);
    }
};

module.exports = connectDB;