import { toast } from "sonner";

type ToastOpts = {
  description?: string;
  duration?: number;
  /** Sonner: same id replaces an existing toast instead of stacking (useful for retries). */
  id?: string | number;
};

/** App-wide notifications (uses {@link AppToaster} in the root layout). */
export const notify = {
  success(message: string, opts?: ToastOpts) {
    toast.success(message, {
      id: opts?.id,
      description: opts?.description,
      duration: opts?.duration,
    });
  },
  error(message: string, opts?: ToastOpts) {
    toast.error(message, {
      id: opts?.id,
      description: opts?.description,
      duration: opts?.duration ?? 6000,
    });
  },
  info(message: string, opts?: ToastOpts) {
    toast.info(message, {
      id: opts?.id,
      description: opts?.description,
      duration: opts?.duration,
    });
  },
  warning(message: string, opts?: ToastOpts) {
    toast.warning(message, {
      id: opts?.id,
      description: opts?.description,
      duration: opts?.duration,
    });
  },
};
