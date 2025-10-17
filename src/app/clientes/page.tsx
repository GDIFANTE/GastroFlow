// src/app/clientes/page.tsx
"use client";

import { useEffect, useState } from "react";

type Cliente = {
  _id: string;
  nome: string;
  telefone?: string;
  email?: string;
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null
  );
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // 🔹 Busca lista de clientes ao carregar a página
  useEffect(() => {
    async function fetchClientes() {
      try {
        const res = await fetch("/api/clientes");
        if (!res.ok) throw new Error("Erro ao buscar clientes");
        const data = await res.json();
        setClientes(data);
      } catch (e) {
        console.error(e);
        setErro("Erro ao carregar lista de clientes.");
      }
    }
    fetchClientes();
  }, []);

  // 🔹 Quando selecionar um cliente, busca dados completos dele
  async function handleSelecionarCliente(id: string) {
    if (!id) {
      setClienteSelecionado(null);
      return;
    }
    setCarregando(true);
    setErro("");
    try {
      const res = await fetch(`/api/clientes/${id}`);
      if (!res.ok) throw new Error("Erro ao buscar dados do cliente");
      const data = await res.json();
      setClienteSelecionado(data);
    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar dados do cliente.");
    } finally {
      setCarregando(false);
    }
  }

  // 🔹 Atualiza o cliente no banco
  async function salvarAlteracoes() {
    if (!clienteSelecionado) return;
    setSalvando(true);
    setErro("");
    try {
      const res = await fetch(`/api/clientes/${clienteSelecionado._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteSelecionado),
      });
      if (!res.ok) throw new Error("Erro ao salvar alterações");
      alert("Alterações salvas com sucesso!");
    } catch (e) {
      console.error(e);
      setErro("Erro ao salvar alterações.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-white">Gerenciar Clientes</h1>

      {/* Selecionar cliente */}
      <div className="flex gap-3 items-center">
        <label className="text-white font-medium">Cliente:</label>
        <select
          className="border rounded px-3 py-2 text-black"
          onChange={(e) => handleSelecionarCliente(e.target.value)}
          defaultValue=""
        >
          <option value="">Selecione um cliente...</option>
          {clientes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      {erro && <p className="text-red-500">{erro}</p>}

      {/* Formulário de edição */}
      {clienteSelecionado && (
        <div className="bg-white p-6 rounded-xl border max-w-md space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Nome:</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-black"
              value={clienteSelecionado.nome}
              onChange={(e) =>
                setClienteSelecionado({
                  ...clienteSelecionado,
                  nome: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Telefone:</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-black"
              value={clienteSelecionado.telefone ?? ""}
              onChange={(e) =>
                setClienteSelecionado({
                  ...clienteSelecionado,
                  telefone: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email:</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 text-black"
              value={clienteSelecionado.email ?? ""}
              onChange={(e) =>
                setClienteSelecionado({
                  ...clienteSelecionado,
                  email: e.target.value,
                })
              }
            />
          </div>

          <button
            onClick={salvarAlteracoes}
            disabled={salvando}
            className={`px-4 py-2 rounded font-semibold text-white ${
              salvando
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      )}

      {carregando && <p className="text-white">Carregando dados...</p>}
    </main>
  );
}
