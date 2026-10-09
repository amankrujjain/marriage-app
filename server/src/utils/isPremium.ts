export function isPremium(premiumUntil?: Date | null): boolean {
  return Boolean(premiumUntil && premiumUntil.getTime() > Date.now());
}
