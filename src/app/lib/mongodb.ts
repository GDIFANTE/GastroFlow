// src/lib/mongodb.ts
import { MongoClient, Db, Collection } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;
const collName = process.env.MONGODB_COLLECTION!;

// Evita múltiplas conexões em dev (hot reload)
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

export async function getCollection<T extends Document = Document>(): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(collName);
}
