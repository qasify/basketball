import type { ReactNode } from "react";

/** Single row in the account details list */
export type InfoRowProps = {
  label: string;
  value: string | undefined | null;
  icon?: ReactNode;
};

/** Card wrapper for profile sections (account, password, etc.) */
export type SectionCardProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Top banner: avatar, display name edit, email, role badge */
export type ProfileHeroProps = {
  displayName: string;
  email: string;
  role: "admin" | "user" | null;
  editingName: boolean;
  nameInput: string;
  onNameInputChange: (value: string) => void;
  onSaveName: () => void;
  onCancelName: () => void;
  onStartEditName: () => void;
  savingName: boolean;
  nameError: string | null;
  nameSaved: boolean;
};

/** Password change form + collapsed state (controlled by parent) */
export type ProfilePasswordSectionProps = {
  email: string;
  showPasswordForm: boolean;
  onToggleForm: () => void;
  currentPassword: string;
  onCurrentPasswordChange: (v: string) => void;
  newPassword: string;
  onNewPasswordChange: (v: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (v: string) => void;
  showCurrentPassword: boolean;
  onToggleShowCurrent: () => void;
  showNewPassword: boolean;
  onToggleShowNew: () => void;
  passwordsDontMatch: boolean;
  passwordError: string | null;
  passwordSaving: boolean;
  passwordSaved: boolean;
  onSubmit: () => void;
};
