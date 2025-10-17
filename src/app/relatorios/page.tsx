// src/app/relatorios/page.tsx
"use client";

import { useState, useEffect } from "react";

type RelatorioItem = {
  _id: string;
  totalGasto: number;
  qtdPedidos: number;
};

type Cliente = {
  _id: string;
  nome: string;
  telefone?: string;
  email?: string;
};

export default function RelatoriosPage() {
  const [dados, setDados] = useState<RelatorioItem[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // 🔹 Carrega lista de clientes cadastrados
  useEffect(() => {
    async function fetchClientes() {
      try {
        const res = await fetch("/api/clientes");
        if (!res.ok) throw new Error("Erro ao buscar clientes");
        const data = await res.json();
        setClientes(data); // data é [{ _id, nome }]
      } catch (e) {
        console.error(e);
        setErro("Erro ao carregar lista de clientes.");
      }
    }
    fetchClientes();
  }, []);

  // 🔹 Carrega relatório (todos ou por cliente)
  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      let url = "/api/relatorios";
      if (clienteSelecionado)
        url += `?cliente=${encodeURIComponent(clienteSelecionado)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Erro ao buscar relatório");
      const data = await res.json();
      setDados(data);
    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar dados.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-white">
        Relatório – Total por Cliente
      </h1>

      {/* 🔹 Filtros */}
      <div className="flex gap-3 items-center">
        <label className="text-white font-medium">Cliente:</label>
        <select
          value={clienteSelecionado}
          onChange={(e) => setClienteSelecionado(e.target.value)}
          className="border rounded px-3 py-2 text-black"
        >
          <option value="">Todos</option>
          {clientes.map((c) => (
            <option key={c._id} value={c.nome}>
              {c.nome}
            </option>
          ))}
        </select>

        <button
          onClick={carregar}
          disabled={carregando}
          className={`px-4 py-2 rounded text-white font-semibold ${
            carregando
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {carregando ? "Carregando..." : "Recarregar"}
        </button>
      </div>

      {erro && <p className="text-red-500">{erro}</p>}

      {/* 🔹 Tabela */}
      <div className="rounded-xl border bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b">Cliente</th>
              <th className="p-3 border-b">Total Gasto (R$)</th>
              <th className="p-3 border-b">Pedidos</th>
            </tr>
          </thead>
          <tbody>
            {dados.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center p-4 text-gray-500 italic"
                >
                  Sem dados
                </td>
              </tr>
            ) : (
              dados.map((item) => (
                <tr key={item._id}>
                  <td className="p-3 border-b text-black">{item._id}</td>
                  <td className="p-3 border-b text-black">
                    {item.totalGasto.toFixed(2)}
                  </td>
                  <td className="p-3 border-b text-black">
                    {item.qtdPedidos}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
