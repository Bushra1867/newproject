import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, ShoppingBag, Trash2 } from 'lucide-react'
import { business, whatsappUrl } from '../config/business'
import { readSiteLanguage, type SiteLanguage } from '../config/language'
import { products } from '../data/products'
import { translateColor, translateProduct } from '../data/productTranslations'
import { sitePath } from '../config/navigation'
import AddToCartDialog from './AddToCartDialog'
import { useCart } from './useCart'
import { buildCartWhatsAppMessage, formatSizeLabel, getCartQuantity, getLineQuantity, validateCart, type CartIssue } from './cartModel'

type Language = SiteLanguage
const copy = {
  en: {
    title: 'Wholesale cart', subtitle: 'Review your quotation request. No payment is taken here.',
    empty: 'Your cart is empty', emptyText: 'Browse the collection and add the models and sizes you need.',
    browse: 'Browse collection', model: 'Model', color: 'Color / variant', sizes: 'Sizes and quantities', total: 'Model quantity', pieces: 'pieces',
    remove: 'Remove model', edit: 'Edit selections', clear: 'Clear cart', clearConfirm: 'Clear every model from your cart?', summary: 'Order summary',
    models: 'Selected models', totalPieces: 'Total pieces', notes: 'Notes', name: 'Your name (optional)', company: 'Business or store (optional)', country: 'Destination country (optional)',
    continue: 'Continue shopping', send: 'Send order via WhatsApp', invalid: 'Resolve the order requirements before sending this quotation request.',
    stale: 'Some saved cart selections were changed because product or variant information is no longer available. Please review the remaining items.',
    unavailable: 'Cart persistence is unavailable in this browser. Your cart will not survive a refresh.',
    removedProduct: 'A product is no longer in the catalog.', removedSize: 'One or more sizes are no longer available.', removedColor: 'A color is no longer available.', invalidQuantity: 'A quantity was invalid and has been removed.', invalidRule: 'This model does not meet its configured wholesale order rule.',
  },
  ar: {
    title: 'سلة الجملة', subtitle: 'راجع طلب عرض السعر. لا يتم تحصيل أي مبلغ هنا.',
    empty: 'سلتك فارغة', emptyText: 'تصفح المجموعة وأضف الموديلات والمقاسات المطلوبة.',
    browse: 'تصفح المجموعة', model: 'الموديل', color: 'اللون أو النوع', sizes: 'المقاسات والكميات', total: 'كمية الموديل', pieces: 'قطعة',
    remove: 'إزالة الموديل', edit: 'تعديل الاختيارات', clear: 'إفراغ السلة', clearConfirm: 'هل تريد إزالة جميع الموديلات من السلة؟', summary: 'ملخص الطلب',
    models: 'عدد الموديلات', totalPieces: 'إجمالي القطع', notes: 'ملاحظات', name: 'الاسم (اختياري)', company: 'الشركة أو المتجر (اختياري)', country: 'دولة الشحن (اختياري)',
    continue: 'متابعة التسوق', send: 'إرسال الطلب عبر واتساب', invalid: 'يرجى استيفاء متطلبات الطلب قبل إرسال طلب عرض السعر.',
    stale: 'تم تعديل بعض الاختيارات المحفوظة لأن المنتج أو النوع لم يعد متاحاً. يرجى مراجعة المنتجات المتبقية.',
    unavailable: 'تعذر حفظ السلة في هذا المتصفح. لن تبقى السلة بعد التحديث.',
    removedProduct: 'لم يعد المنتج موجوداً في الكتالوج.', removedSize: 'لم يعد مقاس واحد أو أكثر متاحاً.', removedColor: 'لم يعد اللون متاحاً.', invalidQuantity: 'تمت إزالة كمية غير صالحة.', invalidRule: 'لا يستوفي الموديل قاعدة طلب الجملة المحددة.',
  },
  ru: {
    title: 'Оптовая корзина', subtitle: 'Проверьте запрос предложения. Оплата здесь не производится.',
    empty: 'Корзина пуста', emptyText: 'Перейдите в каталог и добавьте нужные модели и размеры.',
    browse: 'Перейти в каталог', model: 'Модель', color: 'Цвет / вариант', sizes: 'Размеры и количество', total: 'Количество модели', pieces: 'шт.',
    remove: 'Удалить модель', edit: 'Изменить выбор', clear: 'Очистить корзину', clearConfirm: 'Удалить все модели из корзины?', summary: 'Сводка заказа',
    models: 'Выбранные модели', totalPieces: 'Всего изделий', notes: 'Примечания', name: 'Ваше имя (необязательно)', company: 'Компания или магазин (необязательно)', country: 'Страна доставки (необязательно)',
    continue: 'Продолжить покупки', send: 'Отправить запрос в WhatsApp', invalid: 'Выполните требования заказа, чтобы отправить запрос предложения.',
    stale: 'Сохранённая корзина изменена: некоторые товары или варианты больше недоступны. Проверьте оставшиеся позиции.',
    unavailable: 'Не удалось сохранить корзину в этом браузере. После обновления она не сохранится.',
    removedProduct: 'Товар больше не представлен в каталоге.', removedSize: 'Один или несколько размеров больше недоступны.', removedColor: 'Цвет больше недоступен.', invalidQuantity: 'Некорректное количество было удалено.', invalidRule: 'Модель не соответствует заданному правилу оптового заказа.',
  },
}

