// src/app/api/produtos/[id]/route.ts
import { NextResponse } from "next/server";
import { getdb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// 🔹 GET – busca produto pelo ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const db = await getdb();
  const doc = await db
    .collection("cardapio")
    .findOne({ _id: new ObjectId(params.id) });
  if (!doc)
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(doc);
}

// 🔹 PATCH – atualiza dados do produto
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const db = await getdb();
  const r = await db
    .collection("cardapio")
    .updateOne({ _id: new ObjectId(params.id) }, { $set: body });
  return NextResponse.json({
    matched: r.matchedCount,
    modified: r.modifiedCount,
  });
}

// 🔹 DELETE – exclui produto
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const db = await getdb();
  const r = await db
    .collection("cardapio")
    .deleteOne({ _id: new ObjectId(params.id) });
  return NextResponse.json({ deleted: r.deletedCount });
}
