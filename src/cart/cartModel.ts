import type { Product } from '../data/products'
import { products as productsCatalog } from '../data/products'
import { translateColor, translateProduct } from '../data/productTranslations'

export const CART_STORAGE_KEY = 'minik-wholesale-cart-v1'

export type CartLine = {
  modelCode: string
  color: string
  quantities: Record<string, number>
  notes: string
}

export type CartIssue = {
  modelCode: string
  reason: 'removed-product' | 'removed-size' | 'removed-color' | 'invalid-quantity' | 'invalid-rule'
}

const messageCopy = {
  en: {
    greeting: 'Hello, I would like to request a wholesale quotation for the following children’s clothing models:',
    model: 'Model', product: 'Product', color: 'Color / variant', sizes: 'Sizes and quantities:',
    total: 'Total', pieces: 'pieces', orderTotal: 'Total requested quantity', notes: 'Notes',
    availability: 'Please confirm availability, wholesale prices, and shipping options.',
    name: 'Customer', company: 'Business / store', destination: 'Shipping destination',
  },
  ar: {
    greeting: 'مرحباً، أود طلب عرض سعر بالجملة لموديلات ملابس الأطفال التالية:',
    model: 'الموديل', product: 'المنتج', color: 'اللون أو النوع', sizes: 'المقاسات والكميات:',
    total: 'الإجمالي', pieces: 'قطعة', orderTotal: 'إجمالي الكمية المطلوبة', notes: 'ملاحظات',
    availability: 'يرجى تأكيد التوفر وأسعار الجملة وخيارات الشحن.',
    name: 'العميل', company: 'الشركة أو المتجر', destination: 'دولة الشحن',
  },
  ru: {
    greeting: 'Здравствуйте! Прошу подготовить оптовое предложение по следующим моделям детской одежды:',
    model: 'Модель', product: 'Товар', color: 'Цвет / вариант', sizes: 'Размеры и количество:',
    total: 'Итого', pieces: 'шт.', orderTotal: 'Общее количество', notes: 'Примечания',
    availability: 'Пожалуйста, подтвердите наличие, оптовые цены и варианты доставки.',
    name: 'Покупатель', company: 'Компания / магазин', destination: 'Страна доставки',
  },
}

function validQuantity(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0 && value <= 1000000
}

export function getLineQuantity(line: CartLine) {
  return Object.values(line.quantities).reduce((total, quantity) => total + (validQuantity(quantity) ? quantity : 0), 0)
}

export function getCartQuantity(lines: CartLine[]) {
  return lines.reduce((total, line) => total + getLineQuantity(line), 0)
}

export function formatSizeLabel(size: string, language: 'en' | 'ar' | 'ru') {
  const match = size.match(/^(\d+)\s+(year|years|month|months)$/i)
  if (!match) return size
  const count = Number(match[1])
  if (match[2].toLowerCase().startsWith('month')) {
    if (language === 'ar') {
      const localizedCount = new Intl.NumberFormat('ar').format(count)
      return count === 1 ? 'شهر' : count === 2 ? 'شهران' : `${localizedCount} أشهر`
    }
    return language === 'ru' ? `${count} мес.` : `${count} months`
  }
  if (language === 'ar') {
    const localizedCount = new Intl.NumberFormat('ar').format(count)
    return count === 1 ? 'سنة' : count === 2 ? 'سنتان' : `${localizedCount} سنوات`
  }
  if (language === 'ru') {
    const lastTwoDigits = count % 100
    const lastDigit = count % 10
    const suffix = lastTwoDigits >= 11 && lastTwoDigits <= 14 ? 'лет' : lastDigit === 1 ? 'год' : lastDigit >= 2 && lastDigit <= 4 ? 'года' : 'лет'
    return `${count} ${suffix}`
  }
  return `${count} ${count === 1 ? 'year' : 'years'}`
}

export function validateCartLine(line: CartLine, product: Product) {
  const sizes = product.availableSizes ?? []
  const selectedSizes = Object.keys(line.quantities).filter((size) => validQuantity(line.quantities[size]))
  const issues: CartIssue[] = []

  for (const [size, quantity] of Object.entries(line.quantities)) {
    if (!validQuantity(quantity)) issues.push({ modelCode: line.modelCode, reason: 'invalid-quantity' })
    else if (!sizes.includes(size)) issues.push({ modelCode: line.modelCode, reason: 'removed-size' })
  }
  if (line.color && !product.colors.split(',').map((color) => color.trim()).includes(line.color)) {
    issues.push({ modelCode: line.modelCode, reason: 'removed-color' })
  }
  const rule = product.orderRule
  if (rule?.requireCompleteSizeSeries && selectedSizes.length !== sizes.length) {
    issues.push({ modelCode: line.modelCode, reason: 'invalid-rule' })
  }
  return issues
}

