import { NextResponse } from "next/server";
import { getdb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET ?tipo=sobremesa  (find)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tipo = searchParams.get("tipo");
  const db = await getdb();
  const query = tipo ? { tipo } : {};
  const docs = await db.collection("produtos").find(query).toArray();
  return NextResponse.json(docs);
}

// POST (insert)
export async function POST(req: Request) {
  const body = await req.json();
  const db = await getdb();
  const r = await db.collection("produtos").insertOne(body);
  return NextResponse.json({ insertedId: r.insertedId });
}

// PUT (update preço de um produto)  body: { id, preco }
export async function PUT(req: Request) {
  const { id, preco } = await req.json();
  const db = await getdb();
  const r = await db.collection("produtos").updateOne(
    { _id: new ObjectId(id) },
    { $set: { preco } }
  );
  return NextResponse.json({ matched: r.matchedCount, modified: r.modifiedCount });
}

// DELETE (excluir um produto) body: { id }
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const db = await getdb();
  const r = await db.collection("produtos").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ deleted: r.deletedCount });
}
