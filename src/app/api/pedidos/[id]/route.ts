import { NextResponse } from "next/server";
import { getdb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const db = await getdb();
  const doc = await db.collection("pedidos").findOne({ _id: new ObjectId(params.id) });
  if (!doc) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(doc);
}

// atualização parcial
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const db = await getdb();
  const r = await db.collection("pedidos").updateOne(
    { _id: new ObjectId(params.id) },
    { $set: body }
  );
  return NextResponse.json({ matched: r.matchedCount, modified: r.modifiedCount });
}

// replace (troca o documento inteiro)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const db = await getdb();
  // garante que não mantém o _id no body
  delete (body as any)._id;
  const r = await db.collection("pedidos").replaceOne(
    { _id: new ObjectId(params.id) },
    body
  );
  return NextResponse.json({ matched: r.matchedCount, replaced: r.modifiedCount });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const db = await getdb();
  const r = await db.collection("pedidos").deleteOne({ _id: new ObjectId(params.id) });
  return NextResponse.json({ deleted: r.deletedCount });
}
