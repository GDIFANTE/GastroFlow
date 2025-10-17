"use client";
import { useState } from "react";

type Item = { produto: string; qtd: number; preco: number };

export default function NovoPedido() {
  const [cliente, setCliente] = useState("");
  const [itens, setItens] = useState<Item[]>([{ produto: "", qtd: 1, preco: 0 }]);

  const total = itens.reduce((s, i) => s + i.qtd * i.preco, 0);

  function setItem(idx: number, patch: Partial<Item>) {
    setItens(prev => prev.map((it, i) => i === idx ? { ...it, ...patch } : it));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cliente, pedido: itens, total, status: "em preparo" }),
    });
    alert("Pedido inserido!");
  }

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Novo Pedido</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input className="border rounded w-full p-2 max-w-md"
          placeholder="Nome do cliente" value={cliente}
          onChange={e => setCliente(e.target.value)} />

        <div className="space-y-2">
          {itens.map((it, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-2 max-w-2xl">
              <input className="border rounded p-2"
                placeholder="Produto" value={it.produto}
                onChange={e => setItem(idx, { produto: e.target.value })} />
              <input type="number" className="border rounded p-2"
                placeholder="Qtd" value={it.qtd}
                onChange={e => setItem(idx, { qtd: Number(e.target.value) })} />
              <input type="number" step="0.01" className="border rounded p-2"
                placeholder="Preço" value={it.preco}
                onChange={e => setItem(idx, { preco: Number(e.target.value) })} />
            </div>
          ))}
          <button type="button" className="px-3 py-1 rounded border"
            onClick={() => setItens([...itens, { produto: "", qtd: 1, preco: 0 }])}>
            + Item
          </button>
        </div>

        <div className="text-lg font-semibold">Total: R$ {total.toFixed(2)}</div>

        <button className="px-4 py-2 rounded bg-black text-white">Salvar</button>
      </form>
    </main>
  );
}
