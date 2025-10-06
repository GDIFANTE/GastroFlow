// src/components/MenuList.tsx
type MenuItem = { id: string; nome: string; preco: number; categoria: string };

export function MenuList({ items }: { items: MenuItem[] }) {
  return (
    <div className="rounded-xl border bg-white mt-6">
      <div className="p-4 border-b font-medium">Cardápio</div>
      <ul>
        {items.map((i) => (
          <li key={i.id} className="px-4 py-3 flex items-center justify-between border-b last:border-b-0">
            <div>
              <p className="font-medium">{i.nome}</p>
              <p className="text-xs text-gray-500">{i.categoria}</p>
            </div>
            <span className="font-semibold">R$ {i.preco.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
