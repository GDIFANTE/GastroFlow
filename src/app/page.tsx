// src/app/page.tsx
import Link from "next/link";

import { Stats } from "@/mocks/Stats";
import { OrderList } from "@/components/OrderList";
import { MenuList } from "@/components/MenuList";
import { QuickActions } from "@/components/QuickActions";

import { mockStats, mockOrders, mockMenu } from "@/mocks/data";

export default function Home() {
  return (
    <main className="space-y-8 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link
          href="/pedidos"
          className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
        >
          Ver pedidos
        </Link>
      </header>

      {/* Status */}
      <Stats stats={mockStats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lista de Pedidos */}
        <section className="lg:col-span-2">
          <OrderList orders={mockOrders} />
        </section>

        {/* Ações rápidas / Menu (mock) */}
        <aside className="space-y-6">
          <QuickActions />
          <MenuList items={mockMenu} />
        </aside>
      </div>
    </main>
  );
}
