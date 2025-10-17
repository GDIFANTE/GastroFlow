// src/app/api/pedidos/route.ts
import { getdb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// 🔹 POST – cria um novo pedido
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const db = await getdb();
    const pedidos = db.collection("pedidos");

    await pedidos.insertOne(body);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro ao criar pedido:", e);
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}

// 🔹 GET – lista pedidos (opcional)
export async function GET() {
  try {
    const db = await getdb();
    const pedidos = db.collection("pedidos");
    const lista = await pedidos.find().sort({ data: -1 }).toArray();
    return NextResponse.json(lista);
  } catch (e) {
    console.error("Erro ao listar pedidos:", e);
    return NextResponse.json(
      { error: "Erro ao listar pedidos" },
      { status: 500 }
    );
  }
}
