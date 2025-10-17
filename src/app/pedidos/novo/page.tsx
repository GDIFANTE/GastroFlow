// src/app/pedidos/novo/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Cliente = { _id: string; nome: string };
type Produto = { _id: string; nome: string; preco: number };

type Item = {
  produtoId: string;
  nome: string;
  qtd: number;
  preco: number; // unitário, puxado do cadastro
};

export default function NovoPedido() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [itens, setItens] = useState<Item[]>([
    { produtoId: "", nome: "", qtd: 1, preco: 0 },
  ]);

  // Carrega listas de clientes e produtos
  useEffect(() => {
    (async () => {
      const [cRes, pRes] = await Promise.all([
        fetch("/api/clientes").then((r) => r.json()),
        fetch("/api/cardapio").then((r) => r.json()),
      ]);
      setClientes(cRes as Cliente[]);
      setProdutos(pRes as Produto[]);
    })();
  }, []);

  // helpers de itens
  function addItem() {
    setItens((old) => [...old, { produtoId: "", nome: "", qtd: 1, preco: 0 }]);
  }
  function removeItem(index: number) {
    setItens((old) => old.filter((_, i) => i !== index));
  }
  function inc(index: number) {
    setItens((old) =>
      old.map((it, i) => (i === index ? { ...it, qtd: it.qtd + 1 } : it)),
    );
  }
  function dec(index: number) {
    setItens((old) =>
      old.map((it, i) =>
        i === index ? { ...it, qtd: Math.max(1, it.qtd - 1) } : it,
      ),
    );
  }

  // quando selecionar um produto, preenche nome e preço
  function selectProduto(index: number, produtoId: string) {
    const p = produtos.find((pp) => pp._id === produtoId);
    setItens((old) =>
      old.map((it, i) =>
        i === index
          ? {
              ...it,
              produtoId,
              nome: p?.nome ?? "",
              preco: p?.preco ?? 0,
              qtd: it.qtd || 1,
            }
          : it,
      ),
    );
  }

  // total do pedido
  const total = useMemo(
    () =>
      itens.reduce((sum, it) => sum + (Number(it.preco) || 0) * it.qtd, 0),
    [itens],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clienteId) {
      alert("Selecione um cliente.");
      return;
    }
    if (itens.some((i) => !i.produtoId)) {
      alert("Selecione os produtos de todos os itens.");
      return;
    }

    const cliente = clientes.find((c) => c._id === clienteId);

    const payload = {
      clienteId,
      cliente: cliente?.nome ?? "",
      pedido: itens.map((i) => ({
        produtoId: i.produtoId,
        produto: i.nome,
        qtd: i.qtd,
        preco: i.preco,
        subtotal: i.qtd * i.preco,
      })),
      total,
      status: "em preparo",
      data: new Date(),
    };

    const r = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (r.ok) {
      alert("Pedido salvo!");
      setClienteId("");
      setItens([{ produtoId: "", nome: "", qtd: 1, preco: 0 }]);
    } else {
      const msg = await r.text().catch(() => "");
      alert("Falha ao salvar o pedido. " + msg);
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-4">Novo Pedido</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-4xl">
        {/* Cliente (select) */}
        <label className="text-white font-medium block">
          Cliente:
          <select
            className="mt-1 w-full p-2 rounded border text-black bg-white"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            required
          >
            <option value="">Selecione um cliente...</option>
            {clientes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>

        {/* Itens */}
        <div className="space-y-4">
          {itens.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-3 items-end">
              {/* Produto (select) */}
              <label className="col-span-6 text-white font-medium">
                Produto:
                <select
                  className="mt-1 w-full p-2 rounded border text-black bg-white"
                  value={item.produtoId}
                  onChange={(e) => selectProduto(idx, e.target.value)}
                  required
                >
                  <option value="">Selecione um produto...</option>
                  {produtos.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.nome} — R$ {p.preco.toFixed(2)}
                    </option>
                  ))}
                </select>
              </label>

              {/* Quantidade com – / + */}
              <div className="col-span-3">
                <label className="text-white font-medium block">Quantidade:</label>
                <div className="mt-1 flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => dec(idx)}
                    className="px-3 py-2 rounded border bg-white text-black hover:opacity-80"
                    title="Diminuir"
                  >
                    –
                  </button>
                  <input
                    type="number"
                    min={1}
                    className="w-full p-2 rounded border text-black"
                    value={item.qtd}
                    onChange={(e) =>
                      setItens((old) =>
                        old.map((it, i) =>
                          i === idx ? { ...it, qtd: Math.max(1, Number(e.target.value)) } : it,
                        ),
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => inc(idx)}
                    className="px-3 py-2 rounded border bg-white text-black hover:opacity-80"
                    title="Aumentar"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Preço unitário (read-only) */}
              <label className="col-span-2 text-white font-medium">
                Preço (R$):
                <input
                  type="number"
                  className="mt-1 w-full p-2 rounded border text-black bg-gray-100"
                  value={item.preco}
                  readOnly
                />
              </label>

              {/* Remover */}
              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="px-3 py-2 rounded border bg-black text-white hover:opacity-80"
                >
                  Remover
                </button>
              </div>

              {/* Subtotal linha */}
              <div className="col-span-12 text-white text-sm">
                Subtotal: R$ {(item.qtd * item.preco).toFixed(2)}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 rounded border bg-white text-black hover:opacity-80 w-fit"
          >
            + Item
          </button>
        </div>

        {/* Total do pedido */}
        <div className="text-white font-semibold text-lg">
          Total do pedido: <span className="underline">R$ {total.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded bg-black text-white hover:opacity-80 w-fit"
        >
          Salvar
        </button>
      </form>
    </main>
  );
}
