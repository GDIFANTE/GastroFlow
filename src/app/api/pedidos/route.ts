// src/app/api/pedidos/route.ts
import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status"); // ex: ?status=em%20preparo

  const coll = await getCollection();
  const filter: any = {};
  if (status) filter.status = status;

  const docs = await coll.find(filter).limit(100).toArray();
  return NextResponse.json(docs);
}

export async function POST(req: Request) {
  // insert (adicionar novo pedido/documento)
  const body = await req.json();
  const coll = await getCollection();

  const r = await coll.insertOne(body);
  return NextResponse.json({ insertedId: r.insertedId }, { status: 201 });
}
