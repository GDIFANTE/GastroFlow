import { NextResponse } from "next/server";
import { getdb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const db = await getdb();
  const doc = await db.collection("produtos").findOne({ _id: new ObjectId(params.id) });
  if (!doc) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const db = await getdb();
  const r = await db.collection("produtos")
    .updateOne({ _id: new ObjectId(params.id) }, { $set: body });
  return NextResponse.json({ matched: r.matchedCount, modified: r.modifiedCount });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const db = await getdb();
  const r = await db.collection("produtos").deleteOne({ _id: new ObjectId(params.id) });
  return NextResponse.json({ deleted: r.deletedCount });
}
