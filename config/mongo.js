const mongodb = require('mongodb');
const client = mongodb.MongoClient;

exports.connectToDB = async function() {
    try {
        const conn = await client.connect(process.env.DB_URL, { useNewUrlParser: true});
        return conn.db(process.env.DB_NAME);
    } catch (error) {
        throw error;
    }
}