// src/app/api/clientes/route.ts
import { getdb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getdb();
    const clientes = db.collection("clientes");

    const lista = await clientes
      .find({}, { projection: { nome: 1 } })
      .sort({ nome: 1 })
      .toArray();

    // 🔹 Retorna apenas nomes simples (para relatórios)
    const nomes = lista
      .map((c) => c.nome)
      .filter((n) => typeof n === "string");

    return NextResponse.json(nomes);
  } catch (e) {
    console.error("Erro ao buscar clientes:", e);
    return NextResponse.json({ error: "Erro ao buscar clientes" }, { status: 500 });
  }
}
