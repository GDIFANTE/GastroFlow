// src/components/Stats.tsx
type Stat = { label: string; value: string; trend?: string };

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">{s.label}</div>
          <div className="mt-1 text-2xl font-bold">{s.value}</div>
          {s.trend && <div className="text-xs text-green-600 mt-1">{s.trend}</div>}
        </div>
      ))}
    </div>
  );
}
