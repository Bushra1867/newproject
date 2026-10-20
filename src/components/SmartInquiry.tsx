import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, Search, Trash2 } from 'lucide-react'
import { business, inquiryEndpoint, whatsappUrl } from '../config/business'
import { readSiteLanguage, setSiteLanguage } from '../config/language'
import { products } from '../data/products'
import { translateColor, translateProduct } from '../data/productTranslations'
import { useCart } from '../cart/useCart'
import { formatSizeLabel, getLineQuantity } from '../cart/cartModel'
import './SmartInquiry.css'

type Language = 'en' | 'ar' | 'ru'
type InquiryType = 'prices' | 'model' | 'catalog' | 'sizes' | 'minimum' | 'shipping' | 'custom' | 'other'
type SelectionMode = 'single' | 'multiple' | 'collection'
type ContactMethod = 'whatsapp' | 'email' | 'phone'

type SelectedProduct = { sizes: string; quantity: string; variantSummary?: string }
type InquiryAnswers = {
  fullName: string
  company: string
  country: string
  contactMethod: ContactMethod
  whatsapp: string
  phoneNumber: string
  email: string
  inquiryTypes: InquiryType[]
  selectionMode: SelectionMode
  selectedProducts: Record<string, SelectedProduct>
  ageGroup: string
  category: string
  estimatedQuantity: string
  budget: string
  destination: string
  recurrence: string
  fulfillment: string
  deliveryDate: string
  productionDate: string
  fabric: string
  designReference: string
  message: string
}

const initialAnswers: InquiryAnswers = {
  fullName: '',
  company: '',
  country: '',
  contactMethod: 'whatsapp',
  whatsapp: '',
  phoneNumber: '',
  email: '',
  inquiryTypes: [],
  selectionMode: 'multiple',
  selectedProducts: {},
  ageGroup: '',
  category: '',
  estimatedQuantity: '',
  budget: '',
  destination: '',
  recurrence: '',
  fulfillment: '',
  deliveryDate: '',
  productionDate: '',
  fabric: '',
  designReference: '',
  message: '',
}

