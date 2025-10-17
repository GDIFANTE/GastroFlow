// src/components/QuickActions.tsx
import Link from "next/link";

export function QuickActions() {
  const actions = [
    { href: "/produtos/novo", label: "Novo Produto" },
    { href: "/clientes/novo", label: "Novo Cliente" },
    { href: "/pedidos/novo",  label: "Novo Pedido" },
    { href: "/relatorios",    label: "Relatórios" },
  ];

  return (
    <div className="rounded-xl border bg-white">
      <div className="p-4 border-b font-medium text-gray-800 text-lg">Ações rápidas</div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {actions.map((a) => (
          <Link key={a.href} href={a.href} className="text-sm  text-gray-900 border rounded-lg px-3 py-2 hover:bg-gray-200">
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
