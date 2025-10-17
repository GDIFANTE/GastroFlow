// src/app/clientes/novo/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovoCliente() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      alert("Informe o nome do cliente.");
      return;
    }

    setSalvando(true);
    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, telefone, endereco }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Erro ao salvar cliente");
      }

      alert("Cliente cadastrado com sucesso!");
      router.push("/clientes"); // vai para a tela de gestão/lista
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar cliente!");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-4">Novo Cliente</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
        <label className="text-white font-medium">
          Nome:
          <input
            type="text"
            className="w-full p-2 rounded border text-black"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </label>

        <label className="text-white font-medium">
          Telefone:
          <input
            type="tel"
            className="w-full p-2 rounded border text-black"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </label>

        <label className="text-white font-medium">
          Endereço:
          <input
            type="text"
            className="w-full p-2 rounded border text-black"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </label>

        <button
          type="submit"
          disabled={salvando}
          className={`mt-2 px-4 py-2 rounded text-white font-semibold ${
            salvando ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:opacity-80"
          }`}
        >
          {salvando ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </main>
  );
}
