/**
 * The cart must carry the canonical variant SKU, never the dosage label.
 *
 * `app/checkout/actions.ts` re-reads each product from the database and resolves
 * the price with `product.variants.find(v => v.sku === item.variantSku)`,
 * throwing when that lookup fails. Before this fix the product page passed the
 * selected dosage ("10mg") where the SKU ("TIRZEP-10MG") was expected, so any
 * product with `hasVariants: true` would have failed at order creation.
 *
 * These tests pin the resolver and the price that follows from it. They use
 * fixtures rather than the production database: no order is created.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

import {
  toShopCardProduct,
  getProductDisplayDetails,
  resolveCardVariant,
} from '../shopCardProduct'
import { getEffectivePrice, type ShopProduct } from '../types/shop'

/** Prices are the supplied CSV values for these variants. */
const GLP_1TRZ = {
  id: 4,
  name: 'GLP-1TRZ',
  slug: 'glp-1trz',
  description: '',
  price: 65.99,
  salePrice: null,
  stock: 23,
  hasVariants: true,
  categories: [],
  images: [],
  variants: [
    { sku: 'TIRZEP-10MG', price: 65.99, salePrice: null, stock: 23, options: [{ key: 'Strength', value: '10mg' }] },
    { sku: 'TIRZEP-20MG', price: 87.99, salePrice: null, stock: 10, options: [{ key: 'Strength', value: '20mg' }] },
    { sku: 'TIRZEP-30MG', price: 115.49, salePrice: null, stock: 5, options: [{ key: 'Strength', value: '30mg' }] },
    { sku: 'TIRZEP-60MG', price: 175.99, salePrice: null, stock: 0, options: [{ key: 'Strength', value: '60mg' }] },
  ],
} as unknown as ShopProduct

const BPC_157 = {
  id: 1,
  name: 'BPC-157',
  slug: 'bpc-157',
  description: '',
  price: 65.99,
  salePrice: null,
  stock: 25,
  hasVariants: true,
  categories: [],
  images: [],
  variants: [
    { sku: 'BPC157-5MG', price: 65.99, salePrice: null, stock: 25, options: [{ key: 'Strength', value: '5mg' }] },
    { sku: 'BPC157-10MG', price: 76.99, salePrice: null, stock: 12, options: [{ key: 'Strength', value: '10mg' }] },
  ],
} as unknown as ShopProduct

/** Mirrors every current production record: hasVariants false, variants empty. */
const NO_VARIANTS = {
  id: 7,
  name: 'Semax',
  slug: 'semax',
  description: '',
  price: 54.99,
  salePrice: null,
  stock: 25,
  hasVariants: false,
  categories: [],
  images: [],
  variants: [],
} as unknown as ShopProduct

test('GLP-1TRZ 10mg and 60mg resolve to different SKUs and different prices', () => {
  const card = toShopCardProduct(GLP_1TRZ)

  const ten = getProductDisplayDetails(card, '10mg')
  const sixty = getProductDisplayDetails(card, '60mg')

  assert.equal(ten.variantSku, 'TIRZEP-10MG')
  assert.equal(sixty.variantSku, 'TIRZEP-60MG')
  assert.equal(ten.price, 65.99)
  assert.equal(sixty.price, 175.99)
  assert.notEqual(ten.price, sixty.price, '60mg must not be charged at the 10mg price')
})

test('the dosage label is never used as the variant SKU', () => {
  const card = toShopCardProduct(GLP_1TRZ)
  for (const dosage of card.dosageOptions) {
    const details = getProductDisplayDetails(card, dosage)
    assert.notEqual(details.variantSku, dosage, `${dosage} leaked into variantSku`)
    assert.ok(
      card.variants.some((v) => v.sku === details.variantSku),
      `${details.variantSku} is not a real SKU on this product`,
    )
  }
})

