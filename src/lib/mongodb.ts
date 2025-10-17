// src/lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

let cachedClient: MongoClient | null = (global as any)._mongoClient ?? null;
let cachedDb: Db | null = (global as any)._mongoDb ?? null;

export async function getdb(): Promise<Db> {
  if (cachedDb) return cachedDb;

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
    (global as any)._mongoClient = cachedClient;
  }

  cachedDb = cachedClient.db(dbName);
  (global as any)._mongoDb = cachedDb;
  return cachedDb;
}
