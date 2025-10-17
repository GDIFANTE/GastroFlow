// src/app/api/clientes/[id]/route.ts
import { getdb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// 🔹 GET – retorna 1 cliente
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getdb();
    const cliente = await db
      .collection("clientes")
      .findOne({ _id: new ObjectId(params.id) });
    return NextResponse.json(cliente);
  } catch (e) {
    console.error("Erro no GET cliente:", e);
    return NextResponse.json(
      { error: "Erro ao buscar cliente" },
      { status: 500 }
    );
  }
}

// 🔹 PATCH – atualiza cliente existente
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const db = await getdb();
    await db
      .collection("clientes")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: body });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro no PATCH cliente:", e);
    return NextResponse.json(
      { error: "Erro ao atualizar cliente" },
      { status: 500 }
    );
  }
}
