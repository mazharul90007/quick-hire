/**
 * Course API returns `priceAmount` as major units (may include decimals).
 * Purchase rows still use Stripe minor units — use formatStripeMinorAmount for those.
 */
export function formatCourseMajorPrice(major: number, currency: string): string {
  const hasFraction = Math.abs(major % 1) > 1e-9;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: hasFraction ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(major);
  } catch {
    return `${major} ${currency.toUpperCase()}`;
  }
}

/** For CoursePurchase.amount etc. (Stripe minor units, e.g. cents / poisha). */
export function formatStripeMinorAmount(minor: number, currency: string): string {
  try {
    const zeroDecimal = new Set([
      "bif",
      "clp",
      "djf",
      "gnf",
      "jpy",
      "kmf",
      "krw",
      "mga",
      "pyg",
      "rwf",
      "ugx",
      "vnd",
      "vuv",
      "xaf",
      "xof",
      "xpf",
    ]);
    const c = currency.toLowerCase();
    const major = zeroDecimal.has(c) ? minor : minor / 100;
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: zeroDecimal.has(c) ? 0 : 2,
      maximumFractionDigits: zeroDecimal.has(c) ? 0 : 2,
    }).format(major);
  } catch {
    return `${minor} ${currency.toUpperCase()}`;
  }
}
