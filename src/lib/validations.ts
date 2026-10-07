/**
 * Zod validation schemas for all nutytales forms.
 *
 * Schemas are exported individually and are usable with react-hook-form's
 * zodResolver.  All field names match the corresponding Prisma model fields.
 */

import { z } from 'zod'

// ─── Reusable Field Definitions ───────────────────────────────────────────────

const phoneIN = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email('Enter a valid email address')

const pincode = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code')

const gstinOptional = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    'Enter a valid GSTIN',
  )
  .optional()
  .or(z.literal(''))

const nonEmpty = (label: string) =>
  z.string().trim().min(1, `${label} is required`)

const positiveNumber = (label: string) =>
  z.number().positive(`${label} must be positive`)

// ─── Address ──────────────────────────────────────────────────────────────────

export const addressSchema = z.object({
  fullName: nonEmpty('Full name'),
  phone: phoneIN,
  addressLine1: nonEmpty('Address line 1'),
  addressLine2: z.string().trim().optional(),
  city: nonEmpty('City'),
  state: nonEmpty('State'),
  pincode,
  country: z.string().default('India'),
  isDefault: z.boolean().default(false),
})

export type AddressFormValues = z.infer<typeof addressSchema>

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: nonEmpty('Full name'),
    email,
    phone: phoneIN,
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms & conditions',
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

// ─── Contact Form ─────────────────────────────────────────────────────────────

export const contactFormSchema = z.object({
  name: nonEmpty('Name'),
  email,
  phone: phoneIN.optional().or(z.literal('')),
  subject: nonEmpty('Subject'),
  message: z
    .string()
    .trim()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

// ─── B2B Lead Form ────────────────────────────────────────────────────────────

export const leadFormSchema = z.object({
  contactName: nonEmpty('Contact name'),
  email,
  phone: phoneIN,
  companyName: nonEmpty('Company name'),
  businessType: z.enum([
    'retailer',
    'wholesaler',
    'distributor',
    'restaurant',
    'hotel',
    'corporate',
    'other',
  ]),
  city: nonEmpty('City'),
  state: nonEmpty('State'),
  estimatedMonthlyVolume: z
    .string()
    .trim()
    .min(1, 'Please indicate your estimated monthly volume'),
  message: z.string().trim().max(1000).optional(),
  location: z.enum(['NOIDA', 'KASHMIR', 'PATNA']).optional(),
})

export type LeadFormValues = z.infer<typeof leadFormSchema>

// ─── B2B Business Registration ────────────────────────────────────────────────

export const businessRegistrationSchema = z.object({
  // Auth
  email,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),

  // Personal
  contactName: nonEmpty('Contact name'),
  phone: phoneIN,
  designation: z.string().trim().optional(),

  // Business
  companyName: nonEmpty('Company name'),
  businessType: z.enum([
    'retailer',
    'wholesaler',
    'distributor',
    'restaurant',
    'hotel',
    'corporate',
    'other',
  ]),
  gstin: gstinOptional,
  panNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter a valid PAN number')
    .optional()
    .or(z.literal('')),
  fssaiNumber: z
    .string()
    .trim()
    .regex(/^\d{14}$/, 'FSSAI number must be 14 digits')
    .optional()
    .or(z.literal('')),

  // Address
  addressLine1: nonEmpty('Address'),
  addressLine2: z.string().trim().optional(),
  city: nonEmpty('City'),
  state: nonEmpty('State'),
  pincode,

  // Business details
  estimatedMonthlyVolume: nonEmpty('Estimated monthly volume'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms & conditions',
  }),
})

export type BusinessRegistrationFormValues = z.infer<
  typeof businessRegistrationSchema
>

// ─── RFQ / Bulk Quote Request ─────────────────────────────────────────────────

const rfqItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID').optional().or(z.literal('')),
  productName: nonEmpty('Product name'),
  category: z.string().trim().optional(),
  quantityKg: positiveNumber('Quantity'),
  packagingPreference: z
    .enum(['bulk', 'retail_pack', 'custom'])
    .optional(),
  notes: z.string().trim().max(500).optional(),
})

export type RFQItem = z.infer<typeof rfqItemSchema>

