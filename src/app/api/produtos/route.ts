// src/app/api/produtos/route.ts
import { NextResponse } from "next/server";
import { getdb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// 🔹 GET – lista produtos, opcionalmente filtrando por tipo
// Exemplo: /api/produtos?tipo=bebida
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tipo = searchParams.get("tipo");

  const db = await getdb();
  const query = tipo ? { tipo } : {};
  const produtos = await db
    .collection("cardapio")
    .find(query)
    .sort({ nome: 1 })
    .toArray();

  return NextResponse.json(produtos);
}

// 🔹 POST – cadastra novo produto
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.nome || !body.tipo || body.preco == null) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    const db = await getdb();
    const r = await db.collection("cardapio").insertOne({
      nome: body.nome,
      tipo: body.tipo,
      preco: Number(body.preco),
      descricao: body.descricao ?? "",
      criadoEm: new Date(),
    });

    return NextResponse.json({ insertedId: r.insertedId });
  } catch (e) {
    console.error("Erro ao inserir produto:", e);
    return NextResponse.json(
      { error: "Erro ao inserir produto" },
      { status: 500 }
    );
  }
}

// 🔹 PUT – atualiza o preço (ou outros dados)
export async function PUT(req: Request) {
  const { id, preco } = await req.json();
  const db = await getdb();
  const r = await db
    .collection("cardapio")
    .updateOne({ _id: new ObjectId(id) }, { $set: { preco } });
  return NextResponse.json({
    matched: r.matchedCount,
    modified: r.modifiedCount,
  });
}

// 🔹 DELETE – remove produto pelo id
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const db = await getdb();
  const r = await db
    .collection("cardapio")
    .deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ deleted: r.deletedCount });
}
