"use client";
import { useState } from "react";

export default function NovoCliente() {
  const [form, setForm] = useState({ nome: "", telefone: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Cliente inserido!");
  }

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Novo Cliente</h1>
      <form onSubmit={onSubmit} className="space-y-3 max-w-md">
        <input className="border rounded w-full p-2"
          placeholder="Nome" value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })} />
        <input className="border rounded w-full p-2"
          placeholder="Telefone" value={form.telefone}
          onChange={e => setForm({ ...form, telefone: e.target.value })} />
        <button className="px-4 py-2 rounded bg-black text-white">Salvar</button>
      </form>
    </main>
  );
}
