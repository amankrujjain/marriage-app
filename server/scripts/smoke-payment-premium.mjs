/**
 * Smoke-check: every user with a fulfilled Wedding Pass order must be premium.
 * Run: node scripts/smoke-payment-premium.mjs
 * (from server/, with MONGODB_URI or default local DB)
 */
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/marriage-biodata';

function isPremium(premiumUntil) {
  return Boolean(premiumUntil && new Date(premiumUntil).getTime() > Date.now());
}

const client = new MongoClient(uri);
await client.connect();
const db = client.db();

const fulfilled = await db
  .collection('paymentorders')
  .aggregate([
    { $match: { status: 'fulfilled', planSlug: 'wedding-pass' } },
    {
      $group: {
        _id: '$userId',
        orders: { $sum: 1 },
        lastFulfilledAt: { $max: '$fulfilledAt' },
        invoices: { $push: '$invoiceNumber' },
      },
    },
  ])
  .toArray();

let ok = 0;
let bad = 0;

for (const row of fulfilled) {
  const user = await db.collection('users').findOne({ _id: new ObjectId(String(row._id)) });
  if (!user) {
    console.error('MISSING_USER', String(row._id), row.invoices);
    bad += 1;
    continue;
  }
  const premium = isPremium(user.premiumUntil);
  const line = {
    email: user.email,
    orders: row.orders,
    premiumUntil: user.premiumUntil,
    isPremium: premium,
    invoices: row.invoices,
  };
  if (premium) {
    ok += 1;
    console.log('OK', JSON.stringify(line));
  } else {
    bad += 1;
    console.error('FAIL', JSON.stringify(line));
  }
}

console.log(`\nSummary: ${ok} ok, ${bad} failing (of ${fulfilled.length} paid users)`);
await client.close();
process.exit(bad > 0 ? 1 : 0);
