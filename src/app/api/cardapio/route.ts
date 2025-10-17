// src/app/api/cardapio/route.ts
import { NextResponse } from "next/server";
import { getdb } from "@/lib/mongodb";

export async function GET() {
  const db = await getdb();
  const docs = await db
    .collection("cardapio")
    .find({}, { projection: { nome: 1, preco: 1 } })
    .sort({ nome: 1 })
    .toArray();

  return NextResponse.json(
    docs.map((d) => ({ _id: String(d._id), nome: d.nome, preco: Number(d.preco) || 0 })),
  );
}
