import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://admin:test1234@cluster0.rljem.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "sma";

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return { client: cachedClient, db: cachedClient.db(dbName) };
  }

  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;

  return { client, db: client.db(dbName) };
}
