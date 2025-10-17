import { NextResponse } from "next/server";
import { getdb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const db = await getdb();
  const r = await db.collection("clientes")
    .updateOne({ _id: new ObjectId(params.id) }, { $set: body });
  return NextResponse.json({ matched: r.matchedCount, modified: r.modifiedCount });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const db = await getdb();
  const r = await db.collection("clientes").deleteOne({ _id: new ObjectId(params.id) });
  return NextResponse.json({ deleted: r.deletedCount });
}
