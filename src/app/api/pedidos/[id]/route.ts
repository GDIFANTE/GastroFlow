// src/app/api/pedidos/[id]/route.ts
import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type Params = { params: { id: string } };

// PATCH = update parcial (ex.: { "status": "finalizado" })
export async function PATCH(req: Request, { params }: Params) {
  const body = await req.json();
  const coll = await getCollection();

  const r = await coll.updateOne(
    { _id: new ObjectId(params.id) },
    { $set: body }
  );

  return NextResponse.json({ matched: r.matchedCount, modified: r.modifiedCount });
}

// PUT = replace (substitui o documento inteiro)
export async function PUT(req: Request, { params }: Params) {
  const body = await req.json();
  const coll = await getCollection();

  // por segurança garante o mesmo _id
  body._id = new ObjectId(params.id);

  const r = await coll.replaceOne(
    { _id: new ObjectId(params.id) },
    body
  );

  return NextResponse.json({ matched: r.matchedCount, replaced: r.modifiedCount });
}

// GET = obter 1 documento
export async function GET(_: Request, { params }: Params) {
  const coll = await getCollection();
  const doc = await coll.findOne({ _id: new ObjectId(params.id) });
  if (!doc) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(doc);
}

// DELETE = remoção
export async function DELETE(_: Request, { params }: Params) {
  const coll = await getCollection();
  const r = await coll.deleteOne({ _id: new ObjectId(params.id) });
  return NextResponse.json({ deleted: r.deletedCount });
}
