import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { ShoppingBag, X } from 'lucide-react'
import type { Product } from '../data/products'
import { readSiteLanguage, type SiteLanguage } from '../config/language'
import type { CartLine } from './cartModel'

type Language = SiteLanguage
const copy = {
  en: { add: 'Add to cart', edit: 'Edit selections', title: 'Add wholesale quantities', color: 'Color / variant', chooseColor: 'Select a color', size: 'Size', quantity: 'Quantity', notes: 'Product notes (optional)', notesHint: 'Add a note for this model', cancel: 'Cancel', save: 'Save selections', min: 'Minimum order for this model', series: 'Select every available size for this size series.', chooseSize: 'Choose at least one size and enter a quantity.', invalidQuantity: 'Enter a whole number greater than zero for every selected size.', minError: 'This model requires a minimum of {count} pieces.', seriesError: 'This model requires a complete size series.', colorError: 'Select a product color.', },
  ar: { add: 'أضف إلى السلة', edit: 'تعديل الاختيارات', title: 'أضف كميات الجملة', color: 'اللون أو النوع', chooseColor: 'اختر اللون', size: 'المقاس', quantity: 'الكمية', notes: 'ملاحظات المنتج (اختياري)', notesHint: 'أضف ملاحظة لهذا الموديل', cancel: 'إلغاء', save: 'حفظ الاختيارات', min: 'الحد الأدنى لهذا الموديل', series: 'اختر جميع المقاسات المتاحة لهذه المجموعة.', chooseSize: 'اختر مقاساً واحداً على الأقل وأدخل الكمية.', invalidQuantity: 'أدخل كمية صحيحة أكبر من صفر لكل مقاس محدد.', minError: 'يتطلب هذا الموديل {count} قطعة كحد أدنى.', seriesError: 'يتطلب هذا الموديل مجموعة مقاسات كاملة.', colorError: 'يرجى اختيار لون المنتج.' },
  ru: { add: 'В корзину', edit: 'Изменить выбор', title: 'Оптовое количество', color: 'Цвет / вариант', chooseColor: 'Выберите цвет', size: 'Размер', quantity: 'Количество', notes: 'Примечание к модели (необязательно)', notesHint: 'Добавьте примечание к модели', cancel: 'Отмена', save: 'Сохранить выбор', min: 'Минимальный заказ для модели', series: 'Выберите все доступные размеры серии.', chooseSize: 'Выберите хотя бы один размер и укажите количество.', invalidQuantity: 'Для каждого выбранного размера укажите целое число больше нуля.', minError: 'Минимальный заказ этой модели — {count} шт.', seriesError: 'Для этой модели требуется полный размерный ряд.', colorError: 'Выберите цвет товара.' },
}

export default function AddToCartDialog({
  product,
  existing,
  otherModelQuantity = 0,
  onSave,
}: {
  product: Product
  existing?: CartLine
  otherModelQuantity?: number
  onSave: (line: CartLine) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [language, setLanguage] = useState<Language>(readSiteLanguage)
  const [color, setColor] = useState(existing?.color ?? '')
  const [quantities, setQuantities] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(existing?.quantities ?? {}).map(([size, quantity]) => [size, String(quantity)])),
  )
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [error, setError] = useState('')
  const t = copy[language]
  const colors = useMemo(() => product.colors.split(',').map((value) => value.trim()).filter(Boolean), [product.colors])
  const sizes = product.availableSizes ?? []

  useEffect(() => {
    const syncLanguage = (event: Event) => {
      const value = (event as CustomEvent<string>).detail?.toLowerCase()
      if (value === 'en' || value === 'ar' || value === 'ru') setLanguage(value)
    }
    window.addEventListener('site-language-change', syncLanguage)
    return () => window.removeEventListener('site-language-change', syncLanguage)
  }, [])

  function open() {
    setColor(existing?.color ?? colors[0] ?? '')
    setQuantities(Object.fromEntries(Object.entries(existing?.quantities ?? {}).map(([size, quantity]) => [size, String(quantity)])))
    setNotes(existing?.notes ?? '')
    setError('')
    dialogRef.current?.showModal()
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const selectedEntries = Object.entries(quantities).filter(([, value]) => value !== '' && value !== '0')
    if (!color) {
      setError(t.colorError)
      return
    }
    if (selectedEntries.length === 0) {
      setError(t.chooseSize)
      return
    }
    if (selectedEntries.some(([, value]) => !/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 1000000)) {
      setError(t.invalidQuantity)
      return
    }
    const selected = Object.fromEntries(selectedEntries.map(([size, quantity]) => [size, Number(quantity)]))
    const total = Object.values(selected).reduce((sum, quantity) => sum + quantity, 0)
    if (product.orderRule?.requireCompleteSizeSeries && sizes.some((size) => !selected[size])) {
      setError(t.seriesError)
      return
    }
    if (product.orderRule?.minimumQuantity && total + otherModelQuantity < product.orderRule.minimumQuantity) {
      setError(t.minError.replace('{count}', String(product.orderRule.minimumQuantity)))
      return
    }
    onSave({ modelCode: product.modelCode, color, quantities: selected, notes: notes.replace(/[<>]/g, '').slice(0, 500) })
    dialogRef.current?.close()
  }

  return (
    <>
      <button type="button" className={`cart-add-trigger ${existing ? 'is-edit' : ''}`} onClick={open}>
        {existing ? t.edit : <><ShoppingBag size={16} aria-hidden="true" /> {t.add}</>}
      </button>
      <dialog className="cart-config-dialog" ref={dialogRef} aria-label={`${t.title}: ${product.name}`} onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close()
      }}>
        <form className="cart-config-content" onSubmit={save} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <header className="cart-config-header">
            <div><span>{product.modelCode}</span><h2>{t.title}</h2><p>{product.name}</p></div>
            <button type="button" className="gallery-icon-button" onClick={() => dialogRef.current?.close()} aria-label={t.cancel}><X size={19} /></button>
          </header>
          <label className="cart-config-field"><span>{t.color}</span><select value={color} onChange={(event) => setColor(event.target.value)}><option value="">{t.chooseColor}</option>{colors.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <div className="cart-size-table">
            <div className="cart-size-heading"><span>{t.size}</span><span>{t.quantity}</span></div>
            {sizes.map((size) => <label className="cart-size-row" key={size}>
              <span>{size}</span>
              <input type="number" min="0" max="1000000" step="1" inputMode="numeric" aria-label={`${t.quantity} · ${size}`} placeholder="0" value={quantities[size] ?? ''} onChange={(event) => setQuantities((current) => ({ ...current, [size]: event.target.value }))} />
            </label>)}
          </div>
          {product.orderRule?.requireCompleteSizeSeries && <p className="cart-rule-note">{t.series}</p>}
          {product.orderRule?.minimumQuantity && <p className="cart-rule-note">{t.min}: {product.orderRule.minimumQuantity}</p>}
          <label className="cart-config-field"><span>{t.notes}</span><textarea rows={3} maxLength={500} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={t.notesHint} /></label>
          {error && <p className="cart-validation" role="alert">{error}</p>}
          <div className="cart-config-actions"><button type="button" className="smart-button secondary" onClick={() => dialogRef.current?.close()}>{t.cancel}</button><button type="submit" className="smart-button primary">{t.save}</button></div>
        </form>
      </dialog>
    </>
  )
}
