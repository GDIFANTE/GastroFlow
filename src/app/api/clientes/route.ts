import { NextResponse } from "next/server";
import { getdb } from "@/lib/mongodb";

export async function GET() {
  const db = await getdb();
  const docs = await db.collection("clientes").find().toArray();
  return NextResponse.json(docs);
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = await getdb();
  const r = await db.collection("clientes").insertOne(body);
  return NextResponse.json({ insertedId: r.insertedId });
}