export function validateCart(lines: CartLine[], catalog: Product[]):
  { validLines: CartLine[]; issues: CartIssue[] } {
  const issues: CartIssue[] = []
  const validLines = lines.flatMap((line) => {
    const product = catalog.find((item) => item.modelCode === line.modelCode)
    if (!product) {
      issues.push({ modelCode: line.modelCode, reason: 'removed-product' })
      return []
    }
    const allowedSizes = product.availableSizes ?? []
    const quantities = Object.fromEntries(Object.entries(line.quantities).filter(([size, quantity]) =>
      allowedSizes.includes(size) && validQuantity(quantity),
    ))
    if (Object.keys(quantities).length !== Object.keys(line.quantities).length) {
      issues.push({ modelCode: line.modelCode, reason: 'removed-size' })
    }
    const allowedColors = product.colors.split(',').map((color) => color.trim())
    const color = allowedColors.includes(line.color) ? line.color : allowedColors[0] ?? ''
    if (line.color && color !== line.color) issues.push({ modelCode: line.modelCode, reason: 'removed-color' })
    const cleanLine: CartLine = {
      modelCode: line.modelCode,
      color,
      quantities,
      notes: typeof line.notes === 'string' ? line.notes.replace(/[<>]/g, '').slice(0, 500) : '',
    }
    const ruleIssues = validateCartLine(cleanLine, product).filter((issue) => issue.reason === 'invalid-rule')
    if (ruleIssues.length) issues.push(...ruleIssues)
    return [cleanLine]
  })
  for (const product of catalog) {
    const minimum = product.orderRule?.minimumQuantity
    if (!minimum) continue
    const modelQuantity = validLines
      .filter((line) => line.modelCode === product.modelCode)
      .reduce((total, line) => total + getLineQuantity(line), 0)
    if (modelQuantity > 0 && modelQuantity < minimum) {
      issues.push({ modelCode: product.modelCode, reason: 'invalid-rule' })
    }
  }
  return { validLines, issues }
}

export function parseCart(value: string, catalog: Product[]) {
  const parsed: unknown = JSON.parse(value)
  if (!Array.isArray(parsed)) return { validLines: [] as CartLine[], issues: [] as CartIssue[] }
  const candidates: CartLine[] = []
  const issues: CartIssue[] = []
  for (const item of parsed) {
    if (!item || typeof item !== 'object') continue
    const record = item as Record<string, unknown>
    if (typeof record.modelCode !== 'string' || !record.quantities || typeof record.quantities !== 'object' || Array.isArray(record.quantities)) continue
    const quantities: Record<string, number> = {}
    for (const [size, amount] of Object.entries(record.quantities)) {
      if (validQuantity(amount)) quantities[size] = amount
      else issues.push({ modelCode: record.modelCode, reason: 'invalid-quantity' })
    }
    candidates.push({
      modelCode: record.modelCode,
      color: typeof record.color === 'string' ? record.color : '',
      quantities,
      notes: typeof record.notes === 'string' ? record.notes : '',
    })
  }
  const validated = validateCart(candidates, catalog)
  return { validLines: validated.validLines, issues: [...issues, ...validated.issues] }
}

export function buildCartWhatsAppMessage(
  lines: CartLine[],
  language: keyof typeof messageCopy,
  customer: { name?: string; company?: string; country?: string } = {},
) {
  const t = messageCopy[language]
  const details = [
    customer.name && `${t.name}: ${customer.name}`,
    customer.company && `${t.company}: ${customer.company}`,
    customer.country && `${t.destination}: ${customer.country}`,
  ].filter(Boolean)
  const messageLines = [t.greeting, ...details, '']
  let total = 0

  lines.forEach((line, index) => {
    const product = productsCatalog.find((item) => item.modelCode === line.modelCode)
    if (!product) return
    const localizedProduct = translateProduct(product, language)
    const lineTotal = getLineQuantity(line)
    total += lineTotal
    messageLines.push(`${index + 1}. ${t.model}: ${product.modelCode}`)
    messageLines.push(`${t.product}: ${localizedProduct.name}`)
    if (line.color) messageLines.push(`${t.color}: ${translateColor(line.color, language)}`)
    messageLines.push(t.sizes)
    for (const [size, quantity] of Object.entries(line.quantities)) {
      if (validQuantity(quantity)) messageLines.push(`- ${formatSizeLabel(size, language)}: ${quantity} ${t.pieces}`)
    }
    messageLines.push(`${t.total}: ${lineTotal} ${t.pieces}`)
    if (line.notes) messageLines.push(`${t.notes}: ${line.notes}`)
    messageLines.push('')
  })
  messageLines.push(`${t.orderTotal}: ${total} ${t.pieces}`, '', t.availability)
  return messageLines.join('\n')
}
