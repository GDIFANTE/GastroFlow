// src/app/api/pedidos/route.ts
import { getdb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// 🔹 POST – cria um novo pedido
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await getdb();
    const pedidos = db.collection("pedidos");

    await pedidos.insertOne({
      ...body,
      data: body?.data ? new Date(body.data) : new Date(), // garante Date
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro ao criar pedido:", e);
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}

// 🔹 GET – lista pedidos, com suporte a ?limit= e ?status=
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = Number(searchParams.get("limit"));
    const status = searchParams.get("status");

    // limite seguro (default 50, máx 100)
    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(limitParam, 100)
        : 50;

    const match: any = {};
    if (status) match.status = status;

    const db = await getdb();
    const pedidos = await db
      .collection("pedidos")
      .find(match, { projection: { cliente: 1, total: 1, status: 1, data: 1, numero: 1 } })
      .sort({ data: -1 }) // mais recentes primeiro
      .limit(limit)
      .toArray();

    return NextResponse.json(pedidos);
  } catch (e) {
    console.error("Erro ao listar pedidos:", e);
    return NextResponse.json(
      { error: "Erro ao listar pedidos" },
      { status: 500 }
    );
  }
}
