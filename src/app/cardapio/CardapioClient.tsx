// src/app/cardapio/CardapioClient.tsx
"use client";

import { useState, useMemo } from "react";

type Item = {
  id: string;
  nome: string;
  preco: number;
  tipo?: string;
  descricao?: string;
};

export default function CardapioClient({
  items,
  tiposBanco,
}: {
  items: Item[];
  tiposBanco: string[];
}) {
  const [data, setData] = useState<Item[]>(items);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [salvando, setSalvando] = useState(false);

  const tipos = useMemo(
    () =>
      Array.from(
        new Set(["principal", "sobremesa", "bebida", "bomboniere", ...tiposBanco])
      ).sort(),
    [tiposBanco]
  );

  const filtrados = useMemo(
    () =>
      filtroTipo === "todos"
        ? data
        : data.filter(
            (i) => (i.tipo ?? "").toLowerCase() === filtroTipo.toLowerCase()
          ),
    [data, filtroTipo]
  );

  const atualizarCampo = (id: string, campo: keyof Item, valor: string | number) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [campo]: valor } : item
      )
    );
  };

  async function salvarAlteracoes() {
    setSalvando(true);
    try {
      const res = await fetch("/api/cardapio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      alert("Alterações salvas com sucesso!");
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar alterações.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Cardápio</h1>

        <div className="flex items-center gap-2">
          <label className="text-white">Tipo:</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="rounded border px-3 py-2 text-black"
          >
            <option value="todos">Todos</option>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <button
            onClick={salvarAlteracoes}
            disabled={salvando}
            className={`px-4 py-2 rounded text-white font-semibold ${
              salvando
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </header>

      <div className="rounded-xl border bg-white">
        <div className="p-4 border-b font-medium text-black text-lg">
          Itens cadastrados
        </div>

        <ul className="divide-y">
          {filtrados.map((item) => (
            <li key={item.id} className="p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="font-medium text-black">{item.nome}</div>
                <div className="text-xs text-gray-700">{item.descricao}</div>
              </div>

              {/* Tipo */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-black">Tipo</label>
                <select
                  className="border rounded px-2 py-1 text-black"
                  value={item.tipo ?? ""}
                  onChange={(e) =>
                    atualizarCampo(item.id, "tipo", e.target.value)
                  }
                >
                  <option value="">—</option>
                  {tipos.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preço */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-black">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-28 border rounded px-2 py-1 text-right text-black placeholder-gray-500"
                  value={item.preco}
                  onChange={(e) =>
                    atualizarCampo(item.id, "preco", Number(e.target.value))
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
