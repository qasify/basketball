import { toast } from "sonner";

type ToastOpts = {
  description?: string;
  duration?: number;
};

/** App-wide notifications (uses {@link AppToaster} in the root layout). */
export const notify = {
  success(message: string, opts?: ToastOpts) {
    toast.success(message, {
      description: opts?.description,
      duration: opts?.duration,
    });
  },
  error(message: string, opts?: ToastOpts) {
    toast.error(message, {
      description: opts?.description,
      duration: opts?.duration ?? 6000,
    });
  },
  info(message: string, opts?: ToastOpts) {
    toast.info(message, {
      description: opts?.description,
      duration: opts?.duration,
    });
  },
  warning(message: string, opts?: ToastOpts) {
    toast.warning(message, {
      description: opts?.description,
      duration: opts?.duration,
    });
  },
};
