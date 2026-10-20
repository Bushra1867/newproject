import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react'
import { readSiteLanguage } from '../config/language'
import type { Product } from '../data/products'
import AddToCartDialog from '../cart/AddToCartDialog'
import { useCart } from '../cart/useCart'

type GalleryView = { key: 'catalog' | 'front' | 'back' | 'side' | 'detail'; label: string; src?: string }

const labels = {
  en: { catalog: 'Catalog image', front: 'Front', back: 'Back', side: 'Side', detail: 'Detail', unavailable: 'Image not supplied', open: 'Open image gallery', close: 'Close gallery', previous: 'Previous image', next: 'Next image', zoom: 'Toggle image zoom' },
  ar: { catalog: 'صورة الكتالوج', front: 'الأمام', back: 'الخلف', side: 'الجانب', detail: 'التفاصيل', unavailable: 'الصورة غير متوفرة', open: 'فتح معرض الصور', close: 'إغلاق المعرض', previous: 'الصورة السابقة', next: 'الصورة التالية', zoom: 'تكبير الصورة' },
  ru: { catalog: 'Изображение каталога', front: 'Спереди', back: 'Сзади', side: 'Сбоку', detail: 'Деталь', unavailable: 'Изображение не предоставлено', open: 'Открыть галерею изображений', close: 'Закрыть галерею', previous: 'Предыдущее изображение', next: 'Следующее изображение', zoom: 'Увеличить изображение' },
}

export default function ProductGallery({ product }: { product: Product }) {
  const { addLine, lines } = useCart()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [language, setLanguage] = useState<'en' | 'ar' | 'ru'>(readSiteLanguage)
  const [selected, setSelected] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const t = labels[language]
  const views: GalleryView[] = [
    { key: 'catalog', label: t.catalog, src: product.image },
    { key: 'front', label: t.front, src: product.views?.front },
    { key: 'back', label: t.back, src: product.views?.back },
    { key: 'side', label: t.side, src: product.views?.side },
    { key: 'detail', label: t.detail, src: product.views?.detail },
  ]
  const availableViews = views.filter((view) => view.src)
  const current = availableViews[Math.min(selected, availableViews.length - 1)]

  useEffect(() => {
    const syncLanguage = (event: Event) => {
      const value = (event as CustomEvent<string>).detail?.toLowerCase()
      if (value === 'en' || value === 'ar' || value === 'ru') setLanguage(value)
    }
    window.addEventListener('site-language-change', syncLanguage)
    return () => window.removeEventListener('site-language-change', syncLanguage)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' && selected < availableViews.length - 1) setSelected((index) => index + 1)
      if (event.key === 'ArrowLeft' && selected > 0) setSelected((index) => index - 1)
      if (event.key === 'Escape') setZoomed(false)
    }
    dialog.addEventListener('keydown', onKeyDown)
    return () => dialog.removeEventListener('keydown', onKeyDown)
  }, [availableViews.length, selected])

  function openGallery() {
    setSelected(0)
    setZoomed(false)
    setImageFailed(false)
    dialogRef.current?.showModal()
  }

  function selectView(index: number) {
    if (!views[index].src) return
    const availableIndex = availableViews.findIndex((view) => view.key === views[index].key)
    setSelected(availableIndex)
    setZoomed(false)
    setImageFailed(false)
  }

  return (
    <>
      <button className="product-gallery-trigger" type="button" onClick={openGallery} aria-label={`${t.open}: ${product.name}`}>
        <img src={product.image} alt={product.imageAlt} loading="lazy" />
        <span>{t.open}</span>
      </button>
      <dialog className="gallery-dialog" ref={dialogRef} aria-label={`${t.open}: ${product.name}`} onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close()
      }} onClose={() => setZoomed(false)}>
        <div className="gallery-content" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <header className="gallery-header">
            <div><span className="gallery-model">{product.modelCode}</span><h2>{product.name}</h2></div>
            <div className="gallery-header-actions">
              <AddToCartDialog product={product} otherModelQuantity={lines.filter((line) => line.modelCode === product.modelCode).reduce((sum, line) => sum + Object.values(line.quantities).reduce((total, quantity) => total + quantity, 0), 0)} onSave={addLine} />
              <button type="button" className="gallery-icon-button" onClick={() => dialogRef.current?.close()} aria-label={t.close}><X size={20} /></button>
            </div>
          </header>
          <div className="gallery-stage">
            {current?.src && !imageFailed
              ? <img className={zoomed ? 'gallery-main-image zoomed' : 'gallery-main-image'} src={current.src} alt={`${product.name} — ${current.label}`} onError={() => setImageFailed(true)} />
              : <div className="gallery-missing" role="status">{t.unavailable}</div>}
            <button type="button" className="gallery-icon-button gallery-zoom" onClick={() => setZoomed((value) => !value)} aria-label={t.zoom} aria-pressed={zoomed}><Maximize2 size={18} /></button>
            {availableViews.length > 1 && <>
              <button type="button" className="gallery-icon-button gallery-previous" onClick={() => selectView(views.findIndex((view) => view.key === availableViews[Math.max(0, selected - 1)].key))} disabled={selected === 0} aria-label={t.previous}><ArrowLeft size={19} /></button>
              <button type="button" className="gallery-icon-button gallery-next" onClick={() => selectView(views.findIndex((view) => view.key === availableViews[Math.min(availableViews.length - 1, selected + 1)].key))} disabled={selected === availableViews.length - 1} aria-label={t.next}><ArrowRight size={19} /></button>
            </>}
          </div>
          <div className="gallery-thumbnails" aria-label={t.open}>
            {views.map((view, index) => view.src
              ? <button type="button" key={view.key} className={`gallery-thumbnail ${current?.key === view.key ? 'selected' : ''}`} onClick={() => selectView(index)} aria-label={view.label} aria-pressed={current?.key === view.key}>
                  <img src={view.src} alt="" />
                  <span>{view.label}</span>
                </button>
              : <div className="gallery-thumbnail unavailable" key={view.key} aria-label={`${view.label}: ${t.unavailable}`} title={`${view.label}: ${t.unavailable}`}>
                  <span>{view.label}</span><small>{t.unavailable}</small>
                </div>)}
          </div>
        </div>
      </dialog>
    </>
  )
}
