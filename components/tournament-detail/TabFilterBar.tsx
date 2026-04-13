"use client";

export type FilterSelectOption = { value: string; label: string };

type TabFilterBarProps = {
  filters: {
    id: string;
    label: string;
    value: string;
    options: FilterSelectOption[];
    onChange: (value: string) => void;
  }[];
};

export function TabFilterBar({ filters }: TabFilterBarProps) {
  if (filters.length === 0) return null;

  return (
    <div
      className="mb-4 flex flex-wrap items-end gap-3 border-b border-mp-surface-light pb-4"
      role="group"
      aria-label="Filtros"
    >
      {filters.map((f) => (
        <div key={f.id} className="flex min-w-[140px] flex-col gap-1">
          <label htmlFor={f.id} className="text-xs font-medium text-mp-text-muted">
            {f.label}
          </label>
          <select
            id={f.id}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className="rounded-md border border-mp-surface-light bg-mp-bg px-3 py-2 text-sm text-mp-text outline-none focus-visible:ring-2 focus-visible:ring-mp-yellow"
          >
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
