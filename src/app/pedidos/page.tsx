import { ObjectId } from "mongodb";
import { getdb } from "@/lib/mongodb";
import FilterBar from "./FilterBar";
import { OrderList } from "@/app/components/OrderList";

type PedidoDoc = {
  _id: ObjectId;
  cliente: string;
  total: number;
  status: string;
};

function idToTime(oid: ObjectId): string {
  const d = oid.getTimestamp();
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function normalizeStatusForUI(s: string): "Em preparo" | "Pronto" | "Entregue" {
  if (s === "em preparo") return "Em preparo";
  if (s === "entregue") return "Entregue";
  return "Pronto"; // “pronto” e “finalizado”
}

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: { cliente?: string; status?: string };
}) {
  const db = await getdb();
  const col = db.collection<PedidoDoc>("restaurante");

  // --- Opções de filtro vindas do banco ---
  const clientes = (await col.distinct("cliente"))
    .filter((c): c is string => typeof c === "string")
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  // status distintos (pode vir “finalizado”)
  const rawStatuses = (await col.distinct("status")).filter(
    (s): s is string => typeof s === "string"
  );
  // opções que exibiremos
  const statusOptions: Array<{ value: string; label: string }> = [
    { value: "", label: "Todos" },
    { value: "em preparo", label: "Em preparo" },
    { value: "pronto", label: "Pronto/Finalizado" }, // 'pronto' cobre 'finalizado'
    { value: "entregue", label: "Entregue" },
  ].filter((opt) =>
    opt.value === ""
      ? true
      : opt.value === "pronto"
      ? rawStatuses.some((s) => s === "pronto" || s === "finalizado")
      : rawStatuses.includes(opt.value)
  );

  // --- Monta filtro da consulta ---
  const query: any = {};
  if (searchParams.cliente?.trim()) {
    query.cliente = searchParams.cliente.trim(); // seleção exata via <select>
  }
  if (searchParams.status) {
    if (searchParams.status === "pronto") {
      query.status = { $in: ["pronto", "finalizado"] };
    } else {
      query.status = searchParams.status;
    }
  }

  const docs = await col
    .find(query, { projection: { cliente: 1, total: 1, status: 1 } })
    .sort({ _id: -1 })
    .toArray();

  const orders = docs.map((o) => ({
    id: o._id.toString(),
    cliente: o.cliente,
    hora: idToTime(o._id),
    total: o.total,
    status: normalizeStatusForUI(o.status),
  }));

  return (
    <main className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-white">Pedidos</h1>

      <FilterBar
        clientes={clientes}
        statuses={statusOptions}
        initialCliente={searchParams.cliente ?? ""}
        initialStatus={searchParams.status ?? ""}
      />

      <section className="lg:col-span-2">
        <OrderList orders={orders} />
      </section>
    </main>
  );
}
