import type { InfoRowProps } from "../_types";

export function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-white/[0.08] py-4 last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="flex items-center gap-2 text-textGrey text-xs font-medium uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <p className="min-w-0 break-words text-right text-sm font-medium text-white/90 sm:max-w-[60%] sm:text-right">
        {value || <span className="text-textGrey italic">—</span>}
      </p>
    </div>
  );
}