const copy: Record<Language, Record<string, string>> = {
  en: {
    title: 'Wholesale inquiry', intro: 'Tell us what your business needs. Our team will have the details to prepare a useful reply.', language: 'Language', englishLanguage: 'English', arabicLanguage: 'Arabic', russianLanguage: 'Russian',
    step: 'Step', customerStep: 'Your details', typeStep: 'Inquiry type', productStep: 'Products', requirementsStep: 'Order requirements', reviewStep: 'Review & send',
    customerTitle: 'Let’s get to know your business', fullName: 'Full name', company: 'Company or store name', country: 'Country', contactMethod: 'Preferred contact method', whatsapp: 'WhatsApp number', phoneNumber: 'Phone number', email: 'Email address (optional)', phone: 'Phone', methodWhatsApp: 'WhatsApp', methodEmail: 'Email', methodPhone: 'Phone',
    typesTitle: 'What can we help you with?', chooseTypes: 'Choose one or more', prices: 'Request wholesale prices', model: 'Ask about a specific model', catalog: 'Request the complete product catalog', sizes: 'Ask about available sizes and colors', minimum: 'Ask about minimum order quantities', shipping: 'Ask about shipping and delivery', custom: 'Manufacturing or custom production', other: 'Other inquiry',
    productsTitle: 'Choose products for your inquiry', productsHint: 'Search the catalog, then add the models you are interested in. Catalog requests can continue without selecting models.', search: 'Search by name or model number', noProducts: 'No products match your search.', single: 'One model', multiple: 'Multiple models', collection: 'Complete collection', selected: 'Selected products', add: 'Add to inquiry', remove: 'Remove', sizesFor: 'Requested sizes', sizesPlaceholder: 'e.g. 2, 4, 6 years', quantityFor: 'Quantity for this model', modelNumber: 'Model', availableSizes: 'Available sizes', availableColors: 'Available colors', noExtraDetails: 'No additional order details are needed for this inquiry. You can continue to review.',
    requirementsTitle: 'A few order details', ageGroup: 'Age group', agePlaceholder: 'e.g. 2–8 years', category: 'Clothing category', categoryPlaceholder: 'e.g. dresses, everyday sets', estimatedQuantity: 'Estimated total order quantity', quantityPlaceholder: 'e.g. 300', budget: 'Preferred budget per item (optional)', budgetPlaceholder: 'e.g. $8–12', destination: 'Shipping destination country', recurrence: 'Is this a one-time or recurring order?', oneTime: 'One-time purchase', recurring: 'Recurring wholesale order', fulfillment: 'Do you need ready-made stock or custom manufacturing?', readyMade: 'Ready-made stock', customMade: 'Custom manufacturing', deliveryDate: 'When do you expect the goods?', productionDate: 'Target production date', datePlaceholder: 'e.g. October 2026', fabric: 'Fabric or material preferences', fabricPlaceholder: 'e.g. organic cotton, linen', designReference: 'Design reference or style details', designPlaceholder: 'Describe your reference, design, or attach details in your message', selectOption: 'Select an option',
    detailsTitle: 'Anything else we should know?', message: 'Additional message (optional)', messagePlaceholder: 'Share your requirements, questions, or useful context…', reviewTitle: 'Review your inquiry', customer: 'Customer & business', inquiry: 'Inquiry categories', products: 'Models & quantities', order: 'Order requirements', contact: 'Preferred contact', comments: 'Additional comments', none: 'Not provided', allCollection: 'Complete collection requested', noModels: 'No individual models selected', back: 'Back', next: 'Continue', submit: 'Submit inquiry', whatsappAction: 'Continue on WhatsApp', progress: 'Progress', required: 'Please complete this field.', chooseInquiry: 'Choose at least one inquiry type.', chooseProduct: 'Please select at least one model or request the complete catalog.', invalidEmail: 'Enter a valid email address.', invalidPhone: 'Enter a valid phone number.', submissionSetup: 'Online submission is not configured yet. Please use Continue on WhatsApp or contact the business directly.', submitting: 'Submitting…', submitError: 'Your inquiry could not be submitted. Please try again or continue on WhatsApp.', submitSuccess: 'Your inquiry was submitted successfully. We will be in touch.', whatsappUnavailable: 'WhatsApp contact is not configured. Please contact the business directly.', socialCta: 'Follow us for new collections and model updates.', reviewNote: 'Please check your answers before sending. You can go back to make changes.',
    completeProductDetails: 'Add requested sizes and quantities for each selected model to request prices.', phoneRequired: 'Enter a phone number for your preferred contact method.', invalidQuantity: 'Enter a whole-number quantity greater than zero.', yes: 'Yes', no: 'No',
  },
  ar: {
    title: 'استفسار بيع بالجملة', intro: 'أخبرنا باحتياجات نشاطك التجاري لنتمكن من إعداد رد مناسب.', language: 'اللغة', englishLanguage: 'الإنجليزية', arabicLanguage: 'العربية', russianLanguage: 'الروسية',
    step: 'الخطوة', customerStep: 'بياناتك', typeStep: 'نوع الاستفسار', productStep: 'المنتجات', requirementsStep: 'متطلبات الطلب', reviewStep: 'المراجعة والإرسال',
    customerTitle: 'لنتعرف على نشاطك التجاري', fullName: 'الاسم الكامل', company: 'اسم الشركة أو المتجر', country: 'الدولة', contactMethod: 'وسيلة التواصل المفضلة', whatsapp: 'رقم واتساب', phoneNumber: 'رقم الهاتف', email: 'البريد الإلكتروني (اختياري)', phone: 'الهاتف', methodWhatsApp: 'واتساب', methodEmail: 'البريد الإلكتروني', methodPhone: 'الهاتف',
    typesTitle: 'كيف يمكننا مساعدتك؟', chooseTypes: 'اختر خياراً واحداً أو أكثر', prices: 'طلب أسعار الجملة', model: 'السؤال عن موديل محدد', catalog: 'طلب كتالوج المنتجات الكامل', sizes: 'السؤال عن المقاسات والألوان المتاحة', minimum: 'السؤال عن الحد الأدنى للطلب', shipping: 'السؤال عن الشحن والتوصيل', custom: 'التصنيع أو الإنتاج حسب الطلب', other: 'استفسار آخر',
    productsTitle: 'اختر المنتجات المطلوبة', productsHint: 'ابحث في الكتالوج وأضف الموديلات التي تهمك. يمكنك متابعة طلب الكتالوج دون اختيار موديلات.', search: 'ابحث بالاسم أو رقم الموديل', noProducts: 'لا توجد منتجات مطابقة.', single: 'موديل واحد', multiple: 'عدة موديلات', collection: 'المجموعة كاملة', selected: 'المنتجات المحددة', add: 'أضف للاستفسار', remove: 'إزالة', sizesFor: 'المقاسات المطلوبة', sizesPlaceholder: 'مثال: ٢، ٤، ٦ سنوات', quantityFor: 'الكمية لهذا الموديل', modelNumber: 'الموديل', availableSizes: 'المقاسات المتاحة', availableColors: 'الألوان المتاحة', noExtraDetails: 'لا توجد تفاصيل إضافية مطلوبة لهذا الاستفسار. يمكنك المتابعة إلى المراجعة.',
    requirementsTitle: 'بعض تفاصيل الطلب', ageGroup: 'الفئة العمرية', agePlaceholder: 'مثال: ٢–٨ سنوات', category: 'فئة الملابس', categoryPlaceholder: 'مثال: فساتين، ملابس يومية', estimatedQuantity: 'إجمالي الكمية التقديرية', quantityPlaceholder: 'مثال: ٣٠٠', budget: 'الميزانية المفضلة للقطعة (اختياري)', budgetPlaceholder: 'مثال: ٨–١٢ دولاراً', destination: 'دولة الشحن', recurrence: 'هل الطلب لمرة واحدة أم متكرر؟', oneTime: 'شراء لمرة واحدة', recurring: 'طلب جملة متكرر', fulfillment: 'هل تحتاج إلى مخزون جاهز أم تصنيع حسب الطلب؟', readyMade: 'مخزون جاهز', customMade: 'تصنيع حسب الطلب', deliveryDate: 'متى تتوقع استلام البضائع؟', productionDate: 'الموعد المستهدف للإنتاج', datePlaceholder: 'مثال: أكتوبر ٢٠٢٦', fabric: 'تفضيلات القماش أو الخامة', fabricPlaceholder: 'مثال: قطن عضوي، كتان', designReference: 'مرجع التصميم أو تفاصيل الأسلوب', designPlaceholder: 'صف التصميم المرجعي أو أضف التفاصيل في رسالتك', selectOption: 'اختر خياراً',
    detailsTitle: 'هل هناك تفاصيل أخرى؟', message: 'رسالة إضافية (اختياري)', messagePlaceholder: 'أضف متطلباتك أو أسئلتك أو أي معلومات مفيدة…', reviewTitle: 'راجع استفسارك', customer: 'العميل والنشاط التجاري', inquiry: 'فئات الاستفسار', products: 'الموديلات والكميات', order: 'متطلبات الطلب', contact: 'وسيلة التواصل المفضلة', comments: 'تعليقات إضافية', none: 'لم يتم التحديد', allCollection: 'طلب المجموعة كاملة', noModels: 'لم يتم تحديد موديلات بعينها', back: 'رجوع', next: 'متابعة', submit: 'إرسال الاستفسار', whatsappAction: 'المتابعة عبر واتساب', progress: 'التقدم', required: 'يرجى إكمال هذا الحقل.', chooseInquiry: 'يرجى اختيار نوع استفسار واحد على الأقل.', chooseProduct: 'يرجى اختيار موديل واحد على الأقل أو طلب الكتالوج الكامل.', invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح.', invalidPhone: 'يرجى إدخال رقم هاتف صحيح.', submissionSetup: 'الإرسال عبر الموقع غير مهيأ حالياً. يرجى المتابعة عبر واتساب أو التواصل معنا مباشرة.', submitting: 'جارٍ الإرسال…', submitError: 'تعذر إرسال استفسارك. يرجى المحاولة مجدداً أو المتابعة عبر واتساب.', submitSuccess: 'تم إرسال استفسارك بنجاح. سنتواصل معك قريباً.', whatsappUnavailable: 'لم يتم إعداد رقم واتساب. يرجى التواصل مع الشركة مباشرة.', socialCta: 'تابعونا للتعرف على المجموعات الجديدة وتحديثات الموديلات.', reviewNote: 'يرجى مراجعة إجاباتك قبل الإرسال. يمكنك الرجوع لتعديلها.',
    completeProductDetails: 'يرجى تحديد المقاسات والكميات لكل موديل لطلب الأسعار.', phoneRequired: 'يرجى إدخال رقم الهاتف للتواصل بهذه الوسيلة.', invalidQuantity: 'يرجى إدخال كمية صحيحة أكبر من صفر.', yes: 'نعم', no: 'لا',
  },
  ru: {
    title: 'Оптовый запрос', intro: 'Расскажите о потребностях вашего бизнеса, чтобы мы подготовили точный ответ.', language: 'Язык', englishLanguage: 'Английский', arabicLanguage: 'Арабский', russianLanguage: 'Русский',
    step: 'Шаг', customerStep: 'Ваши данные', typeStep: 'Тема запроса', productStep: 'Товары', requirementsStep: 'Параметры заказа', reviewStep: 'Проверка и отправка',
    customerTitle: 'Расскажите о вашей компании', fullName: 'Полное имя', company: 'Название компании или магазина', country: 'Страна', contactMethod: 'Предпочитаемый способ связи', whatsapp: 'Номер WhatsApp', phoneNumber: 'Номер телефона', email: 'Электронная почта (необязательно)', phone: 'Телефон', methodWhatsApp: 'WhatsApp', methodEmail: 'Электронная почта', methodPhone: 'Телефон',
    typesTitle: 'Чем мы можем помочь?', chooseTypes: 'Выберите один или несколько вариантов', prices: 'Запросить оптовые цены', model: 'Узнать о конкретной модели', catalog: 'Запросить полный каталог', sizes: 'Узнать о доступных размерах и цветах', minimum: 'Узнать о минимальном заказе', shipping: 'Узнать о доставке', custom: 'Производство или индивидуальный пошив', other: 'Другой вопрос',
    productsTitle: 'Выберите товары для запроса', productsHint: 'Найдите товары в каталоге и добавьте нужные модели. Для запроса каталога выбор моделей не обязателен.', search: 'Поиск по названию или номеру модели', noProducts: 'По запросу ничего не найдено.', single: 'Одна модель', multiple: 'Несколько моделей', collection: 'Вся коллекция', selected: 'Выбранные товары', add: 'Добавить в запрос', remove: 'Удалить', sizesFor: 'Нужные размеры', sizesPlaceholder: 'Например: 2, 4, 6 лет', quantityFor: 'Количество этой модели', modelNumber: 'Модель', availableSizes: 'Доступные размеры', availableColors: 'Доступные цвета', noExtraDetails: 'Для этого запроса дополнительные сведения о заказе не нужны. Перейдите к проверке.',
    requirementsTitle: 'Несколько деталей заказа', ageGroup: 'Возрастная группа', agePlaceholder: 'Например: 2–8 лет', category: 'Категория одежды', categoryPlaceholder: 'Например: платья, повседневные комплекты', estimatedQuantity: 'Примерное общее количество', quantityPlaceholder: 'Например: 300', budget: 'Желаемый бюджет за единицу (необязательно)', budgetPlaceholder: 'Например: $8–12', destination: 'Страна доставки', recurrence: 'Разовая или регулярная закупка?', oneTime: 'Разовая покупка', recurring: 'Регулярные оптовые заказы', fulfillment: 'Нужен готовый товар или индивидуальное производство?', readyMade: 'Готовый товар', customMade: 'Индивидуальное производство', deliveryDate: 'Когда ожидаете поставку?', productionDate: 'Планируемый срок производства', datePlaceholder: 'Например: октябрь 2026', fabric: 'Пожелания по ткани и материалам', fabricPlaceholder: 'Например: органический хлопок, лен', designReference: 'Пример дизайна или пожелания по стилю', designPlaceholder: 'Опишите дизайн или добавьте подробности в сообщение', selectOption: 'Выберите вариант',
    detailsTitle: 'Что-нибудь ещё?', message: 'Дополнительное сообщение (необязательно)', messagePlaceholder: 'Опишите ваши требования, вопросы или важные детали…', reviewTitle: 'Проверьте запрос', customer: 'Покупатель и компания', inquiry: 'Темы запроса', products: 'Модели и количество', order: 'Параметры заказа', contact: 'Предпочитаемый способ связи', comments: 'Дополнительные комментарии', none: 'Не указано', allCollection: 'Запрошена вся коллекция', noModels: 'Модели не выбраны', back: 'Назад', next: 'Продолжить', submit: 'Отправить запрос', whatsappAction: 'Продолжить в WhatsApp', progress: 'Выполнено', required: 'Заполните это поле.', chooseInquiry: 'Выберите хотя бы одну тему запроса.', chooseProduct: 'Выберите хотя бы одну модель или запросите полный каталог.', invalidEmail: 'Введите корректный адрес электронной почты.', invalidPhone: 'Введите корректный номер телефона.', submissionSetup: 'Отправка через сайт пока не настроена. Продолжите в WhatsApp или свяжитесь с компанией напрямую.', submitting: 'Отправка…', submitError: 'Не удалось отправить запрос. Попробуйте ещё раз или продолжите в WhatsApp.', submitSuccess: 'Запрос успешно отправлен. Мы свяжемся с вами.', whatsappUnavailable: 'Контакт WhatsApp не настроен. Свяжитесь с компанией напрямую.', socialCta: 'Следите за новыми коллекциями и моделями.', reviewNote: 'Проверьте ответы перед отправкой. Вы можете вернуться и изменить их.',
    completeProductDetails: 'Укажите нужные размеры и количество каждой модели для запроса цен.', phoneRequired: 'Введите номер телефона для выбранного способа связи.', invalidQuantity: 'Укажите целое количество больше нуля.', yes: 'Да', no: 'Нет',
  },
}

