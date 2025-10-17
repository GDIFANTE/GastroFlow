import { getdb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updates: any = {};

    if (typeof body.preco === "number") updates.preco = body.preco;
    if (typeof body.tipo === "string" || body.tipo === undefined)
      updates.tipo = body.tipo ?? null;

    const db = await getdb();
    const r = await db
      .collection("cardapio")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: updates });

    return Response.json({ matched: r.matchedCount, modified: r.modifiedCount });
  } catch (e: any) {
    return new Response(e?.message ?? "Erro", { status: 500 });
  }
}
