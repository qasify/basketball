"use client";

import { Toaster } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";

/**
 * Global toast host — violet glass surface (borderPurple / purpleFill) matching app shell.
 * `richColors` is off so panels stay on-brand; semantic tints come from icons + thin rings.
 *
 * Maintenance: `classNames` below uses many Tailwind `!` overrides to beat Sonner’s bundled
 * styles. That ties us to Sonner’s internal markup/CSS specificity — after upgrading `sonner`,
 * smoke-test all toast variants. If overrides stop working, consider Sonner’s `unstyled` prop
 * and owning layout entirely in CSS. `sonner` is pinned in package.json so bumps are explicit.
 */
export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      theme="dark"
      richColors={false}
      closeButton
      expand={false}
      gap={10}
      offset="1rem"
      icons={{
        success: (
          <CheckCircle2
            className="size-[1.125rem] text-positive"
            strokeWidth={2.25}
            aria-hidden
          />
        ),
        error: (
          <XCircle
            className="size-[1.125rem] text-danger"
            strokeWidth={2.25}
            aria-hidden
          />
        ),
        info: (
          <Info
            className="size-[1.125rem] text-purpleFill"
            strokeWidth={2.25}
            aria-hidden
          />
        ),
        warning: (
          <AlertTriangle
            className="size-[1.125rem] text-primary"
            strokeWidth={2.25}
            aria-hidden
          />
        ),
        close: (
          <X className="size-3.5 text-white/80" strokeWidth={2} aria-hidden />
        ),
      }}
      toastOptions={{
        duration: 4200,
        classNames: {
          toast:
            "group !flex !w-full !max-w-[min(100vw-1.5rem,26rem)] !items-center !gap-3 !rounded-xl !border !p-4 !pr-11 !shadow-[0_16px_48px_rgba(67,10,101,0.35),inset_0_1px_0_rgba(176,55,255,0.14)] !backdrop-blur-xl " +
            "!border-purpleFill/25 !bg-gradient-to-br !from-[rgba(67,10,101,0.42)] !via-[rgba(18,8,26,0.96)] !to-[rgba(8,6,12,0.94)]",
          icon:
            "!m-0 !flex !h-10 !w-10 !shrink-0 !items-center !justify-center !rounded-lg !bg-[rgba(176,55,255,0.1)] !ring-1 !ring-inset !ring-purpleFill/25",
          content:
            "!flex !min-w-0 !flex-1 !flex-col !gap-0.5 !justify-center !self-center !py-0",
          title:
            "!text-[0.9375rem] !font-semibold !leading-snug !tracking-tight !text-white",
          description:
            "!text-[0.8125rem] !leading-relaxed !text-textGrey !opacity-95",
          success:
            "!ring-1 !ring-inset !ring-positive/25 !border-positive/20",
          error: "!ring-1 !ring-inset !ring-danger/30 !border-danger/25",
          info: "!ring-1 !ring-inset !ring-purpleFill/35 !border-purpleFill/30",
          warning: "!ring-1 !ring-inset !ring-primary/30 !border-primary/25",
          closeButton:
            "!absolute !right-3 !top-1/2 !left-auto !h-8 !w-8 !-translate-y-1/2 !rounded-lg !border !border-white/12 !bg-white/[0.07] !text-white/80 !transition-colors hover:!bg-white/14 hover:!text-white",
        },
      }}
    />
  );
}
