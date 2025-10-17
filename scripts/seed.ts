// scripts/seed.ts
import { readFileSync } from "fs";
import path from "path";
import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI!;
const dbName = process.env.DB_NAME || "gastroflow";

(async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const pedidos = JSON.parse(
    readFileSync(path.join(process.cwd(), "restaurante.json"), "utf-8")
  );
  await db.collection("pedidos").deleteMany({});
  await db.collection("pedidos").insertMany(pedidos);
  console.log("Seed ok!");
  await client.close();
})();
