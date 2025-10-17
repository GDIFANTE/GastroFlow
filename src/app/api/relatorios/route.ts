import { getdb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clienteFiltro = searchParams.get("cliente");

    const db = await getdb();
    const pedidos = db.collection("pedidos");

    const match: any = {};
    if (clienteFiltro) match.cliente = clienteFiltro;

    const resultado = await pedidos
      .aggregate([
        { $match: match },
        {
          $group: {
            _id: "$cliente",
            totalGasto: { $sum: "$total" },
            qtdPedidos: { $sum: 1 },
          },
        },
        { $sort: { totalGasto: -1 } },
      ])
      .toArray();

    return NextResponse.json(resultado);
  } catch (e) {
    console.error("Erro ao gerar relatório:", e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
