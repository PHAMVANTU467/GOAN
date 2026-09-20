import type { AccountProfile } from "../domain/AuthModels";

// Display context only, never an authentication credential or permission check.
export class AccountProfileStore {
  private static readonly key = "goan.account-profile";

  static read(): AccountProfile | null {
    try {
      const raw = sessionStorage.getItem(this.key) ?? localStorage.getItem(this.key);
      if (!raw) return null;
      const profile = JSON.parse(raw);
      return typeof profile?.userId === "string" && typeof profile?.fullName === "string"
        ? { userId: profile.userId, fullName: profile.fullName }
        : null;
    } catch { return null; }
  }

  static save(profile: AccountProfile, remember: boolean): void {
    this.clear();
    try {
      (remember ? localStorage : sessionStorage).setItem(this.key, JSON.stringify({
        userId: profile.userId, fullName: profile.fullName,
      }));
    } catch { /* App state still displays the signed-in name if storage is blocked. */ }
  }

  static clear(): void {
    try { localStorage.removeItem(this.key); } catch { /* Storage may be blocked. */ }
    try { sessionStorage.removeItem(this.key); } catch { /* Storage may be blocked. */ }
  }
}
