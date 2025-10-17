"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  clientes: string[];
  statuses: Array<{ value: string; label: string }>;
  initialCliente?: string;
  initialStatus?: string;
};

export default function FilterBar({
  clientes,
  statuses,
  initialCliente = "",
  initialStatus = "",
}: Props) {
  const router = useRouter();

  const [cliente, setCliente] = useState(initialCliente);
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    setCliente(initialCliente);
    setStatus(initialStatus);
  }, [initialCliente, initialStatus]);

  function apply() {
    const p = new URLSearchParams();
    if (cliente) p.set("cliente", cliente);
    if (status) p.set("status", status);
    router.push(`/pedidos?${p.toString()}`);
  }

  function clear() {
    setCliente("");
    setStatus("");
    router.push("/pedidos");
  }

  return (
    <div className="rounded-xl border bg-white p-4 flex flex-wrap gap-3 items-end">
      {/* Cliente (select com os que existem no banco) */}
      <div className="flex-1 min-w-[220px]">
        <label className="block text-sm text-gray-700 mb-1">Cliente</label>
        <select
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 bg-white"
        >
          <option value="">Todos</option>
          {clientes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Status (select com os que existem) */}
      <div className="w-56 min-w-[180px]">
        <label className="block text-sm text-gray-700 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 bg-white"
        >
          {statuses.map((s) => (
            <option key={s.value || "all"} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={apply}
          className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
        >
          Aplicar
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 rounded-lg border hover:bg-gray-50"
        >
          Limpar
        </button>
      </div>
    </div>
  );
}
