// src/app/cardapio/page.tsx
import { getdb } from "@/lib/mongodb";
import CardapioClient from "../cardapio/CardapioClient";

import { ObjectId } from "mongodb";

type ItemDB = {
  _id: ObjectId;
  nome: string;
  preco: number;
  tipo?: string;
  descricao?: string;
};

export default async function Page() {
  const db = await getdb();
  const col = db.collection<ItemDB>("cardapio");

  const raw = await col
    .find({}, { projection: { nome: 1, preco: 1, tipo: 1, descricao: 1 } })
    .sort({ nome: 1 })
    .toArray();

  const items = raw.map((i) => ({
    id: i._id ? i._id.toString() : "",
    nome: i.nome,
    preco: Number(i.preco ?? 0),
    tipo: i.tipo ?? "",
    descricao: i.descricao ?? "",
  }));

  const tiposBanco = Array.from(
    new Set(raw.map((i) => (i.tipo ?? "").toLowerCase()).filter(Boolean))
  );

  return <CardapioClient items={items} tiposBanco={tiposBanco} />;
}
