// src/components/OrderList.tsx
import type { Order } from "@/mocks/data";

export function OrderList({ orders }: { orders: Order[] }) {
  return (
    <div className="rounded-xl border bg-white">
      <div className="p-4 border-b font-medium text-gray-800 text-lg">Pedidos em andamento</div>
      <ul>
        {orders.map((o) => (
          <li key={o.id} className="px-4 py-3 flex items-center justify-between border-b last:border-b-0">
            <div>
                <p className="font-medium text-gray-700">#{o.id} • {o.cliente}</p>
              <p className="text-xs text-gray-500">{o.hora}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">R$ {o.total.toFixed(2)}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${badgeClass(o.status)}`}>{o.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function badgeClass(s: Order["status"]) {
  switch (s) {
    case "Em preparo": return "bg-yellow-100 text-yellow-700";
    case "Pronto":     return "bg-blue-100 text-blue-700";
    default:           return "bg-green-100 text-green-700";
  }
}