export const rfqSchema = z.object({
  // Contact
  contactName: nonEmpty('Contact name'),
  email,
  phone: phoneIN,
  companyName: z.string().trim().optional(),

  // Delivery
  deliveryCity: nonEmpty('Delivery city'),
  deliveryState: nonEmpty('Delivery state'),
  deliveryPincode: pincode,

  // Items (at least one product)
  items: z
    .array(rfqItemSchema)
    .min(1, 'Add at least one product to your quote request'),

  // Logistics
  requiredByDate: z
    .string()
    .datetime({ offset: true })
    .optional()
    .or(z.literal('')),
  deliveryFrequency: z
    .enum(['one_time', 'weekly', 'fortnightly', 'monthly'])
    .optional(),

  // Financial
  preferredPaymentTerms: z
    .enum(['advance', 'net_7', 'net_15', 'net_30'])
    .optional(),

  additionalNotes: z.string().trim().max(2000).optional(),
})

export type RFQFormValues = z.infer<typeof rfqSchema>

// ─── B2C Checkout ─────────────────────────────────────────────────────────────

export const checkoutB2CSchema = z.object({
  shippingAddress: addressSchema,
  billingAddressSameAsShipping: z.boolean().default(true),
  paymentMethod: z.enum(['razorpay', 'cod']),
  couponCode: z.string().trim().optional(),
  orderNotes: z.string().trim().max(500).optional(),
})

export type CheckoutB2CFormValues = z.infer<typeof checkoutB2CSchema>

// ─── B2B Checkout ─────────────────────────────────────────────────────────────

export const checkoutB2BSchema = z.object({
  shippingAddress: addressSchema,
  billingAddressSameAsShipping: z.boolean().default(true),
  billingAddress: addressSchema.optional(),
  gstin: gstinOptional,
  purchaseOrderNumber: z.string().trim().optional(),
  paymentMethod: z.enum(['razorpay', 'bank_transfer', 'credit_terms']),
  deliveryDate: z.string().datetime({ offset: true }).optional().or(z.literal('')),
  orderNotes: z.string().trim().max(1000).optional(),
})

export type CheckoutB2BFormValues = z.infer<typeof checkoutB2BSchema>

// ─── Review ───────────────────────────────────────────────────────────────────

export const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  title: nonEmpty('Review title').max(100),
  body: z
    .string()
    .trim()
    .min(10, 'Review must be at least 10 characters')
    .max(2000),
  verifiedPurchase: z.boolean().default(false),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>

// ─── Admin — Product ──────────────────────────────────────────────────────────

export const productSchema = z.object({
  name: nonEmpty('Product name'),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, or hyphens'),
  description: nonEmpty('Description'),
  shortDescription: z.string().trim().max(300).optional(),
  category: nonEmpty('Category'),
  sku: nonEmpty('SKU'),
  weightG: positiveNumber('Weight'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isB2B: z.boolean().default(false),
  tags: z.array(z.string().trim()).optional(),
  metaTitle: z.string().trim().max(60).optional(),
  metaDescription: z.string().trim().max(160).optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>

// ─── Admin — Inventory ────────────────────────────────────────────────────────

export const inventorySchema = z.object({
  productId: z.string().uuid(),
  locationCode: z.enum(['NOIDA', 'KASHMIR', 'PATNA']),
  quantityG: z
    .number()
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative'),
  reorderThresholdG: z
    .number()
    .int()
    .min(0)
    .optional(),
  batchNumber: z.string().trim().optional(),
  expiryDate: z.string().datetime({ offset: true }).optional().or(z.literal('')),
})

export type InventoryFormValues = z.infer<typeof inventorySchema>

// ─── Admin — Price ────────────────────────────────────────────────────────────

export const priceSchema = z.object({
  productId: z.string().uuid(),
  /** Selling price shown to customers (always in ₹) */
  sellingPrice: positiveNumber('Selling price'),
  /** Original / MRP for strikethrough display */
  mrp: positiveNumber('MRP').optional(),
  /** GST rate applicable to this product (%) */
  gstPercent: z
    .number()
    .min(0)
    .max(28)
    .default(5),
  /** B2B tier pricing */
  b2bTiers: z
    .array(
      z.object({
        minQtyG: positiveNumber('Minimum quantity'),
        pricePerKg: positiveNumber('Price per kg'),
      }),
    )
    .optional(),
  validFrom: z.string().datetime({ offset: true }).optional().or(z.literal('')),
  validTo: z.string().datetime({ offset: true }).optional().or(z.literal('')),
})

export type PriceFormValues = z.infer<typeof priceSchema>
