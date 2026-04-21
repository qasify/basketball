import { cn } from "@/utils/cn";
import type { SectionCardProps } from "../_types";

export function SectionCard({
  title,
  subtitle,
  icon,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_0_1px_rgba(176,55,255,0.06)] backdrop-blur-[12px] sm:p-6",
        className
      )}
    >
      <div className="mb-5 flex shrink-0 items-start gap-3 border-b border-white/10 pb-4">
        {icon && (
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purpleFill/25 bg-purplish/15 text-purpleFill">
            {icon}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-xs leading-relaxed text-textGrey sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
