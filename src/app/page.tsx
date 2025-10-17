// src/app/page.tsx
import Link from "next/link";
import { ObjectId } from "mongodb";
import { getdb } from "@/lib/mongodb";

import { Stats } from "@/app/components/Stats";
import { OrderList } from "@/app/components/OrderList";
import { MenuList } from "@/app/components/MenuList";
import { QuickActions } from "@/app/components/QuickActions";

// Documento de pedidos no Mongo
type PedidoDoc = {
  _id: ObjectId;
  id?: number; // opcional: alguns docs podem ter esse campo
  cliente: string;
  pedido?: string[]; // não usamos aqui
  total: number;
  status: "em preparo" | "finalizado" | "entregue" | "pronto";
  data?: Date | string; // pode vir string
};

// Documento de itens do cardápio
type CardapioItem = {
  _id: ObjectId;
  nome: string;
  preco: number;
  tipo?: string;
  descricao?: string;
};

// Hora amigável (usa campo data ou timestamp do _id)
function docToTime(doc: { _id: ObjectId; data?: Date | string }) {
  const d =
    doc.data instanceof Date
      ? doc.data
      : typeof doc.data === "string"
      ? new Date(doc.data)
      : doc._id.getTimestamp();

  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// Gera um número curto legível caso não exista campo id
function shortNumericId(oid: ObjectId) {
  return parseInt(oid.toHexString().slice(-6), 16); // ex.: 583910
}

export default async function Home() {
  const db = await getdb();

  // ✅ coleções corretas
  const pedidosCol = db.collection<PedidoDoc>("pedidos");
  const cardapioCol = db.collection<CardapioItem>("cardapio");

  // -------- Pedidos recentes (10 últimos, apenas ativos) --------
  const recentOrders = await pedidosCol
    .find(
      { status: { $in: ["em preparo", "pronto"] } }, // apenas esses status
      { projection: { _id: 1, id: 1, cliente: 1, total: 1, status: 1, data: 1 } }
    )
    .sort({ data: -1, _id: -1 })
    .limit(10)
    .toArray();

  const orders = recentOrders.map((o) => ({
    // usa o campo id se existir; senão gera a partir do _id
    id: String(o.id ?? shortNumericId(o._id)),
    cliente: o.cliente,
    hora: docToTime(o),
    total: o.total,
    // mapeia para os rótulos usados pelo componente
    status:
      o.status === "em preparo"
        ? ("Em preparo" as const)
        : o.status === "entregue"
        ? ("Entregue" as const)
        : ("Pronto" as const),
  }));

  // -------- Cardápio (até 6 itens) --------
  let menu: Array<{
    id: string;
    nome: string;
    preco: number;
    tipo?: string;
    descricao?: string;
    categoria: string;
  }> = [];

  try {
    const items = await cardapioCol
      .find({}, { projection: { _id: 1, nome: 1, preco: 1, tipo: 1, descricao: 1 } })
      .limit(6)
      .toArray();

    menu = items.map((i) => ({
      id: i._id.toHexString(),
      nome: i.nome,
      preco: i.preco,
      tipo: i.tipo,
      descricao: i.descricao,
      categoria: i.tipo ?? "Sem categoria",
    }));
  } catch {
    menu = [];
  }

  // -------- Stats --------
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  // soma de "total" do dia (considera data ou _id)
  const faturamentoHojeAgg = await pedidosCol
    .aggregate<{ total: number }>([
      {
        $addFields: {
          _dataDoc: { $ifNull: ["$data", { $toDate: "$_id" }] },
        },
      },
      { $match: { _dataDoc: { $gte: start } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
      { $project: { _id: 0, total: 1 } },
    ])
    .toArray();

  const faturamentoHoje = faturamentoHojeAgg[0]?.total ?? 0;
  const pedidosEmAndamento = await pedidosCol.countDocuments({
    status: { $ne: "entregue" },
  });
  const itensNoCardapio = await cardapioCol.countDocuments().catch(() => 0);
  const clientesDistinct = (await pedidosCol.distinct("cliente")).length;

  const stats = [
    { label: "Faturamento (hoje)", value: `R$ ${faturamentoHoje.toFixed(2)}` },
    { label: "Pedidos em andamento", value: String(pedidosEmAndamento) },
    { label: "Itens no cardápio", value: String(itensNoCardapio) },
    { label: "Clientes", value: String(clientesDistinct) },
  ];

  return (
    <main className="space-y-8 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <Link href="/pedidos" className="px-4 py-2 rounded-lg bg-white text-black hover:opacity-90">
          Ver pedidos
        </Link>
      </header>

      {/* Stats do banco */}
      <Stats stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lista de Pedidos do banco (10 últimos) */}
        <section className="lg:col-span-2">
          <OrderList orders={orders} />
        </section>

        {/* Ações rápidas + Cardápio do banco */}
        <aside className="space-y-6">
          <QuickActions />
          <MenuList items={menu} />
        </aside>
      </div>
    </main>
  );
}
