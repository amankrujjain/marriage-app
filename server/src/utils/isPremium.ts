export function isPremium(premiumUntil?: Date | string | null): boolean {
  if (!premiumUntil) return false;
  const ms =
    premiumUntil instanceof Date
      ? premiumUntil.getTime()
      : new Date(premiumUntil).getTime();
  return Number.isFinite(ms) && ms > Date.now();
}
