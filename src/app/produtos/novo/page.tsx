// src/app/produtos/novo/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovoProduto() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("principal");
  const [preco, setPreco] = useState<number | string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome.trim() || preco === "" || isNaN(Number(preco))) {
      alert("Preencha todos os campos corretamente!");
      return;
    }

    const res = await fetch("/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        tipo,
        preco: parseFloat(preco as string),
      }),
    });

    if (res.ok) {
      alert("Produto cadastrado com sucesso!");
      // Redireciona para o cardápio após salvar
      router.push("/cardapio");
    } else {
      const msg = await res.text().catch(() => "");
      alert("Erro ao salvar produto! " + msg);
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-4">Novo Produto</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        {/* Nome */}
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

        {/* Tipo */}
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

        {/* Preço */}
        <label className="text-white font-medium">
          Preço (R$):
          <input
            type="number"
            value={preco}
            onChange={(e) => {
              const valor = e.target.value;
              setPreco(valor === "" ? "" : parseFloat(valor));
            }}
            className="w-full p-2 rounded border text-black"
            min="0"
            step="0.01"
            required
          />
        </label>

        {/* Botão */}
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
