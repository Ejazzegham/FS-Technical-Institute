// Single source of truth for which account is allowed into the admin panel.
// This is a small site with one admin, so access is gated purely by email
// address rather than a roles/claims system — both here (for the UI, in
// AdminAuthGuard + the admin login page) and in firestore.rules (the real
// security boundary; the UI check alone can't stop a direct API call).
//
// To change who the admin is, update this value AND the matching value in
// firestore.rules, then re-publish the rules in the Firebase Console.
export const ADMIN_EMAIL = "fstechins@gmail.com";

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && email.trim().toLowerCase() === ADMIN_EMAIL;
}