test('every resolved SKU survives the checkout lookup', () => {
  // Exactly what app/checkout/actions.ts does with the cart line.
  const card = toShopCardProduct(GLP_1TRZ)
  const variants = (GLP_1TRZ as unknown as { variants: { sku: string; price: number; salePrice: number | null }[] }).variants
  for (const dosage of card.dosageOptions) {
    const { variantSku } = getProductDisplayDetails(card, dosage)
    const found = variants.find((v) => v.sku === variantSku)
    assert.ok(found, `checkout would throw: Variant ${variantSku} not found`)
    assert.equal(getEffectivePrice(found.price, found.salePrice), getProductDisplayDetails(card, dosage).price)
  }
})

test('BPC-157 variants each resolve to their own SKU and price', () => {
  const card = toShopCardProduct(BPC_157)
  assert.deepEqual(card.dosageOptions, ['5mg', '10mg'])
  assert.equal(getProductDisplayDetails(card, '5mg').variantSku, 'BPC157-5MG')
  assert.equal(getProductDisplayDetails(card, '10mg').variantSku, 'BPC157-10MG')
  assert.equal(getProductDisplayDetails(card, '5mg').price, 65.99)
  assert.equal(getProductDisplayDetails(card, '10mg').price, 76.99)
})

test('a product without variants keeps the base price and is unaffected', () => {
  const card = toShopCardProduct(NO_VARIANTS)
  assert.equal(card.hasVariants, false)
  assert.deepEqual(card.variants, [])
  const details = getProductDisplayDetails(card, 'Standard')
  assert.equal(details.price, 54.99)
  assert.equal(resolveCardVariant(card, 'Standard'), null)
  // The checkout ignores variantSku entirely when hasVariants is false, so the
  // label here is harmless — but it must still never claim to be a SKU.
  assert.equal(details.variant, null)
})

test('an unknown dosage resolves no variant and does not invent a SKU', () => {
  const card = toShopCardProduct(GLP_1TRZ)
  const details = getProductDisplayDetails(card, '999mg')
  assert.equal(details.variant, null)
  assert.equal(
    card.variants.some((v) => v.sku === details.variantSku),
    false,
    'must not fall back to an unrelated variant',
  )
  // Falling back to the base price is correct: no variant was selected.
  assert.equal(details.price, 65.99)
})

test('an empty variant selection does not match a variant', () => {
  const card = toShopCardProduct(GLP_1TRZ)
  assert.equal(resolveCardVariant(card, ''), null)
})

test('salePrice null means the regular price is charged', () => {
  const card = toShopCardProduct(GLP_1TRZ)
  for (const v of card.variants) assert.equal(v.salePrice, null)
  assert.equal(getProductDisplayDetails(card, '30mg').price, 115.49)
  assert.equal(getEffectivePrice(115.49, null), 115.49)
})

test('a sale price, when set, wins over the regular price', () => {
  const discounted = {
    ...(BPC_157 as unknown as Record<string, unknown>),
    variants: [
      { sku: 'BPC157-5MG', price: 65.99, salePrice: 49.99, stock: 25, options: [{ key: 'Strength', value: '5mg' }] },
    ],
  } as unknown as ShopProduct
  const card = toShopCardProduct(discounted)
  assert.equal(getProductDisplayDetails(card, '5mg').price, 49.99)
})

test('an out-of-stock variant still resolves but reports inStock false', () => {
  const card = toShopCardProduct(GLP_1TRZ)
  const sixty = getProductDisplayDetails(card, '60mg')
  assert.equal(sixty.variantSku, 'TIRZEP-60MG')
  assert.equal(sixty.inStock, false, '60mg has stock 0')
  const ten = getProductDisplayDetails(card, '10mg')
  assert.equal(ten.inStock, true)
})

test('dosageOptions and variants stay aligned', () => {
  const card = toShopCardProduct(GLP_1TRZ)
  assert.equal(card.dosageOptions.length, 4)
  assert.equal(card.variants.length, 4)
  for (const dosage of card.dosageOptions) {
    assert.ok(card.variants.some((v) => v.label === dosage))
  }
})

test('variant SKUs are unique within a product', () => {
  for (const p of [GLP_1TRZ, BPC_157]) {
    const card = toShopCardProduct(p)
    const skus = card.variants.map((v) => v.sku)
    assert.equal(new Set(skus).size, skus.length)
  }
})
