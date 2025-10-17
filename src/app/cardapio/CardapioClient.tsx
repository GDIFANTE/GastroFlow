// src/app/cardapio/CardapioClient.tsx
"use client";

import { useMemo, useState } from "react";

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
  const tipos = useMemo(
    () =>
      Array.from(
        new Set(["principal", "sobremesa", "bebida", "bomboniere", ...tiposBanco])
      ).sort(),
    [tiposBanco]
  );

  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [data, setData] = useState<Item[]>(items);

  const mostrados = useMemo(
    () =>
      filtroTipo === "todos"
        ? data
        : data.filter(
            (i) => (i.tipo ?? "").toLowerCase() === filtroTipo.toLowerCase()
          ),
    [data, filtroTipo]
  );

  async function salvar(id: string, patch: Partial<Item>) {
    const res = await fetch(`/api/produtos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      alert("Erro ao salvar");
      return;
    }
    setData((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
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
        </div>
      </header>

      <div className="rounded-xl border bg-white">
        <div className="p-4 border-b font-medium text-black text-lg">
          Itens cadastrados
        </div>

        <ul className="divide-y">
          {mostrados.map((item) => (
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
                    salvar(item.id, { tipo: e.target.value || undefined })
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
                  defaultValue={item.preco}
                  onBlur={(e) =>
                    salvar(item.id, { preco: Number(e.target.value || 0) })
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