const steps = ['customerStep', 'typeStep', 'productStep', 'requirementsStep', 'reviewStep'] as const
const inquiryTypes: InquiryType[] = ['prices', 'model', 'catalog', 'sizes', 'minimum', 'shipping', 'custom', 'other']
const modelRequired: InquiryType[] = ['prices', 'model', 'sizes']

function clean(value: string, maxLength = 500) {
  const sanitized = [...value].filter((character) => {
    const code = character.charCodeAt(0)
    return !(code < 32 && code !== 9 && code !== 10 && code !== 13) && code !== 127 && character !== '<' && character !== '>'
  }).join('')
  return sanitized.trim().slice(0, maxLength)
}

function SmartInquiry() {
  const { lines: cartLines } = useCart()
  const [language, setLanguage] = useState<Language>(readSiteLanguage)
  const [answers, setAnswers] = useState<InquiryAnswers>(initialAnswers)
  const [step, setStep] = useState(0)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [cartImportNotice, setCartImportNotice] = useState('')
  const t = copy[language]
  const isRtl = language === 'ar'

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return products
    return products.filter((product) => `${product.name} ${translateProduct(product, language).name} ${product.modelCode} ${translateProduct(product, language).categoryLabel}`.toLowerCase().includes(term))
  }, [language, search])

  const selectedProducts = products.filter((product) => answers.selectedProducts[product.modelCode])
  const selectedLabels = answers.inquiryTypes.map((item) => t[item]).join(language === 'ar' ? '، ' : ', ')
  const collectionOnly = answers.selectionMode === 'collection'
  const needsModels = answers.inquiryTypes.some((item) => modelRequired.includes(item))
  const asksPrices = answers.inquiryTypes.includes('prices')
  const asksShipping = answers.inquiryTypes.includes('shipping')
  const asksCustom = answers.inquiryTypes.includes('custom')
  const asksQuantity = asksPrices || asksShipping || asksCustom || answers.inquiryTypes.includes('minimum')
  const showsRequirementFields = asksPrices || asksShipping || asksCustom || asksQuantity || answers.inquiryTypes.includes('other')

  useEffect(() => {
    const syncLanguage = (event: Event) => {
      const value = (event as CustomEvent<string>).detail?.toLowerCase()
      if (value === 'en' || value === 'ar' || value === 'ru') {
        setLanguage(value)
        setError('')
        document.documentElement.lang = value
        document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr'
      }
    }
    window.addEventListener('site-language-change', syncLanguage)
    return () => window.removeEventListener('site-language-change', syncLanguage)
  }, [])

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('fromCart') !== '1' || cartLines.length === 0) return
    const imported: Record<string, SelectedProduct> = {}
    for (const line of cartLines) {
      const product = products.find((item) => item.modelCode === line.modelCode)
      if (!product) continue
      const sizeSummary = Object.entries(line.quantities).map(([size, quantity]) => `${formatSizeLabel(size, language)}: ${quantity}`).join('، ')
      const previous = imported[line.modelCode]
      const existingSizes = previous?.sizes ? `${previous.sizes}; ` : ''
      imported[line.modelCode] = {
        sizes: `${existingSizes}${line.color ? `${translateColor(line.color, language)} — ` : ''}${sizeSummary}`,
        quantity: String(Number(previous?.quantity ?? 0) + getLineQuantity(line)),
        variantSummary: [previous?.variantSummary, `${translateColor(line.color, language)}${line.notes ? ` (${line.notes})` : ''}`].filter(Boolean).join('، '),
      }
    }
    if (Object.keys(imported).length === 0) return
    setAnswers((current) => ({
      ...current,
      inquiryTypes: current.inquiryTypes.includes('prices') ? current.inquiryTypes : [...current.inquiryTypes, 'prices'],
      selectionMode: Object.keys(imported).length === 1 ? 'single' : 'multiple',
      selectedProducts: { ...current.selectedProducts, ...imported },
      estimatedQuantity: String(cartLines.reduce((total, line) => total + getLineQuantity(line), 0)),
    }))
    setCartImportNotice(language === 'ar' ? 'تم استيراد منتجات السلة ومقاساتها وكمياتها.' : language === 'ru' ? 'Модели, размеры и количество из корзины добавлены в запрос.' : 'Cart models, sizes, and quantities have been added to your inquiry.')
    setStep(2)
    window.history.replaceState({}, '', `${window.location.pathname}#inquiry`)
  }, [cartLines, language])

  function update<K extends keyof InquiryAnswers>(key: K, value: InquiryAnswers[K]) {
    setAnswers((current) => ({ ...current, [key]: value }))
    setError('')
    setSuccess('')
  }

  function changeLanguage(value: Language) {
    setLanguage(value)
    setError('')
    setSiteLanguage(value)
  }

  function validateStep(currentStep: number) {
    if (currentStep === 0) {
      if (!answers.fullName || !answers.company || !answers.country || !answers.whatsapp) {
        setError(t.required)
        return false
      }
      if (answers.contactMethod === 'email' && !answers.email) {
        setError(t.required)
        return false
      }
      if (answers.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email)) {
        setError(t.invalidEmail)
        return false
      }
      if (!/^[+()\d\s.-]{7,25}$/.test(answers.whatsapp)) {
        setError(t.invalidPhone)
        return false
      }
      if (answers.contactMethod === 'phone' && !answers.phoneNumber) {
        setError(t.phoneRequired)
        return false
      }
      if (answers.contactMethod === 'phone' && !/^[+()\d\s.-]{7,25}$/.test(answers.phoneNumber)) {
        setError(t.invalidPhone)
        return false
      }
    }
    if (currentStep === 1 && answers.inquiryTypes.length === 0) {
      setError(t.chooseInquiry)
      return false
    }
    if (currentStep === 2 && needsModels && !collectionOnly && selectedProducts.length === 0) {
      setError(t.chooseProduct)
      return false
    }
    if (currentStep === 2 && asksPrices && selectedProducts.some((product) => {
      const selection = answers.selectedProducts[product.modelCode]
      return !selection.sizes || !selection.quantity || Number(selection.quantity) < 1
    })) {
      setError(t.completeProductDetails)
      return false
    }
    if (currentStep === 3 && asksShipping && !answers.destination) {
      setError(t.required)
      return false
    }
    if (currentStep === 3 && answers.estimatedQuantity && (!Number.isInteger(Number(answers.estimatedQuantity)) || Number(answers.estimatedQuantity) < 1)) {
      setError(t.invalidQuantity)
      return false
    }
    setError('')
    return true
  }

  function nextStep() {
    if (validateStep(step)) setStep((current) => Math.min(4, current + 1))
  }

  function toggleInquiry(type: InquiryType) {
    const next = answers.inquiryTypes.includes(type)
      ? answers.inquiryTypes.filter((item) => item !== type)
      : [...answers.inquiryTypes, type]
    update('inquiryTypes', next)
    if (!next.includes('shipping')) {
      update('destination', '')
      update('deliveryDate', '')
    }
    if (!next.includes('custom')) {
      update('fabric', '')
      update('designReference', '')
      update('productionDate', '')
    }
    if (!next.includes('shipping') && !next.includes('custom')) {
      update('fulfillment', '')
    }
    if (!next.includes('prices') && !next.includes('shipping') && !next.includes('custom')) update('recurrence', '')
    if (!next.includes('prices')) update('budget', '')
    if (!next.includes('prices') && !next.includes('custom')) update('ageGroup', '')
    if (!next.includes('prices') && !next.includes('custom') && !next.includes('other')) update('category', '')
    if (!next.some((item) => ['prices', 'shipping', 'custom', 'minimum'].includes(item))) update('estimatedQuantity', '')
  }

  function toggleProduct(modelCode: string) {
    const selected = { ...answers.selectedProducts }
    if (selected[modelCode]) {
      delete selected[modelCode]
    } else {
      if (answers.selectionMode === 'single') {
        Object.keys(selected).forEach((key) => delete selected[key])
      }
      selected[modelCode] = { sizes: '', quantity: '' }
    }
    update('selectedProducts', selected)
    if (answers.selectionMode !== 'collection') setSuccess('')
  }

  function updateProduct(modelCode: string, key: keyof SelectedProduct, value: string) {
    const current = answers.selectedProducts[modelCode]
    if (!current) return
    update('selectedProducts', {
      ...answers.selectedProducts,
      [modelCode]: { ...current, [key]: clean(value, 80) },
    })
  }

  function updateText(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget
    if (name in answers && name !== 'selectedProducts' && name !== 'inquiryTypes') {
      setAnswers((current) => ({ ...current, [name]: clean(value, name === 'message' ? 2000 : 200) }))
      setError('')
      setSuccess('')
    }
  }

  function getRequirements() {
    return [
      answers.ageGroup && `${t.ageGroup}: ${answers.ageGroup}`,
      answers.category && `${t.category}: ${answers.category}`,
      answers.estimatedQuantity && `${t.estimatedQuantity}: ${answers.estimatedQuantity}`,
      answers.budget && `${t.budget}: ${answers.budget}`,
      answers.destination && `${t.destination}: ${answers.destination}`,
      answers.recurrence && `${t.recurrence}: ${t[answers.recurrence]}`,
      answers.fulfillment && `${t.fulfillment}: ${t[answers.fulfillment]}`,
      answers.deliveryDate && `${t.deliveryDate}: ${answers.deliveryDate}`,
      answers.productionDate && `${t.productionDate}: ${answers.productionDate}`,
      answers.fabric && `${t.fabric}: ${answers.fabric}`,
      answers.designReference && `${t.designReference}: ${answers.designReference}`,
    ].filter((item): item is string => Boolean(item))
  }

  function getContactMethodLabel() {
    if (answers.contactMethod === 'whatsapp') return t.methodWhatsApp
    return answers.contactMethod === 'email' ? t.methodEmail : t.methodPhone
  }

  function createSummary() {
    const lines = [
      `${t.customer}: ${answers.fullName} | ${answers.company} | ${answers.country} | ${t.whatsapp}: ${answers.whatsapp}${answers.email ? ` | ${t.email}: ${answers.email}` : ''}`,
      `${t.inquiry}: ${selectedLabels}`,
      `${t.products}: ${collectionOnly ? t.allCollection : selectedProducts.length ? selectedProducts.map((product) => {
        const selection = answers.selectedProducts[product.modelCode]
        return `${product.modelCode}${selection.variantSummary ? `، ${t.availableColors}: ${selection.variantSummary}` : ''}${selection.sizes ? `، ${t.sizesFor}: ${selection.sizes}` : ''}${selection.quantity ? `، ${t.quantityFor}: ${selection.quantity}` : ''}`
      }).join('؛ ') : t.noModels}`,
      `${t.contact}: ${getContactMethodLabel()} · ${answers.contactMethod === 'email' ? answers.email : answers.contactMethod === 'phone' ? answers.phoneNumber : answers.whatsapp}`,
    ]
    const requirements = getRequirements()
    if (requirements.length) lines.push(`${t.order}: ${requirements.join(' | ')}`)
    if (answers.message) lines.push(`${t.comments}: ${answers.message}`)
    return lines.join('\n')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')
    for (let index = 0; index < 3; index += 1) {
      if (!validateStep(index)) {
        setStep(index)
        return
      }
    }
    if (!inquiryEndpoint) {
      setError(t.submissionSetup)
      return
    }
    setSubmitting(true)
    try {
      const response = await fetch(inquiryEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ language, answers, summary: createSummary() }),
      })
      if (!response.ok) {
        setError(`${t.submitError} (${response.status})`)
        return
      }
      setSuccess(t.submitSuccess)
    } catch {
      setError(t.submitError)
    } finally {
      setSubmitting(false)
    }
  }

  const whatsappIsConfigured = Boolean(business.whatsappNumber.replace(/\D/g, ''))
  const prefilledWhatsAppUrl = whatsappIsConfigured ? whatsappUrl(`${t.title}\n${createSummary()}`) : ''

  function input(name: keyof InquiryAnswers, label: string, placeholder = '', required = false, type = 'text') {
    return (
      <label className="smart-field" key={name}>
        <span>{label}{required && <b aria-hidden="true"> *</b>}</span>
        <input name={name} type={type} min={type === 'number' ? 1 : undefined} max={type === 'number' ? 1000000 : undefined} value={String(answers[name])} placeholder={placeholder} required={required} autoComplete={name === 'fullName' ? 'name' : name === 'company' ? 'organization' : name === 'country' ? 'country-name' : undefined} onChange={updateText} maxLength={name === 'message' ? 2000 : 200} />
      </label>
    )
  }

  return (
    <section className="smart-inquiry-section" id="inquiry" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="smart-inquiry page-width">
        <header className="smart-inquiry-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> {business.name}</p>
            <h2>{t.title}</h2>
            <p>{t.intro}</p>
          </div>
          <label className="smart-language">
            <span className="sr-only">{t.language}</span>
            <select value={language} onChange={(event) => changeLanguage(event.target.value as Language)} aria-label={t.language}>
              <option value="en">{t.englishLanguage}</option>
              <option value="ar">{t.arabicLanguage}</option>
              <option value="ru">{t.russianLanguage}</option>
            </select>
          </label>
        </header>

        <div className="smart-progress" role="list" aria-label={`${t.progress}: ${step + 1} / 5`}>
          {steps.map((key, index) => (
            <div
              className={`smart-progress-step ${index <= step ? 'is-active' : ''} ${index < step ? 'is-complete' : ''}`}
              key={key}
              role="listitem"
              aria-current={index === step ? 'step' : undefined}
              aria-label={`${t[key]}: ${index + 1} / ${steps.length}`}
            >
              <span>{index < step ? <Check size={15} aria-hidden="true" /> : index + 1}</span>
              <small>{t[key]}</small>
            </div>
          ))}
        </div>

        <form className="smart-form" onSubmit={submit} noValidate>
          {step === 0 && <section className="smart-step">
            <h3>{t.customerTitle}</h3>
            <div className="smart-fields-grid">
              {input('fullName', t.fullName, '', true)}
              {input('company', t.company, '', true)}
              {input('country', t.country, '', true)}
              <label className="smart-field"><span>{t.contactMethod}</span><select value={answers.contactMethod} onChange={(event) => update('contactMethod', event.target.value as ContactMethod)}><option value="whatsapp">WhatsApp</option><option value="email">{t.email}</option><option value="phone">{t.phone}</option></select></label>
              {input('whatsapp', t.whatsapp, '+90 555 123 4567', true, 'tel')}
              {answers.contactMethod === 'phone' && input('phoneNumber', t.phoneNumber, '+90 555 123 4567', true, 'tel')}
              {input('email', t.email, '', false, 'email')}
            </div>
          </section>}

          {step === 1 && <section className="smart-step">
            <h3>{t.typesTitle}</h3><p className="smart-hint">{t.chooseTypes}</p>
            <div className="smart-choice-grid">
              {inquiryTypes.map((type) => <label className={`smart-choice ${answers.inquiryTypes.includes(type) ? 'selected' : ''}`} key={type}>
                <input type="checkbox" checked={answers.inquiryTypes.includes(type)} onChange={() => toggleInquiry(type)} />
                <span>{t[type]}</span>
              </label>)}
            </div>
          </section>}

          {step === 2 && <section className="smart-step">
            <h3>{t.productsTitle}</h3><p className="smart-hint">{t.productsHint}</p>
            {cartImportNotice && <p className="smart-message-success" role="status">{cartImportNotice}</p>}
            <fieldset className="smart-mode">
              <legend className="sr-only">{t.productsTitle}</legend>
              {(['single', 'multiple', 'collection'] as const).map((mode) => <label key={mode} className={answers.selectionMode === mode ? 'selected' : ''}><input type="radio" name="selectionMode" checked={answers.selectionMode === mode} onChange={() => {
                update('selectionMode', mode)
                if (mode === 'collection') update('selectedProducts', {})
                if (mode === 'single' && selectedProducts.length > 1) update('selectedProducts', { [selectedProducts[0].modelCode]: answers.selectedProducts[selectedProducts[0].modelCode] })
              }} />{t[mode]}</label>)}
            </fieldset>
            {!collectionOnly && <>
              <label className="smart-search"><Search size={18} aria-hidden="true" /><span className="sr-only">{t.search}</span><input value={search} onChange={(event) => setSearch(clean(event.target.value, 100))} placeholder={t.search} /></label>
              <div className="smart-product-grid">
                {filteredProducts.map((product) => {
                  const selected = Boolean(answers.selectedProducts[product.modelCode])
                  return <article className={`smart-product ${selected ? 'selected' : ''}`} key={product.modelCode}>
                    <img src={product.image} alt={translateProduct(product, language).imageAlt} loading="lazy" />
                    <div className="smart-product-content"><span className="smart-model" dir="ltr">{product.modelCode}</span><h4>{translateProduct(product, language).name}</h4><p>{t.availableSizes}: {translateProduct(product, language).sizes}<br />{t.availableColors}: {translateProduct(product, language).displayedColors}</p><button type="button" className={selected ? 'smart-small-button remove' : 'smart-small-button'} onClick={() => toggleProduct(product.modelCode)}>{selected ? <><Trash2 size={15} /> {t.remove}</> : <><Check size={15} /> {t.add}</>}</button></div>
                  </article>
                })}
              </div>
              {filteredProducts.length === 0 && <p className="smart-hint">{t.noProducts}</p>}
            </>}
            {selectedProducts.length > 0 && <div className="smart-selected-products"><h4>{t.selected}</h4>
              {selectedProducts.map((product) => <div className="smart-selected-item" key={product.modelCode}>
                <strong><bdi dir="ltr">{product.modelCode}</bdi> · {translateProduct(product, language).name}</strong>
                <span>{t.availableSizes}: {translateProduct(product, language).sizes} · {t.availableColors}: {translateProduct(product, language).displayedColors}</span>
                <div className="smart-fields-grid">
                  <label className="smart-field"><span>{t.sizesFor} · {product.modelCode}</span><input value={answers.selectedProducts[product.modelCode].sizes} placeholder={t.sizesPlaceholder} maxLength={80} onChange={(event) => updateProduct(product.modelCode, 'sizes', event.target.value)} /></label>
                  <label className="smart-field"><span>{t.quantityFor} · {product.modelCode}</span><input type="number" min="1" max="1000000" inputMode="numeric" value={answers.selectedProducts[product.modelCode].quantity} placeholder="0" onChange={(event) => updateProduct(product.modelCode, 'quantity', event.target.value.replace(/\D/g, '').slice(0, 7))} /></label>
                </div>
              </div>)}
            </div>}
          </section>}

          {step === 3 && <section className="smart-step">
            <h3>{t.requirementsTitle}</h3>
            <div className="smart-fields-grid">
              {(asksPrices || asksCustom) && input('ageGroup', t.ageGroup, t.agePlaceholder)}
              {(asksPrices || asksCustom || answers.inquiryTypes.includes('other')) && input('category', t.category, t.categoryPlaceholder)}
              {asksQuantity && input('estimatedQuantity', t.estimatedQuantity, t.quantityPlaceholder, false, 'number')}
              {asksPrices && input('budget', t.budget, t.budgetPlaceholder)}
              {asksShipping && input('destination', t.destination, '', true)}
              {(asksPrices || asksShipping || asksCustom) && <label className="smart-field"><span>{t.recurrence}</span><select value={answers.recurrence} onChange={(event) => update('recurrence', event.target.value)}><option value="">{t.selectOption}</option><option value="oneTime">{t.oneTime}</option><option value="recurring">{t.recurring}</option></select></label>}
              {(asksShipping || asksCustom) && <label className="smart-field"><span>{t.fulfillment}</span><select value={answers.fulfillment} onChange={(event) => update('fulfillment', event.target.value)}><option value="">{t.selectOption}</option><option value="readyMade">{t.readyMade}</option><option value="customMade">{t.customMade}</option></select></label>}
              {asksShipping && input('deliveryDate', t.deliveryDate, t.datePlaceholder)}
              {asksCustom && input('productionDate', t.productionDate, t.datePlaceholder)}
              {asksCustom && input('fabric', t.fabric, t.fabricPlaceholder)}
              {asksCustom && input('designReference', t.designReference, t.designPlaceholder)}
            </div>
            {!showsRequirementFields && <p className="smart-hint">{t.noExtraDetails}</p>}
          </section>}

          {step === 4 && <section className="smart-step">
            <h3>{t.detailsTitle}</h3>
            <label className="smart-field smart-message"><span>{t.message}</span><textarea name="message" rows={5} value={answers.message} onChange={updateText} placeholder={t.messagePlaceholder} maxLength={2000} /></label>
            <h3 className="smart-review-heading">{t.reviewTitle}</h3>
            <p className="smart-hint">{t.reviewNote}</p>
            <div className="smart-review">
              <article><h4>{t.customer}</h4><p>{answers.fullName} · {answers.company} · {answers.country} · {t.whatsapp}: {answers.whatsapp}{answers.email ? ` · ${t.email}: ${answers.email}` : ''}</p></article>
              <article><h4>{t.inquiry}</h4><p>{selectedLabels || t.none}</p></article>
              <article><h4>{t.products}</h4><p>{collectionOnly ? t.allCollection : selectedProducts.length ? selectedProducts.map((product) => {
                const selection = answers.selectedProducts[product.modelCode]
                return `${product.modelCode} — ${translateProduct(product, language).name}${selection.variantSummary ? `؛ ${t.availableColors}: ${selection.variantSummary}` : ''}${selection.sizes ? `؛ ${t.sizesFor}: ${selection.sizes}` : ''}${selection.quantity ? `؛ ${t.quantityFor}: ${selection.quantity}` : ''}`
              }).join(' · ') : t.noModels}</p></article>
              <article><h4>{t.order}</h4><p>{getRequirements().join('\n') || t.none}</p></article>
              <article><h4>{t.contact}</h4><p>{getContactMethodLabel()} · {answers.contactMethod === 'email' ? answers.email : answers.contactMethod === 'phone' ? answers.phoneNumber : answers.whatsapp}</p></article>
              {answers.message && <article><h4>{t.comments}</h4><p>{answers.message}</p></article>}
            </div>
          </section>}

          {error && <p className="smart-message-error" role="alert">{error}</p>}
          {success && <p className="smart-message-success" role="status">{success}</p>}
          <div className="smart-form-actions">
            {step > 0 && <button type="button" className="smart-button secondary" onClick={() => { setStep((current) => current - 1); setError('') }}><ArrowLeft size={17} /> {t.back}</button>}
            {step < 4 ? <button type="button" className="smart-button primary" onClick={nextStep}>{t.next} <ArrowRight size={17} /></button> : <>
              <button type="submit" className="smart-button primary" disabled={submitting}>{submitting ? t.submitting : t.submit}</button>
              {whatsappIsConfigured
                ? <a className="smart-button whatsapp" href={prefilledWhatsAppUrl} target="_blank" rel="noopener noreferrer">{t.whatsappAction}</a>
                : <button type="button" className="smart-button whatsapp" onClick={() => setError(t.whatsappUnavailable)}>{t.whatsappAction}</button>}
            </>}
          </div>
        </form>
        <p className="smart-follow-note">{t.socialCta}</p>
      </div>
    </section>
  )
}

export default SmartInquiry
