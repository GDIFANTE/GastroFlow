// src/app/api/clientes/[id]/route.ts
import { getdb } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// 🔹 GET – retorna 1 cliente
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getdb();
    const doc = await db
      .collection("clientes")
      .findOne({ _id: new ObjectId(params.id) });

    if (!doc) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }

    return NextResponse.json(doc);
  } catch (e) {
    console.error("Erro GET cliente:", e);
    return NextResponse.json({ error: "Erro ao buscar cliente" }, { status: 500 });
  }
}

// 🔹 PATCH – atualiza cliente (ignora _id no $set)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    // Nunca tente setar _id
    // (remove _id do corpo, caso venha do front)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...update } = body ?? {};

    const db = await getdb();
    const r = await db
      .collection("clientes")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: update });

    if (r.matchedCount === 0) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, modified: r.modifiedCount });
  } catch (e) {
    console.error("Erro PATCH cliente:", e);
    return NextResponse.json({ error: "Erro ao atualizar cliente" }, { status: 500 });
  }
}

// 🔹 DELETE – (opcional)
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getdb();
    const r = await db
      .collection("clientes")
      .deleteOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({ deleted: r.deletedCount });
  } catch (e) {
    console.error("Erro DELETE cliente:", e);
    return NextResponse.json({ error: "Erro ao excluir cliente" }, { status: 500 });
  }
}
