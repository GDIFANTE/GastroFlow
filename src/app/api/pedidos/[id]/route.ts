// src/app/api/pedidos/[id]/route.ts
import { getdb } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// (opcional) GET de um pedido específico
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getdb();
    const doc = await db.collection("pedidos").findOne({ _id: new ObjectId(params.id) });
    if (!doc) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    console.error("Erro GET /api/pedidos/[id]:", e);
    return NextResponse.json({ error: "Erro ao buscar pedido" }, { status: 500 });
  }
}

// DELETE — exclui um pedido
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getdb();
    const r = await db.collection("pedidos").deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ deleted: r.deletedCount });
  } catch (e) {
    console.error("Erro DELETE /api/pedidos/[id]:", e);
    return NextResponse.json({ error: "Erro ao excluir pedido" }, { status: 500 });
  }
}
