import { NextResponse } from "next/server";
import { getdb } from "@/lib/mongodb";

export async function GET() {
  const db = await getdb();
  const pipeline = [
    { $group: { _id: "$cliente", totalGasto: { $sum: "$total" }, pedidos: { $sum: 1 } } },
    { $sort: { totalGasto: -1 } }
  ];
  const rows = await db.collection("pedidos").aggregate(pipeline).toArray();
  return NextResponse.json(rows);
}
