export type PillVariant = 'default' | 'success' | 'warning' | 'danger';

export interface PillProps {
  label: string;
  variant?: PillVariant;
}

const colorMap: Record<PillVariant, string> = {
  default: 'bg-slate-800 text-slate-100',
  success: 'bg-emerald-500/10 text-emerald-300',
  warning: 'bg-amber-500/10 text-amber-300',
  danger: 'bg-rose-500/10 text-rose-300'
};

export function Pill({ label, variant = 'default' }: PillProps) {
  const classes = colorMap[variant];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}