/**
 * Pure checks for Wedding Pass duration math (no DB).
 * Run: node scripts/test-next-premium-until.mjs
 */
const PREMIUM_DURATION_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

function isPremium(premiumUntil, now = Date.now()) {
  if (!premiumUntil) return false;
  const ms =
    premiumUntil instanceof Date
      ? premiumUntil.getTime()
      : new Date(premiumUntil).getTime();
  return Number.isFinite(ms) && ms > now;
}

function nextPremiumUntil(current, now = Date.now()) {
  const base = current && isPremium(current, now) ? current.getTime() : now;
  return new Date(base + PREMIUM_DURATION_DAYS * DAY_MS);
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const t0 = Date.parse('2026-11-06T07:19:21.200Z');
const first = nextPremiumUntil(null, t0);
assert(
  first.getTime() === t0 + 30 * DAY_MS,
  `first grant expected +30d, got ${first.toISOString()}`,
);

const t1 = Date.parse('2026-11-06T08:05:41.498Z');
const second = nextPremiumUntil(first, t1);
assert(
  second.getTime() === first.getTime() + 30 * DAY_MS,
  `extend expected +30d on top of active pass, got ${second.toISOString()}`,
);
assert(
  second.toISOString() === '2027-01-05T07:19:21.200Z',
  `expected 2027-01-05…, got ${second.toISOString()}`,
);

const expired = new Date(t0 - DAY_MS);
const afterExpiry = nextPremiumUntil(expired, t0);
assert(
  afterExpiry.getTime() === t0 + 30 * DAY_MS,
  'expired pass should restart from now',
);

assert(isPremium(first, t0 + 1000), 'active pass');
assert(!isPremium(expired, t0), 'expired pass');
assert(isPremium(first.toISOString(), t0 + 1000), 'ISO string premiumUntil');

console.log('test-next-premium-until: all passed');
