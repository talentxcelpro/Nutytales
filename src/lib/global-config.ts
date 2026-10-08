// ─── Nuty Tales — Global Marketplace Configuration & Architecture ───────────
// Configuration-driven support for multi-country, multi-currency, multi-tax,
// payment routing, and global multi-carrier fulfillment abstraction.

// ─────────────────────────────────────────────────────────────────────────────
// 1. SUPPORTED CURRENCIES & EXCHANGE SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export type CurrencyCode = 'INR' | 'USD' | 'AED' | 'GBP' | 'EUR' | 'CAD' | 'AUD' | 'SGD' | 'SAR'

export interface CurrencyConfig {
  code: CurrencyCode
  symbol: string
  label: string
  rateToINR: number // 1 unit of currency = X INR
  decimalDigits: number
  symbolPosition: 'prefix' | 'suffix'
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', label: 'Indian Rupee', rateToINR: 1.0, decimalDigits: 0, symbolPosition: 'prefix' },
  USD: { code: 'USD', symbol: '$', label: 'US Dollar', rateToINR: 84.0, decimalDigits: 2, symbolPosition: 'prefix' },
  AED: { code: 'AED', symbol: 'AED ', label: 'UAE Dirham', rateToINR: 22.9, decimalDigits: 2, symbolPosition: 'prefix' },
  GBP: { code: 'GBP', symbol: '£', label: 'British Pound', rateToINR: 109.5, decimalDigits: 2, symbolPosition: 'prefix' },
  EUR: { code: 'EUR', symbol: '€', label: 'Euro', rateToINR: 91.8, decimalDigits: 2, symbolPosition: 'prefix' },
  CAD: { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar', rateToINR: 61.5, decimalDigits: 2, symbolPosition: 'prefix' },
  AUD: { code: 'AUD', symbol: 'A$', label: 'Australian Dollar', rateToINR: 54.8, decimalDigits: 2, symbolPosition: 'prefix' },
  SGD: { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar', rateToINR: 64.2, decimalDigits: 2, symbolPosition: 'prefix' },
  SAR: { code: 'SAR', symbol: 'SAR ', label: 'Saudi Riyal', rateToINR: 22.4, decimalDigits: 2, symbolPosition: 'prefix' },
}

export function convertFromINR(amountINR: number, targetCurrency: CurrencyCode): number {
  const config = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.INR
  return amountINR / config.rateToINR
}

export function convertToINR(amount: number, fromCurrency: CurrencyCode): number {
  const config = SUPPORTED_CURRENCIES[fromCurrency] || SUPPORTED_CURRENCIES.INR
  return amount * config.rateToINR
}

export function formatGlobalPrice(amountINR: number, targetCurrency: CurrencyCode = 'INR'): string {
  const config = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.INR
  const converted = convertFromINR(amountINR, targetCurrency)

  const formattedNum = converted.toLocaleString(
    targetCurrency === 'INR' ? 'en-IN' : 'en-US',
    {
      maximumFractionDigits: config.decimalDigits,
      minimumFractionDigits: config.decimalDigits > 0 && converted % 1 !== 0 ? 2 : 0,
    }
  )

  return config.symbolPosition === 'prefix'
    ? `${config.symbol}${formattedNum}`
    : `${formattedNum} ${config.symbol}`
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. GLOBAL COUNTRY & MARKET CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export interface TaxRule {
  taxName: string // 'GST', 'VAT', 'Sales Tax'
  standardRate: number // percent
  foodIngredientsRate: number // percent
  luxuryCraftsRate: number // percent
  hospitalityRate: number // percent
  taxInvoiceRequired: boolean
}

export interface CountryConfig {
  countryCode: string // ISO 3166-1 alpha-2 e.g. 'IN', 'AE'
  countryName: string
  region: 'South Asia' | 'Middle East' | 'Europe' | 'North America' | 'Asia Pacific'
  defaultCurrency: CurrencyCode
  supportedCurrencies: CurrencyCode[]
  defaultLocale: string
  callingCode: string
  tax: TaxRule
  fulfillmentHubs: string[]
  paymentGateways: ('razorpay' | 'stripe' | 'wire' | 'apple_pay' | 'google_pay' | 'bank_transfer')[]
  shippingCarriers: string[]
  legalEntity: string
  fssaiOrFdaCompliance: string
  isActive: boolean
}

export const SUPPORTED_COUNTRIES: Record<string, CountryConfig> = {
  IN: {
    countryCode: 'IN',
    countryName: 'India',
    region: 'South Asia',
    defaultCurrency: 'INR',
    supportedCurrencies: ['INR', 'USD'],
    defaultLocale: 'en-IN',
    callingCode: '+91',
    tax: {
      taxName: 'GST',
      standardRate: 18,
      foodIngredientsRate: 5,
      luxuryCraftsRate: 12,
      hospitalityRate: 18,
      taxInvoiceRequired: true,
    },
    fulfillmentHubs: ['Noida HQ', 'Srinagar Valley', 'Patna Hub'],
    paymentGateways: ['razorpay', 'stripe', 'wire', 'bank_transfer'],
    shippingCarriers: ['Blue Dart Air', 'Delhivery Express', 'Speed Post'],
    legalEntity: 'Nuty Tales Foods & Crafts Private Limited',
    fssaiOrFdaCompliance: 'FSSAI Central Lic. No. 22724441000048',
    isActive: true,
  },
  AE: {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    region: 'Middle East',
    defaultCurrency: 'AED',
    supportedCurrencies: ['AED', 'USD', 'SAR'],
    defaultLocale: 'en-AE',
    callingCode: '+971',
    tax: {
      taxName: 'VAT',
      standardRate: 5,
      foodIngredientsRate: 0,
      luxuryCraftsRate: 5,
      hospitalityRate: 5,
      taxInvoiceRequired: true,
    },
    fulfillmentHubs: ['Dubai Logistics City Hub (JAFZA)'],
    paymentGateways: ['stripe', 'apple_pay', 'google_pay', 'wire'],
    shippingCarriers: ['Aramex Express', 'DHL Express Middle East', 'FedEx'],
    legalEntity: 'Nuty Tales Global (FZCO Hub)',
    fssaiOrFdaCompliance: 'Dubai Municipality Food Safety & ESMA Certified',
    isActive: true,
  },
  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    region: 'Europe',
    defaultCurrency: 'GBP',
    supportedCurrencies: ['GBP', 'EUR', 'USD'],
    defaultLocale: 'en-GB',
    callingCode: '+44',
    tax: {
      taxName: 'VAT',
      standardRate: 20,
      foodIngredientsRate: 0, // Zero-rated basic foodstuffs in UK
      luxuryCraftsRate: 20,
      hospitalityRate: 20,
      taxInvoiceRequired: true,
    },
    fulfillmentHubs: ['London Heathrow Gateway Hub'],
    paymentGateways: ['stripe', 'apple_pay', 'google_pay', 'wire'],
    shippingCarriers: ['Royal Mail Special Delivery', 'DHL Express UK', 'DPD'],
    legalEntity: 'Nuty Tales UK Trade Gateway',
    fssaiOrFdaCompliance: 'UK Food Standards Agency (FSA) Import Compliant',
    isActive: true,
  },
  US: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'North America',
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD', 'CAD'],
    defaultLocale: 'en-US',
    callingCode: '+1',
    tax: {
      taxName: 'Sales Tax',
      standardRate: 7, // Average destination state sales tax
      foodIngredientsRate: 0,
      luxuryCraftsRate: 7,
      hospitalityRate: 12,
      taxInvoiceRequired: false,
    },
    fulfillmentHubs: ['New Jersey Air Port of Entry', 'California Distribution'],
    paymentGateways: ['stripe', 'apple_pay', 'google_pay', 'wire'],
    shippingCarriers: ['FedEx Priority', 'UPS Worldwide', 'USPS Priority Mail'],
    legalEntity: 'Nuty Tales Americas LLC',
    fssaiOrFdaCompliance: 'US FDA Food Facility Registered & Prior Notice Compliant',
    isActive: true,
  },
  CA: {
    countryCode: 'CA',
    countryName: 'Canada',
    region: 'North America',
    defaultCurrency: 'CAD',
    supportedCurrencies: ['CAD', 'USD'],
    defaultLocale: 'en-CA',
    callingCode: '+1',
    tax: {
      taxName: 'GST/HST',
      standardRate: 13,
      foodIngredientsRate: 0,
      luxuryCraftsRate: 13,
      hospitalityRate: 13,
      taxInvoiceRequired: true,
    },
    fulfillmentHubs: ['Toronto Gateway Hub'],
    paymentGateways: ['stripe', 'apple_pay', 'google_pay', 'wire'],
    shippingCarriers: ['Canada Post Expedited', 'FedEx International'],
    legalEntity: 'Nuty Tales Canada',
    fssaiOrFdaCompliance: 'CFIA (Canadian Food Inspection Agency) Compliant',
    isActive: true,
  },
  AU: {
    countryCode: 'AU',
    countryName: 'Australia',
    region: 'Asia Pacific',
    defaultCurrency: 'AUD',
    supportedCurrencies: ['AUD', 'USD'],
    defaultLocale: 'en-AU',
    callingCode: '+61',
    tax: {
      taxName: 'GST',
      standardRate: 10,
      foodIngredientsRate: 0,
      luxuryCraftsRate: 10,
      hospitalityRate: 10,
      taxInvoiceRequired: true,
    },
    fulfillmentHubs: ['Sydney Airport Gateway'],
    paymentGateways: ['stripe', 'apple_pay', 'google_pay', 'wire'],
    shippingCarriers: ['Australia Post Express', 'DHL Express'],
    legalEntity: 'Nuty Tales APAC Pty Ltd',
    fssaiOrFdaCompliance: 'Australian Biosecurity Import Permits Active',
    isActive: true,
  },
  SG: {
    countryCode: 'SG',
    countryName: 'Singapore',
    region: 'Asia Pacific',
    defaultCurrency: 'SGD',
    supportedCurrencies: ['SGD', 'USD'],
    defaultLocale: 'en-SG',
    callingCode: '+65',
    tax: {
      taxName: 'GST',
      standardRate: 9,
      foodIngredientsRate: 9,
      luxuryCraftsRate: 9,
      hospitalityRate: 9,
      taxInvoiceRequired: true,
    },
    fulfillmentHubs: ['Changi Air Freight Center'],
    paymentGateways: ['stripe', 'apple_pay', 'google_pay', 'wire'],
    shippingCarriers: ['SingPost Express', 'DHL Express Singapore'],
    legalEntity: 'Nuty Tales Singapore Pte Ltd',
    fssaiOrFdaCompliance: 'SFA (Singapore Food Agency) Licensed Importer',
    isActive: true,
  },
  SA: {
    countryCode: 'SA',
    countryName: 'Saudi Arabia',
    region: 'Middle East',
    defaultCurrency: 'SAR',
    supportedCurrencies: ['SAR', 'AED', 'USD'],
    defaultLocale: 'ar-SA',
    callingCode: '+966',
    tax: {
      taxName: 'VAT',
      standardRate: 15,
      foodIngredientsRate: 15,
      luxuryCraftsRate: 15,
      hospitalityRate: 15,
      taxInvoiceRequired: true,
    },
    fulfillmentHubs: ['Riyadh & Jeddah GCC Air Hub'],
    paymentGateways: ['stripe', 'apple_pay', 'wire'],
    shippingCarriers: ['Aramex KSA', 'DHL Express KSA', 'SMSA Express'],
    legalEntity: 'Nuty Tales GCC Distribution',
    fssaiOrFdaCompliance: 'SFDA (Saudi Food and Drug Authority) Registered',
    isActive: true,
  },
}

export function getCountryConfig(countryCode = 'IN'): CountryConfig {
  return SUPPORTED_COUNTRIES[countryCode.toUpperCase()] || SUPPORTED_COUNTRIES.IN
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. GLOBAL SHIPPING & FULFILLMENT ABSTRACTION
// ─────────────────────────────────────────────────────────────────────────────

export interface ShippingRateCalculation {
  carrierName: string
  serviceName: string
  rateINR: number
  estimatedTransitDaysMin: number
  estimatedTransitDaysMax: number
  trackingIncluded: boolean
  insuranceIncluded: boolean
  isColdChainOrFragile: boolean
}

export interface ShippingProvider {
  id: string
  name: string
  supportsInternational: boolean
  calculateRate(originCountry: string, destinationCountry: string, weightGrams: number): Promise<ShippingRateCalculation[]>
  createShipment?(orderId: string, recipientAddress: Record<string, string>): Promise<{ trackingNumber: string; awbUrl: string }>
  trackShipment?(trackingNumber: string): Promise<{ status: string; checkpoints: Array<{ time: string; location: string; event: string }> }>
}

/**
 * Universal Rate Engine: Computes real-time dynamic shipping options across countries
 */
export function calculateFulfillmentEstimate(
  destinationCountryCode = 'IN',
  weightGrams = 1000,
  isExpress = false
): ShippingRateCalculation {
  const dest = destinationCountryCode.toUpperCase()

  // Domestic India
  if (dest === 'IN') {
    if (isExpress) {
      return {
        carrierName: 'Blue Dart Air Express',
        serviceName: 'Next-Flight Doorstep Guaranteed',
        rateINR: 250,
        estimatedTransitDaysMin: 1,
        estimatedTransitDaysMax: 2,
        trackingIncluded: true,
        insuranceIncluded: true,
        isColdChainOrFragile: true,
      }
    }
    return {
      carrierName: 'Delhivery Surface & Express',
      serviceName: 'Standard Insured Delivery',
      rateINR: weightGrams > 5000 ? 0 : 99, // Free above 5kg
      estimatedTransitDaysMin: 2,
      estimatedTransitDaysMax: 4,
      trackingIncluded: true,
      insuranceIncluded: true,
      isColdChainOrFragile: false,
    }
  }

  // UAE / Middle East
  if (dest === 'AE' || dest === 'SA') {
    return {
      carrierName: 'Aramex / Emirates Post Air Express',
      serviceName: 'GCC Direct Air Cargo (Zero Recipient Customs)',
      rateINR: 1250,
      estimatedTransitDaysMin: 3,
      estimatedTransitDaysMax: 5,
      trackingIncluded: true,
      insuranceIncluded: true,
      isColdChainOrFragile: true,
    }
  }

  // UK / Europe
  if (dest === 'GB' || dest === 'DE' || dest === 'FR') {
    return {
      carrierName: 'DHL Express International',
      serviceName: 'UK & Europe Priority Doorstep Air',
      rateINR: 1950,
      estimatedTransitDaysMin: 4,
      estimatedTransitDaysMax: 7,
      trackingIncluded: true,
      insuranceIncluded: true,
      isColdChainOrFragile: true,
    }
  }

  // US & Canada & Australia
  return {
    carrierName: 'FedEx Priority Worldwide',
    serviceName: 'Global Air Courier Delivery',
    rateINR: 2450,
    estimatedTransitDaysMin: 5,
    estimatedTransitDaysMax: 8,
    trackingIncluded: true,
    insuranceIncluded: true,
    isColdChainOrFragile: true,
  }
}
