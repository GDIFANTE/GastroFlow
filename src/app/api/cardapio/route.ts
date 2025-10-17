import { getdb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// 🔹 GET – listar todos os itens do cardápio
export async function GET() {
  try {
    const db = await getdb();
    const col = db.collection("cardapio");

    const itens = await col
      .find({}, { projection: { nome: 1, preco: 1, tipo: 1, descricao: 1 } })
      .sort({ nome: 1 })
      .toArray();

    return NextResponse.json(itens);
  } catch (e) {
    console.error("Erro no GET /api/cardapio:", e);
    return NextResponse.json({ error: "Erro ao listar cardápio" }, { status: 500 });
  }
}

// 🔹 PATCH – atualizar vários itens do cardápio
export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      console.error("Body inválido:", body);
      return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
    }

    const db = await getdb();
    const col = db.collection("cardapio");

    for (const item of body) {
      if (!item.id) continue;
      const { id, ...dados } = item;

      await col.updateOne(
        { _id: new ObjectId(id) },
        { $set: dados }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro no PATCH /api/cardapio:", e);
    return NextResponse.json({ error: "Erro ao atualizar cardápio" }, { status: 500 });
  }
}
