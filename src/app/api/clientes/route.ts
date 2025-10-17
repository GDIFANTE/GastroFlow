// src/app/api/clientes/route.ts
import { getdb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// Retorna todos os clientes cadastrados (para o Novo Pedido)
export async function GET() {
  try {
    const db = await getdb();
    const clientes = db.collection("clientes");

    // Retorna apenas os campos necessários
    const lista = await clientes
      .find({}, { projection: { nome: 1, telefone: 1, email: 1 } })
      .sort({ nome: 1 })
      .toArray();

    // Envia a lista como JSON
    return NextResponse.json(lista);
  } catch (e) {
    console.error("Erro ao listar clientes:", e);
    return NextResponse.json(
      { error: "Erro ao listar clientes" },
      { status: 500 }
    );
  }
}
