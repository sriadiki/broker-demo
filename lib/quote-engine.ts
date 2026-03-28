export type ProductType = 'home' | 'auto' | 'health';

export interface QuoteInput {
  productType: ProductType;
  // Home
  homeValue?: number;
  state?: string;
  deductible?: number;
  // Auto
  vehicleCount?: number;
  driverCount?: number;
  zipCode?: string;
  // Health
  householdSize?: number;
  coverageType?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface QuoteResult {
  productType: ProductType;
  monthlyEstimateLow: number;
  monthlyEstimateHigh: number;
  assumptions: string[];
  disclaimer: string;
}

const STATE_MULTIPLIERS: Record<string, number> = {
  FL: 1.4, CA: 1.3, TX: 1.15, NY: 1.25, IL: 1.05,
  OH: 0.95, PA: 1.0, GA: 1.1, NC: 1.0, default: 1.0,
};

export function estimateQuote(input: QuoteInput): QuoteResult {
  const disclaimer =
    'This is an estimated range only and is not a binding quote. Final pricing depends on full underwriting, carrier approval, and individual risk factors. Contact an agent for an accurate quote.';

  if (input.productType === 'home') {
    const value = input.homeValue ?? 350000;
    const deductible = input.deductible ?? 2500;
    const stateMult = STATE_MULTIPLIERS[input.state ?? 'default'] ?? 1.0;
    const deductMult = deductible >= 5000 ? 0.85 : deductible >= 2500 ? 1.0 : 1.15;
    const base = (value / 1000) * 0.65 * stateMult * deductMult;
    return {
      productType: 'home',
      monthlyEstimateLow: Math.round(base * 0.85),
      monthlyEstimateHigh: Math.round(base * 1.2),
      assumptions: [
        `Home value: $${value.toLocaleString()}`,
        `Deductible: $${deductible.toLocaleString()}`,
        `State: ${input.state ?? 'National average'}`,
        'Standard coverage, no recent claims',
      ],
      disclaimer,
    };
  }

  if (input.productType === 'auto') {
    const vehicles = input.vehicleCount ?? 1;
    const drivers = input.driverCount ?? 1;
    const zip = input.zipCode ?? '75000';
    const urban = parseInt(zip) < 30000 || (parseInt(zip) >= 90000 && parseInt(zip) <= 96999);
    const urbanMult = urban ? 1.2 : 1.0;
    const base = vehicles * 85 + (drivers - 1) * 30;
    return {
      productType: 'auto',
      monthlyEstimateLow: Math.round(base * 0.9 * urbanMult),
      monthlyEstimateHigh: Math.round(base * 1.3 * urbanMult),
      assumptions: [
        `Vehicles: ${vehicles}`,
        `Drivers: ${drivers}`,
        `ZIP code: ${zip}`,
        'Good driving record, state minimum + collision',
      ],
      disclaimer,
    };
  }

  // health
  const size = input.householdSize ?? 1;
  const tierMult =
    input.coverageType === 'platinum' ? 1.5
    : input.coverageType === 'gold' ? 1.25
    : input.coverageType === 'silver' ? 1.0
    : 0.8;
  const base = 420 + (size - 1) * 310;
  return {
    productType: 'health',
    monthlyEstimateLow: Math.round(base * tierMult * 0.9),
    monthlyEstimateHigh: Math.round(base * tierMult * 1.15),
    assumptions: [
      `Household size: ${size}`,
      `Plan tier: ${input.coverageType ?? 'silver'}`,
      'ACA marketplace estimate, before subsidies',
    ],
    disclaimer,
  };
}
