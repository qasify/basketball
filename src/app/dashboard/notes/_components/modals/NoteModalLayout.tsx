"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";
import useOnClickOutside from "@/hooks/useOnClickOutside";

const panelBase =
  "w-full rounded-xl border border-purpleFill/35 bg-purplish/20 p-5 backdrop-blur-[10px] shadow-sm shadow-purpleFill/10 flex flex-col gap-4 text-white";

export type NoteModalLayoutProps = {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  title: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
  /** Panel width, e.g. `max-w-md` vs `max-w-lg`. */
  maxWidthClassName?: string;
  /** When true, Escape, overlay click, and header close are disabled. */
  closeBlocked?: boolean;
  /** Border between body and footer. */
  footerBorderClassName?: string;
};

export default function NoteModalLayout({
  isOpen,
  onClose,
  titleId,
  title,
  children,
  footer,
  maxWidthClassName = "max-w-lg",
  closeBlocked = false,
  footerBorderClassName = "border-purpleFill/25",
}: NoteModalLayoutProps) {
  const ref = useRef<HTMLDivElement>(null);

  const tryClose = useCallback(() => {
    if (!closeBlocked) onClose();
  }, [closeBlocked, onClose]);

  useOnClickOutside(ref, tryClose);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") tryClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, tryClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`${panelBase} ${maxWidthClassName}`}
      >
        <div className="flex items-start justify-between gap-3">
          <h2
            id={titleId}
            className="text-base font-semibold text-white pr-2 leading-snug"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={tryClose}
            disabled={closeBlocked}
            className="rounded-lg p-1.5 text-textGrey hover:text-white hover:bg-purplish/30 transition-colors disabled:opacity-40 shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
        <div
          className={`flex flex-wrap items-center justify-end gap-3 pt-4 border-t ${footerBorderClassName}`}
        >
          {footer}
        </div>
      </div>
    </div>
  );
}