function issueText(issue: CartIssue, language: Language) {
  return copy[language][issue.reason === 'removed-product' ? 'removedProduct' : issue.reason === 'removed-size' ? 'removedSize' : issue.reason === 'removed-color' ? 'removedColor' : issue.reason === 'invalid-quantity' ? 'invalidQuantity' : 'invalidRule']
}

export default function CartPage() {
  const { lines, pieceCount, restorationIssues, storageUnavailable, addLine, updateLine, removeLine, clearCart, dismissRestorationIssues } = useCart()
  const [language, setLanguage] = useState<Language>(readSiteLanguage)
  const [customer, setCustomer] = useState({ name: '', company: '', country: '' })
  const t = copy[language]
  const validated = useMemo(() => validateCart(lines, products), [lines])
  const total = getCartQuantity(lines)

  useEffect(() => {
    const syncLanguage = (event: Event) => {
      const value = (event as CustomEvent<string>).detail?.toLowerCase()
      if (value === 'en' || value === 'ar' || value === 'ru') setLanguage(value)
    }
    window.addEventListener('site-language-change', syncLanguage)
    return () => window.removeEventListener('site-language-change', syncLanguage)
  }, [])

  const invalidIssues = validated.issues
  const message = buildCartWhatsAppMessage(lines, language, customer)
  const orderUrl = lines.length > 0 && invalidIssues.length === 0 && total > 0
    ? whatsappUrl(message)
    : ''

  return (
    <main className="cart-page section" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="page-width">
        <header className="cart-page-header">
          <div><p className="eyebrow"><span className="eyebrow-line" /> {business.name}</p><h1>{t.title}</h1><p>{t.subtitle}</p></div>
          <a className="button button-secondary" href={`${sitePath()}#collections`}><ArrowLeft size={16} /> {t.continue}</a>
        </header>
        {restorationIssues.length > 0 && <div className="cart-notice" role="status"><p>{t.stale}</p><ul>{restorationIssues.map((issue, index) => <li key={`${issue.modelCode}-${issue.reason}-${index}`}>{issue.modelCode}: {issueText(issue, language)}</li>)}</ul><button type="button" onClick={dismissRestorationIssues}>×</button></div>}
        {storageUnavailable && <p className="cart-notice" role="status">{t.unavailable}</p>}
        {lines.length === 0 ? <section className="cart-empty">
          <span><ShoppingBag size={27} /></span><h2>{t.empty}</h2><p>{t.emptyText}</p><a className="smart-button primary" href={`${sitePath()}#collections`}>{t.browse} <ArrowRight size={17} /></a>
        </section> : <>
          {invalidIssues.length > 0 && <div className="cart-validation" role="alert"><p>{t.invalid}</p><ul>{invalidIssues.map((issue, index) => <li key={`${issue.modelCode}-${issue.reason}-${index}`}>{issue.modelCode}: {issueText(issue, language)}</li>)}</ul></div>}
          <div className="cart-items">
            {lines.map((line) => {
              const product = products.find((item) => item.modelCode === line.modelCode)
              if (!product) return null
              const localizedProduct = translateProduct(product, language)
              const otherModelQuantity = lines.filter((other) => other.modelCode === line.modelCode && other.color !== line.color).reduce((sum, other) => sum + getLineQuantity(other), 0)
              return <article className="cart-line" key={`${line.modelCode}:${line.color}`}>
                <img className="cart-line-image" src={product.image} alt={localizedProduct.imageAlt} />
                <div className="cart-line-content">
                  <div className="cart-line-heading"><div><span>{t.model} · <bdi dir="ltr">{product.modelCode}</bdi></span><h2>{localizedProduct.name}</h2></div><button type="button" className="cart-remove" onClick={() => removeLine(line.modelCode, line.color)} aria-label={`${t.remove}: ${product.modelCode}`}><Trash2 size={17} /> {t.remove}</button></div>
                  <p className="cart-line-color">{t.color}: {translateColor(line.color, language)}</p>
                  <div className="cart-line-sizes"><strong>{t.sizes}</strong>{Object.entries(line.quantities).map(([size, quantity]) => <span key={size}>{formatSizeLabel(size, language)} <b>{quantity} {t.pieces}</b></span>)}</div>
                  <div className="cart-line-bottom"><span>{t.total}: <strong>{getLineQuantity(line)} {t.pieces}</strong></span><AddToCartDialog product={product} existing={line} otherModelQuantity={otherModelQuantity} onSave={(updated) => {
                    if (updated.color !== line.color) {
                      removeLine(line.modelCode, line.color)
                      addLine(updated)
                    } else {
                      updateLine(updated)
                    }
                  }} /></div>
                  {line.notes && <p className="cart-line-notes"><b>{t.notes}:</b> {line.notes}</p>}
                </div>
              </article>
            })}
          </div>
          <section className="cart-summary">
            <div className="cart-summary-main"><h2>{t.summary}</h2><dl><div><dt>{t.models}</dt><dd>{lines.length}</dd></div><div><dt>{t.totalPieces}</dt><dd>{pieceCount} {t.pieces}</dd></div></dl></div>
            <div className="cart-customer-fields">
              <label>{t.name}<input value={customer.name} maxLength={100} onChange={(event) => setCustomer((state) => ({ ...state, name: event.target.value.replace(/[<>]/g, '').slice(0, 100) }))} /></label>
              <label>{t.company}<input value={customer.company} maxLength={120} onChange={(event) => setCustomer((state) => ({ ...state, company: event.target.value.replace(/[<>]/g, '').slice(0, 120) }))} /></label>
              <label>{t.country}<input value={customer.country} maxLength={100} onChange={(event) => setCustomer((state) => ({ ...state, country: event.target.value.replace(/[<>]/g, '').slice(0, 100) }))} /></label>
            </div>
            <div className="cart-summary-actions"><button type="button" className="button button-secondary" onClick={() => {
              if (window.confirm(t.clearConfirm)) clearCart()
            }}>{t.clear}</button><a className="button button-secondary" href={`${sitePath()}#collections`}>{t.continue}</a>{orderUrl ? <a className="button button-whatsapp" href={orderUrl} target="_blank" rel="noopener noreferrer">{t.send}</a> : <button className="button button-whatsapp" type="button" disabled>{t.send}</button>}</div>
          </section>
          <a className="cart-inquiry-link" href={`${sitePath()}?fromCart=1#inquiry`}>{language === 'ar' ? 'متابعة إلى نموذج الاستفسار الذكي' : language === 'ru' ? 'Продолжить в форме оптового запроса' : 'Continue in the smart inquiry form'} <ArrowRight size={16} /></a>
        </>}
      </div>
    </main>
  )
}
