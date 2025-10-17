// src/app/clientes/novo/page.tsx
"use client";

import { useState } from "react";

export default function NovoCliente() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, telefone, endereco }),
    });

    if (res.ok) {
      alert("Cliente cadastrado com sucesso!");
      setNome("");
      setTelefone("");
      setEndereco("");
    } else {
      alert("Erro ao salvar cliente!");
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-4">Novo Cliente</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-2xl">
        <label className="text-white font-medium">
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 rounded border text-black"
            required
          />
        </label>

        <label className="text-white font-medium">
          Telefone:
          <input
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full p-2 rounded border text-black"
            placeholder="(00) 00000-0000"
            required
          />
        </label>

        <label className="text-white font-medium">
          Endereço:
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="w-full p-2 rounded border text-black"
            placeholder="Rua, número, bairro, cidade"
            required
          />
        </label>

        <button
          type="submit"
          className="mt-4 px-4 py-2 rounded bg-black text-white hover:opacity-80 w-fit"
        >
          Salvar
        </button>
      </form>
    </main>
  );
}
