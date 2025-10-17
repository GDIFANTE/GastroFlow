// src/app/_components/UltimosPedidos.tsx
"use client";

import { useEffect, useState } from "react";

type Pedido = {
  _id: string;
  cliente: string;
  total: number;
  status?: "em preparo" | "pronto" | "entregue" | string;
  data?: string; // virá como ISO do JSON
  numero?: number;
};

function formatHora(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  const hh = String(dt.getHours()).padStart(2, "0");
  const mm = String(dt.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function Badge({ status }: { status?: string }) {
  const map: Record<string, string> = {
    entregue: "bg-green-100 text-green-700",
    pronto: "bg-blue-100 text-blue-700",
    "em preparo": "bg-yellow-100 text-yellow-800",
  };
  const cls = map[status ?? ""] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${cls}`}>
      {status ?? "-"}
    </span>
  );
}

export default function UltimosPedidos() {
  const [itens, setItens] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function carregar() {
    setLoading(true);
    setErro("");
    try {
      const res = await fetch("/api/pedidos?limit=10", { cache: "no-store" });
      if (!res.ok) throw new Error("Erro ao buscar pedidos");
      const data = (await res.json()) as Pedido[];
      setItens(data);
    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="rounded-xl border bg-white">
      <div className="p-4 border-b font-medium text-black">Pedidos em andamento</div>

      {erro && <div className="p-4 text-red-600">{erro}</div>}

      <ul className="divide-y">
        {itens.length === 0 && !loading && (
          <li className="p-4 text-gray-500 italic">Nenhum pedido encontrado.</li>
        )}

        {itens.map((p) => (
          <li key={p._id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 w-10">
                {p.numero ? `#${p.numero}` : `#${p._id.slice(-4)}`}
              </span>
              <div className="flex flex-col">
                <span className="text-black font-medium">{p.cliente}</span>
                <span className="text-xs text-gray-500">{formatHora(p.data)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-black font-medium">
                R$ {Number(p.total || 0).toFixed(2)}
              </span>
              <Badge status={p.status} />
            </div>
          </li>
        ))}

        {loading && <li className="p-4 text-gray-500">Carregando...</li>}
      </ul>

      <div className="p-3 border-t flex justify-end">
        <button
          onClick={carregar}
          className="px-3 py-2 rounded border bg-white text-black hover:opacity-80"
        >
          Recarregar
        </button>
      </div>
    </div>
  );
}
