// src/app/api/relatorios/gasto-por-cliente/route.ts
import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET() {
  const coll = await getCollection();

  // Soma campo "total" por "cliente"
  const pipeline = [
    { $group: { _id: "$cliente", totalGasto: { $sum: "$total" }, pedidos: { $sum: 1 } } },
    { $sort: { totalGasto: -1 } }
  ];

  const data = await coll.aggregate(pipeline).toArray();
  return NextResponse.json(data);
}
