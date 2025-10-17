// scripts/seed.ts
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { MongoClient, ObjectId } from "mongodb";

type RawPedido = {
  cliente: string;
  pedido: string[]; // nomes dos itens
  total: number;
  status: string;
};

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB || "gastroflow";

if (!MONGODB_URI) {
  console.error("Defina MONGODB_URI no .env.local");
  process.exit(1);
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  const srcPath = path.join(process.cwd(), "data", "restaurante.json");
  const raw = fs.readFileSync(srcPath, "utf8");
  const pedidosRaw: RawPedido[] = JSON.parse(raw);

  const clientesCol = db.collection("clientes");
  const cardapioCol = db.collection("cardapio");
  const pedidosCol = db.collection("pedidos");

  // 1) CLIENTES (distinct por nome)
  const nomes = Array.from(new Set(pedidosRaw.map((p) => p.cliente.trim())));
  const clientesMap = new Map<string, ObjectId>();

  for (const nome of nomes) {
    const res = await clientesCol.findOneAndUpdate(
      { nome },
      { $setOnInsert: { nome } },
      { upsert: true, returnDocument: "after" }
    );
    // @ts-ignore
    const _id: ObjectId = res._id ?? res.value?._id;
    clientesMap.set(nome, _id);
  }

  // 2) CARDÁPIO (distinct por nome do item)
  const nomesItens = Array.from(
    new Set(pedidosRaw.flatMap((p) => p.pedido).map((s) => s.trim()))
  );
  const produtosMap = new Map<string, { _id: ObjectId; preco: number }>();

  for (const nome of nomesItens) {
    const res = await cardapioCol.findOneAndUpdate(
      { nome },
      {
        $setOnInsert: {
          nome,
          preco: 0,           
          tipo: "Principal",  
        },
      },
      { upsert: true, returnDocument: "after" }
    );
    // @ts-ignore
    const doc = res.value ?? res;
    produtosMap.set(nome, { _id: doc._id, preco: doc.preco ?? 0 });
  }

  // 3) PEDIDOS (referenciando cliente e itens do cardápio)
  for (const p of pedidosRaw) {
    const clienteId = clientesMap.get(p.cliente);
    if (!clienteId) continue;

    // compacta itens iguais em {produtoId, nome, qtd, preco, subtotal}
    const counts = new Map<string, number>();
    p.pedido.forEach((nome) =>
      counts.set(nome, (counts.get(nome) ?? 0) + 1)
    );

    const items = Array.from(counts.entries()).map(([nome, qtd]) => {
      const prod = produtosMap.get(nome)!;
      const preco = prod?.preco ?? 0;
      return {
        produtoId: prod._id,
        nome,
        qtd,
        preco,
        subtotal: qtd * preco,
      };
    });

    await pedidosCol.insertOne({
      cliente: p.cliente,
      clienteId,
      items,             
      total: p.total,   
      status: p.status,
      data: new Date(),  
    });
  }

  console.log("Seed concluído com sucesso.");
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
