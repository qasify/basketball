"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { User, Mail, Calendar, ShieldCheck } from "lucide-react";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  getAuth,
} from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { usersDB } from "@/_api/firebase-api";
import { InfoRow } from "./InfoRow";
import { SectionCard } from "./SectionCard";
import { ProfileHero } from "./ProfileHero";
import { ProfilePasswordSection } from "./ProfilePasswordSection";
import { notify } from "@/lib/notify";
import { toastMessage } from "@/utils/constants/toastMessage";

export default function ProfileView() {
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSaved, setNameSaved] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [joinedAt, setJoinedAt] = useState<string | null>(null);
  const passwordsDontMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword !== confirmPassword;

  useEffect(() => {
    if (!user) return;
    const fallback = user.displayName?.trim() || user.email?.split("@")[0] || "";
    setDisplayName(fallback);
    setNameInput(fallback);

    usersDB.getProfile(user.uid).then((profile) => {
      if (profile?.displayName) {
        setDisplayName(profile.displayName);
        setNameInput(profile.displayName);
      }
      if (profile?.createdAt) {
        setJoinedAt(
          new Date(profile.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
      }
    });
  }, [user]);

  const handleSaveName = async () => {
    if (!user || !nameInput.trim()) return;
    setSavingName(true);
    setNameError(null);
    try {
      await usersDB.updateDisplayName(user.uid, nameInput.trim());
      setDisplayName(nameInput.trim());
      setEditingName(false);
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 3000);
      notify.success(toastMessage.profile.displayNameSaved);
    } catch {
      setNameError("Failed to update name. Try again.");
      notify.error(toastMessage.profile.displayNameErrorTitle, {
        description: toastMessage.profile.displayNameErrorDesc,
      });
    } finally {
      setSavingName(false);
    }
  };

  const handleCancelName = () => {
    setNameInput(displayName);
    setEditingName(false);
    setNameError(null);
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError("Enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match.");
      return;
    }

    setPasswordSaving(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser?.email) throw new Error("Not signed in");

      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);

      setPasswordSaved(true);
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSaved(false), 4000);
      notify.success(toastMessage.profile.passwordUpdatedTitle, {
        description: toastMessage.profile.passwordUpdatedDesc,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password.";
      if (msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        setPasswordError("Current password is incorrect.");
        notify.error(toastMessage.profile.passwordWrongTitle, {
          description: toastMessage.profile.passwordWrongDesc,
        });
      } else {
        setPasswordError(msg);
        notify.error(toastMessage.profile.passwordChangeErrorTitle, {
          description: msg,
        });
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  const togglePasswordForm = () => {
    const nextOpen = !showPasswordForm;
    setShowPasswordForm(nextOpen);
    setPasswordError(null);

    if (nextOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] w-full items-center justify-center gap-3 text-textGrey">
        <FaSpinner className="animate-spin text-purple-400" size={28} />
        <span className="text-sm">Loading profile…</span>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const email = user.email ?? "";

  return (
    <div className="w-full min-w-0 space-y-6 lg:space-y-8">
      <ProfileHero
        displayName={displayName}
        email={email}
        role={role}
        editingName={editingName}
        nameInput={nameInput}
        onNameInputChange={setNameInput}
        onSaveName={handleSaveName}
        onCancelName={handleCancelName}
        onStartEditName={() => setEditingName(true)}
        savingName={savingName}
        nameError={nameError}
        nameSaved={nameSaved}
      />

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <SectionCard
            title="Account details"
            subtitle="Information tied to your account. Email is read-only here."
            icon={<User className="h-4 w-4" aria-hidden />}
          >
            <InfoRow
              label="Email"
              value={email}
              icon={<Mail className="h-3.5 w-3.5 text-purpleFill/70" aria-hidden />}
            />
            <InfoRow
              label="Role"
              value={role ?? "user"}
              icon={<ShieldCheck className="h-3.5 w-3.5 text-purpleFill/70" aria-hidden />}
            />
            <InfoRow
              label="Member since"
              value={joinedAt}
              icon={<Calendar className="h-3.5 w-3.5 text-purpleFill/70" aria-hidden />}
            />
          </SectionCard>
        </div>

        <div className="lg:col-span-7">
          <ProfilePasswordSection
            email={email}
            showPasswordForm={showPasswordForm}
            onToggleForm={togglePasswordForm}
            currentPassword={currentPassword}
            onCurrentPasswordChange={setCurrentPassword}
            newPassword={newPassword}
            onNewPasswordChange={setNewPassword}
            confirmPassword={confirmPassword}
            onConfirmPasswordChange={setConfirmPassword}
            showCurrentPassword={showCurrentPassword}
            onToggleShowCurrent={() => setShowCurrentPassword((v) => !v)}
            showNewPassword={showNewPassword}
            onToggleShowNew={() => setShowNewPassword((v) => !v)}
            passwordsDontMatch={passwordsDontMatch}
            passwordError={passwordError}
            passwordSaving={passwordSaving}
            passwordSaved={passwordSaved}
            onSubmit={handleChangePassword}
          />
        </div>
      </div>
    </div>
  );
}
