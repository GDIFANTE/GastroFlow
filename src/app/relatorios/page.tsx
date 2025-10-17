"use client";
import { useEffect, useState } from "react";

type Row = { _id: string; totalGasto: number; pedidos: number };

export default function Relatorios() {
  const [data, setData] = useState<Row[]>([]);

  async function carregar() {
    const r = await fetch("/api/relatorios/total-por-cliente");
    const j = await r.json();
    setData(j);
  }

  useEffect(() => { carregar(); }, []);

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Relatório – Total por Cliente</h1>
      <button className="px-4 py-2 rounded border" onClick={carregar}>Recarregar</button>

      <div className="rounded border bg-white mt-4">
        <div className="grid grid-cols-3 font-medium p-3 border-b">
          <div>Cliente</div><div>Total Gasto (R$)</div><div>Pedidos</div>
        </div>
        {data.map((r) => (
          <div key={r._id} className="grid grid-cols-3 p-3 border-b">
            <div>{r._id}</div>
            <div>{r.totalGasto.toFixed(2)}</div>
            <div>{r.pedidos}</div>
          </div>
        ))}
        {data.length === 0 && <div className="p-3 text-sm text-gray-500">Sem dados</div>}
      </div>
    </main>
  );
}
