// src/app/produtos/novo/page.tsx
"use client";

import { useState } from "react";

export default function NovoProduto() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("principal");
  const [preco, setPreco] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, tipo, preco }),
    });

    if (res.ok) {
      alert("Produto cadastrado com sucesso!");
      setNome("");
      setTipo("principal");
      setPreco(0);
    } else {
      alert("Erro ao salvar produto!");
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-4">Novo Produto</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        <label className="text-white font-medium">
          Nome do produto:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 rounded border text-black"
            required
          />
        </label>

        <label className="text-white font-medium">
          Categoria / Tipo:
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full p-2 rounded border text-black"
            required
          >
            <option value="principal">Principal</option>
            <option value="sobremesa">Sobremesa</option>
            <option value="bebida">Bebida</option>
            <option value="bomboniere">Bomboniere</option>
          </select>
        </label>

        <label className="text-white font-medium">
          Preço (R$):
          <input
            type="number"
            value={preco}
            onChange={(e) => setPreco(parseFloat(e.target.value))}
            className="w-full p-2 rounded border text-black"
            min="0"
            step="0.01"
            required
          />
        </label>

        <button
          type="submit"
          className="mt-4 px-4 py-2 rounded bg-black text-white hover:opacity-80"
        >
          Salvar
        </button>
      </form>
    </main>
  );
}
