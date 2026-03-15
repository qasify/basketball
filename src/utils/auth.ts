/**
 * Admin check: treat user as admin if their email is in NEXT_PUBLIC_ADMIN_EMAILS.
 * Set in .env.local: NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com, adomas@admin.com
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email?.trim()) return false;
  const list = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
  if (!list?.trim()) return false;
  const emails = list.split(",").map((e) => e.trim().toLowerCase());
  return emails.includes(email.trim().toLowerCase());
}
