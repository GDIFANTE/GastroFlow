// src/app/pedidos/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Pedido = {
  _id: string;
  cliente: string;
  total: number;
  status: "em preparo" | "pronto" | "entregue" | string;
  data?: string; // virá como ISO no JSON
  numero?: number;
};

type Cliente = { _id: string; nome: string };

function formatData(d?: string) {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [statusFiltro, setStatusFiltro] = useState<string>("");
  const [clienteFiltro, setClienteFiltro] = useState<string>("");
  const [carregando, setCarregando] = useState(false);
  const [excluindoId, setExcluindoId] = useState<string>("");
  const [erro, setErro] = useState("");

  // Carrega clientes (dropdown) e pedidos
  useEffect(() => {
    async function init() {
      try {
        setCarregando(true);
        setErro("");

        const [resClientes, resPedidos] = await Promise.all([
          fetch("/api/clientes").then((r) => (r.ok ? r.json() : [])),
          fetch("/api/pedidos").then((r) => (r.ok ? r.json() : [])),
        ]);

        setClientes(resClientes);
        setPedidos(resPedidos);
      } catch (e) {
        console.error(e);
        setErro("Erro ao carregar dados.");
      } finally {
        setCarregando(false);
      }
    }
    init();
  }, []);

  // Opções de clientes para o select (ordena por nome)
  const nomesClientes = useMemo(
    () =>
      (clientes as Cliente[])
        .map((c) => ({ id: c._id, nome: c.nome }))
        .sort((a, b) => a.nome.localeCompare(b.nome)),
    [clientes]
  );

  // Filtro em memória
  const filtrados = useMemo(() => {
    return pedidos.filter((p) => {
      const okStatus = statusFiltro ? p.status === statusFiltro : true;
      const okCliente = clienteFiltro ? p.cliente === clienteFiltro : true;
      return okStatus && okCliente;
    });
  }, [pedidos, statusFiltro, clienteFiltro]);

  async function recarregar() {
    try {
      setCarregando(true);
      setErro("");
      const data = await fetch("/api/pedidos").then((r) => (r.ok ? r.json() : []));
      setPedidos(data);
    } catch (e) {
      console.error(e);
      setErro("Erro ao recarregar pedidos.");
    } finally {
      setCarregando(false);
    }
  }

  function limparFiltros() {
    setStatusFiltro("");
    setClienteFiltro("");
  }

  // 🔥 Excluir pedido
  async function excluirPedido(id: string) {
    const ok = confirm("Tem certeza que deseja excluir este pedido?");
    if (!ok) return;

    try {
      setExcluindoId(id);
      const res = await fetch(`/api/pedidos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Falha ao excluir");
      }
      // remove da lista local
      setPedidos((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir pedido.");
    } finally {
      setExcluindoId("");
    }
  }

  return (
    <main className="p-6 text-black">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <div className="flex gap-2">
          <button
            onClick={recarregar}
            className="px-4 py-2 rounded border bg-white hover:opacity-90"
            disabled={carregando}
          >
            {carregando ? "Carregando..." : "Recarregar"}
          </button>
          <button
            onClick={limparFiltros}
            className="px-4 py-2 rounded border bg-white hover:opacity-90"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="font-medium block mb-1">Status:</label>
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="border rounded px-3 py-2 bg-white text-black"
          >
            <option value="">Todos</option>
            <option value="em preparo">Em preparo</option>
            <option value="pronto">Pronto</option>
            <option value="entregue">Entregue</option>
          </select>
        </div>

        <div>
          <label className="font-medium block mb-1">Cliente:</label>
          <select
            value={clienteFiltro}
            onChange={(e) => setClienteFiltro(e.target.value)}
            className="border rounded px-3 py-2 bg-white text-black min-w-56"
          >
            <option value="">Todos</option>
            {nomesClientes.map((c) => (
              <option key={c.id} value={c.nome}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto bg-white rounded-xl border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Cliente</th>
              <th className="px-4 py-2 border-b">Total (R$)</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Data</th>
              <th className="px-4 py-2 border-b w-36">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{p.cliente}</td>
                <td className="px-4 py-2 border-b">
                  {Number(p.total || 0).toFixed(2)}
                </td>
                <td className="px-4 py-2 border-b capitalize">{p.status}</td>
                <td className="px-4 py-2 border-b">{formatData(p.data)}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => excluirPedido(p._id)}
                    disabled={excluindoId === p._id}
                    className={`px-3 py-2 rounded border ${
                      excluindoId === p._id
                        ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                        : "bg-white text-black hover:opacity-90"
                    }`}
                    title="Excluir pedido"
                  >
                    {excluindoId === p._id ? "Excluindo..." : "Excluir"}
                  </button>
                </td>
              </tr>
            ))}

            {filtrados.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 py-4 border-b"
                >
                  Nenhum pedido encontrado.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              <td className="px-4 py-2 border-t">Total filtrado</td>
              <td className="px-4 py-2 border-t">
                R${" "}
                {filtrados
                  .reduce((sum, p) => sum + Number(p.total || 0), 0)
                  .toFixed(2)}
              </td>
              <td className="border-t"></td>
              <td className="border-t"></td>
              <td className="border-t"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  );
}
