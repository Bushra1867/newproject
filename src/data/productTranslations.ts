import type { Product } from './products'
import type { SiteLanguage } from '../config/language'

const categoryLabels: Record<string, string> = {
  "Girls' Dresses": 'فساتين البنات',
  "Boys' Clothing": 'ملابس الأولاد',
  'Occasion Wear': 'ملابس المناسبات',
  'Eid & Holiday': 'الأعياد والمناسبات',
  'New Arrivals': 'وصل حديثاً',
}

const productLabels: Record<string, { name: string; alt: string; colors: Record<string, string>; badge?: string }> = {
  'MK-2418': {
    name: 'فستان بياقة بتصميم بتلات',
    alt: 'طفلة ترتدي زياً أنيقاً بدرجات هادئة في ضوء طبيعي',
    colors: { Ivory: 'عاجي', rose: 'وردي', sage: 'أخضر مريمي' },
    badge: 'الموسم الجديد',
  },
  'MK-2306': {
    name: 'طقم كتان يومي',
    alt: 'أطفال يرتدون ملابس يومية مريحة في الهواء الطلق',
    colors: { Sand: 'رملي', sky: 'أزرق سماوي', olive: 'زيتي' },
  },
  'MK-2512': {
    name: 'بدلة أطفال للمناسبات',
    alt: 'طفل يرتدي ملابس مناسبة للمناسبات الخاصة',
    colors: { Cream: 'كريمي', navy: 'كحلي', blush: 'وردي باهت' },
  },
  'MK-2520': {
    name: 'طقم مطرز للأعياد',
    alt: 'أطفال يرتدون أزياء أنيقة احتفالاً بالمناسبات',
    colors: { White: 'أبيض', emerald: 'أخضر زمردي', 'dusty pink': 'وردي غباري' },
    badge: 'إصدار محدود',
  },
  'MK-2603': {
    name: 'طقم محبوك ناعم',
    alt: 'ملابس أطفال في غرفة مشرقة ودافئة',
    colors: { Oat: 'شوفاني', lilac: 'ليلكي', cocoa: 'كاكاو' },
    badge: 'وصل حديثاً',
  },
  'MK-2426': {
    name: 'فستان حفلة الحديقة',
    alt: 'طفلة تستمتع بيوم مشمس بملابس مبهجة',
    colors: { Floral: 'نقشة زهرية', butter: 'أصفر زبدي', blue: 'أزرق' },
  },
}

export function translateColor(color: string, language: SiteLanguage) {
  if (language !== 'ar') return color
  const normalized = color.trim()
  for (const product of Object.values(productLabels)) {
    const translated = product.colors[normalized]
    if (translated) return translated
  }
  return normalized
}

export function translateProduct(product: Product, language: SiteLanguage) {
  if (language !== 'ar') {
    return {
      ...product,
      categoryLabel: product.category,
      displayedColors: product.colors,
    }
  }

  const labels = productLabels[product.modelCode]
  const sizeLabels: Record<string, string> = {
    '2–8 years': 'من سنتين إلى ٨ سنوات',
    '1–7 years': 'من سنة إلى ٧ سنوات',
    '2–10 years': 'من سنتين إلى ١٠ سنوات',
    '2–9 years': 'من سنتين إلى ٩ سنوات',
    '6 months–6 years': 'من ٦ أشهر إلى ٦ سنوات',
  }

  return {
    ...product,
    name: labels?.name ?? product.name,
    imageAlt: labels?.alt ?? product.imageAlt,
    categoryLabel: categoryLabels[product.category] ?? product.category,
    sizes: sizeLabels[product.sizes] ?? product.sizes,
    displayedColors: product.colors.split(',').map((color) => translateColor(color, language)).join('، '),
    badge: labels?.badge ?? product.badge,
  }
}
