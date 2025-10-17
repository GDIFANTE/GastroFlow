// src/app/api/clientes/route.ts
import { getdb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// 🔹 GET — lista clientes (usado em /clientes e /relatorios)
export async function GET() {
  try {
    const db = await getdb();
    const col = db.collection("clientes");

    const lista = await col
      .find({}, { projection: { nome: 1, telefone: 1, email: 1, endereco: 1 } })
      .sort({ nome: 1 })
      .toArray();

    return NextResponse.json(lista);
  } catch (e) {
    console.error("Erro ao listar clientes:", e);
    return NextResponse.json({ error: "Erro ao listar clientes" }, { status: 500 });
  }
}

// 🔹 POST — cria novo cliente (usado em /clientes/novo)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, telefone, endereco, email } = body || {};

    if (!nome || typeof nome !== "string") {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }

    const db = await getdb();
    const col = db.collection("clientes");

    await col.insertOne({
      nome: nome.trim(),
      telefone: telefone ?? "",
      endereco: endereco ?? "",
      email: email ?? "",
      criadoEm: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro ao criar cliente:", e);
    return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 });
  }
}
