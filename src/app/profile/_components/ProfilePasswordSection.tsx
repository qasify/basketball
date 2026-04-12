import { FaSpinner } from "react-icons/fa";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { cn } from "@/utils/cn";
import type { ProfilePasswordSectionProps } from "../_types";

export function ProfilePasswordSection({
  email,
  showPasswordForm,
  onToggleForm,
  currentPassword,
  onCurrentPasswordChange,
  newPassword,
  onNewPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  showCurrentPassword,
  onToggleShowCurrent,
  showNewPassword,
  onToggleShowNew,
  passwordsDontMatch,
  passwordError,
  passwordSaving,
  passwordSaved,
  onSubmit,
}: ProfilePasswordSectionProps) {
  return (
    <SectionCard
      title="Password & security"
      subtitle="Use a strong password you don't reuse on other sites."
      icon={<KeyRound className="h-4 w-4" aria-hidden />}
    >
      {passwordSaved && (
        <p className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-400">
          Password changed successfully.
        </p>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-textGrey">
          {showPasswordForm
            ? "Update your password below."
            : "Your password is hidden. Expand to change it."}
        </p>
        <button
          type="button"
          onClick={onToggleForm}
          className="shrink-0 rounded-xl border border-purpleFill/50 bg-purplish/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purplish/25"
        >
          {showPasswordForm ? "Cancel" : "Change password"}
        </button>
      </div>

      {showPasswordForm ? (
        <form
          className="flex flex-col gap-4"
          autoComplete="on"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <input
            type="email"
            name="username"
            autoComplete="username"
            value={email}
            readOnly
            tabIndex={-1}
            className="sr-only"
            aria-hidden
          />

          <div className="space-y-2">
            <label
              htmlFor="profile-current-password"
              className="text-xs font-medium uppercase tracking-wide text-textGrey"
            >
              Current password
            </label>
            <p className="text-[11px] leading-relaxed text-textGrey/90">
              Your browser or password manager can fill this. We never store or show your
              password in plain text.
            </p>
            <div className="relative">
              <input
                id="profile-current-password"
                name="current-password"
                type={showCurrentPassword ? "text" : "password"}
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => onCurrentPasswordChange(e.target.value)}
                placeholder="Enter current password"
                className="w-full rounded-xl border border-white/15 bg-white/[0.06] py-2.5 pl-3 pr-11 text-sm text-white placeholder:text-white/25 focus:border-purplish focus:outline-none focus:ring-2 focus:ring-purplish/25"
              />
              <button
                type="button"
                onClick={onToggleShowCurrent}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-purpleFill/80 transition-colors hover:text-purpleFill"
                aria-label={
                  showCurrentPassword ? "Hide current password" : "Show current password"
                }
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="profile-new-password"
                className="text-xs font-medium uppercase tracking-wide text-textGrey"
              >
                New password
              </label>
              <div className="relative">
                <input
                  id="profile-new-password"
                  name="new-password"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => onNewPasswordChange(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.06] py-2.5 pl-3 pr-11 text-sm text-white placeholder:text-white/25 focus:border-purplish focus:outline-none focus:ring-2 focus:ring-purplish/25"
                />
                <button
                  type="button"
                  onClick={onToggleShowNew}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-purpleFill/80 transition-colors hover:text-purpleFill"
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="profile-confirm-password"
                className="text-xs font-medium uppercase tracking-wide text-textGrey"
              >
                Confirm new password
              </label>
              <input
                id="profile-confirm-password"
                name="confirm-new-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/15 bg-white/[0.06] py-2.5 px-3 text-sm text-white placeholder:text-white/25 focus:border-purplish focus:outline-none focus:ring-2 focus:ring-purplish/25"
              />
            </div>
          </div>

          {passwordsDontMatch && (
            <p className="text-sm text-red-400">Both new password fields do not match.</p>
          )}

          {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}

          <button
            type="submit"
            disabled={passwordSaving}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-purpleFill/60 bg-purplish/20 py-3 text-sm font-semibold text-white transition-colors hover:bg-purplish/30 sm:w-auto sm:min-w-[200px] sm:self-start",
              "disabled:pointer-events-none disabled:opacity-60"
            )}
          >
            {passwordSaving && <FaSpinner className="animate-spin" size={14} />}
            {passwordSaving ? "Updating…" : "Update password"}
          </button>
        </form>
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-8 text-center">
          <p className="font-mono text-lg tracking-widest text-white/40">••••••••</p>
          <p className="mt-2 text-xs text-textGrey">
            Click <span className="text-purpleFill">Change password</span> to update your
            password securely.
          </p>
        </div>
      )}
    </SectionCard>
  );
}
