import { useMemo, useState } from 'react'
import { ArrowRight, ArrowUpRight, BadgeCheck, Globe2, Mail, MapPin, MessageCircle, PackageCheck, Phone, Scissors, Search, Shirt, Truck, Clock3, Handshake } from 'lucide-react'
import { business, whatsappUrl } from '../config/business'
import { sectionHref } from '../config/navigation'
import { products } from '../data/products'
import { translateProduct } from '../data/productTranslations'
import { useSiteLanguage } from '../hooks/useSiteLanguage'
import ProductGallery from './ProductGallery'
import SocialIcon from './SocialIcon'
import WhatsAppButton from './WhatsAppButton'
import AddToCartDialog from '../cart/AddToCartDialog'
import { useCart } from '../cart/useCart'

export function About() {
  const language = useSiteLanguage()
  const copy = {
    en: { eyebrow: 'A partner in every detail', title: <>Made for little ones.<br /><em>Ready for the world.</em></>, intro: 'We’re a wholesale children’s clothing studio based in Istanbul, connecting thoughtful design with the needs of independent retailers worldwide.', meet: 'Meet your supply partner', alt: 'Children in carefully styled occasion wear', imageNote: <>Designed with care<br />in Istanbul, Türkiye</>, paragraphs: ['Our collections bring together modern, European-inspired design and the quality Turkish production is known for. We work closely with boutiques, retailers and distributors to make sourcing simple and dependable.', 'Explore a considered range of models, sizes and colors, with international shipping available. Assortment and availability vary by collection—our team will share the latest details directly.'], points: ['Curated seasonal collections', 'International B2B supply'] },
    ar: { eyebrow: 'شريك يهتم بكل التفاصيل', title: <>مصممة لأطفالكم.<br /><em>وجاهزة للعالم.</em></>, intro: 'استوديو متخصص في بيع ملابس الأطفال بالجملة، مقره إسطنبول، يجمع بين التصميم المدروس واحتياجات المتاجر المستقلة حول العالم.', meet: 'تعرّفوا على شريك التوريد', alt: 'أطفال يرتدون أزياء أنيقة للمناسبات', imageNote: <>تصميم بعناية<br />في إسطنبول، تركيا</>, paragraphs: ['تجمع مجموعاتنا بين التصميم العصري المستوحى من الطراز الأوروبي وجودة التصنيع التركي المعروفة. ونعمل عن قرب مع البوتيكات والمتاجر والموزعين لنجعل التوريد سهلاً وموثوقاً.', 'اكتشفوا تشكيلة مختارة من الموديلات والمقاسات والألوان، مع توفر الشحن الدولي. تختلف التشكيلة والتوافر بحسب المجموعة، وسيشارككم فريقنا أحدث التفاصيل مباشرة.'], points: ['مجموعات موسمية مختارة بعناية', 'توريد دولي لقطاع الأعمال'] },
    ru: { eyebrow: 'Партнёр, который ценит детали', title: <>Для маленьких покупателей.<br /><em>Для всего мира.</em></>, intro: 'Оптовая студия детской одежды в Стамбуле объединяет продуманный дизайн и потребности независимых магазинов по всему миру.', meet: 'Познакомьтесь с поставщиком', alt: 'Дети в тщательно подобранной праздничной одежде', imageNote: <>Создано с заботой<br />в Стамбуле, Турция</>, paragraphs: ['В наших коллекциях современный европейский дизайн сочетается с качеством турецкого производства. Мы тесно сотрудничаем с бутиками, магазинами и дистрибьюторами, помогая организовать надёжные поставки.', 'Откройте тщательно подобранные модели, размеры и цвета. Доступна международная доставка. Ассортимент и наличие зависят от коллекции — наша команда сообщит актуальную информацию.'], points: ['Подборки сезонных коллекций', 'Международные B2B-поставки'] },
  }[language]
  return (
    <section className="section about-section" id="about">
      <div className="page-width about-grid">
        <div className="section-heading about-heading">
          <p className="eyebrow"><span className="eyebrow-line" /> {copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p className="section-intro">{copy.intro}</p>
          <a className="text-link" href="#contact">{copy.meet} <ArrowRight size={17} /></a>
        </div>
        <div className="about-image-wrap">
          <img src="https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=900&q=85" alt={copy.alt} loading="lazy" />
          <div className="image-note"><span className="note-mark">m.</span><span>{copy.imageNote}</span></div>
        </div>
        <div className="about-details">
          <p>{copy.paragraphs[0]}</p>
          <p>{copy.paragraphs[1]}</p>
          <div className="about-points"><span><BadgeCheck size={16} /> {copy.points[0]}</span><span><Globe2 size={16} /> {copy.points[1]}</span></div>
        </div>
      </div>
    </section>
  )
}

export function Collections() {
  const { addLine, lines: cartLines } = useCart()
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const language = useSiteLanguage()
  const copy = {
    en: { eyebrow: 'The collection', title: 'Small details.', subtitle: 'Big little moments.', intro: 'A preview of our latest wholesale range. Ask our team for the full catalog, current availability and pricing.', all: 'All pieces', girls: "Girls' Dresses", boys: "Boys' Clothing", occasion: 'Occasion Wear', holiday: 'Eid & Holiday', new: 'New Arrivals', search: 'Search styles or model numbers', filter: 'Filter collection by category', sizes: 'Sizes', age: 'Age range', fabric: 'Fabric', colors: 'Colors', ask: 'Ask for wholesale price', empty: 'No products match your search.', note: 'Wholesale catalog preview', noteText: 'Styles, sizes and colors are subject to availability. Contact us for the current line sheet.', categories: { "Girls' Dresses": "Girls' Dresses", "Boys' Clothing": "Boys' Clothing", 'Occasion Wear': 'Occasion Wear', 'Eid & Holiday': 'Eid & Holiday', 'New Arrivals': 'New Arrivals' } },
    ar: { eyebrow: 'المجموعة', title: 'تفاصيل صغيرة.', subtitle: 'لحظات جميلة.', intro: 'تعرّف على مجموعة الجملة. تواصل معنا للحصول على الكتالوج الكامل والأسعار والتوفر الحالي.', all: 'جميع المنتجات', girls: 'فساتين البنات', boys: 'ملابس الأولاد', occasion: 'ملابس المناسبات', holiday: 'الأعياد والمناسبات', new: 'وصل حديثاً', search: 'ابحث عن الموديل أو رقمه', filter: 'تصفية المجموعة حسب الفئة', sizes: 'المقاسات', age: 'الفئة العمرية', fabric: 'القماش', colors: 'الألوان', ask: 'اسأل عن سعر الجملة', empty: 'لا توجد منتجات مطابقة لبحثك.', note: 'معاينة كتالوج الجملة', noteText: 'تختلف الموديلات والمقاسات والألوان حسب التوفر. تواصل معنا للحصول على قائمة المنتجات الحالية.', categories: { "Girls' Dresses": 'فساتين البنات', "Boys' Clothing": 'ملابس الأولاد', 'Occasion Wear': 'ملابس المناسبات', 'Eid & Holiday': 'الأعياد والمناسبات', 'New Arrivals': 'وصل حديثاً' } },
    ru: { eyebrow: 'Коллекция', title: 'Важны детали.', subtitle: 'Красивые моменты.', intro: 'Обзор оптовой коллекции. Полный каталог, наличие и цены уточняйте у нашей команды.', all: 'Все модели', girls: 'Платья для девочек', boys: 'Одежда для мальчиков', occasion: 'Нарядная одежда', holiday: 'Праздничная коллекция', new: 'Новинки', search: 'Поиск по модели или номеру', filter: 'Фильтр по категориям', sizes: 'Размеры', age: 'Возраст', fabric: 'Ткань', colors: 'Цвета', ask: 'Запросить оптовую цену', empty: 'По вашему запросу ничего не найдено.', note: 'Предварительный каталог', noteText: 'Наличие моделей, размеров и цветов уточняйте у нашей команды.', categories: { "Girls' Dresses": 'Платья для девочек', "Boys' Clothing": 'Одежда для мальчиков', 'Occasion Wear': 'Нарядная одежда', 'Eid & Holiday': 'Праздничная коллекция', 'New Arrivals': 'Новинки' } },
  }[language]
  const categories = [
    { id: 'all', label: copy.all },
    { id: "Girls' Dresses", label: copy.girls },
    { id: "Boys' Clothing", label: copy.boys },
    { id: 'Occasion Wear', label: copy.occasion },
    { id: 'Eid & Holiday', label: copy.holiday },
    { id: 'New Arrivals', label: copy.new },
  ]
  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory
    const term = search.trim().toLocaleLowerCase()
    const localized = translateProduct(product, language)
    const matchesSearch = !term || `${localized.name} ${product.name} ${product.modelCode} ${localized.categoryLabel} ${localized.sizes} ${localized.displayedColors}`.toLocaleLowerCase().includes(term)
    return matchesCategory && matchesSearch
  }), [activeCategory, language, search])

  return (
    <section className="section collection-section" id="collections">
      <div className="page-width">
        <div className="section-topline">
          <div className="section-heading">
            <p className="eyebrow"><span className="eyebrow-line" /> {copy.eyebrow}</p>
            <h2>{copy.title}<br /><em>{copy.subtitle}</em></h2>
          </div>
          <p className="section-sidecopy">{copy.intro}</p>
        </div>
        <div className="catalog-controls">
          <div className="category-list" role="group" aria-label={copy.filter}>
            {categories.map((category) => <button key={category.id} type="button" className={activeCategory === category.id ? 'category-chip selected' : 'category-chip'} aria-pressed={activeCategory === category.id} onClick={() => setActiveCategory(category.id)}>{category.label}</button>)}
          </div>
          <label className="catalog-search"><Search size={17} aria-hidden="true" /><span className="sr-only">{copy.search}</span><input value={search} onChange={(event) => setSearch(event.target.value.slice(0, 100))} placeholder={copy.search} /></label>
        </div>
        <div className="product-grid" aria-live="polite">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.modelCode}>
              <div className="product-photo-wrap">
                <ProductGallery product={product} />
                {translateProduct(product, language).badge && <span className="product-badge">{translateProduct(product, language).badge}</span>}
                <span className="product-category">{translateProduct(product, language).categoryLabel}</span>
              </div>
              <div className="product-info">
                <div className="product-title-row"><h3>{translateProduct(product, language).name}</h3><span dir="ltr">{product.modelCode}</span></div>
                <dl className="product-specs">
                  {product.ageRange && <div><dt>{copy.age}</dt><dd dir={language === 'ar' ? 'rtl' : undefined}>{translateProduct(product, language).sizes}</dd></div>}
                  <div><dt>{copy.sizes}</dt><dd>{translateProduct(product, language).sizes}</dd></div>
                  {product.fabric && <div><dt>{copy.fabric}</dt><dd>{product.fabric}</dd></div>}
                  <div><dt>{copy.colors}</dt><dd>{translateProduct(product, language).displayedColors}</dd></div>
                </dl>
                <a className="product-ask" href={whatsappUrl(language === 'ar' ? `مرحباً، أود الاستفسار عن ${translateProduct(product, language).name} (${product.modelCode}). يرجى تزويدي بسعر الجملة والتوفر الحالي.` : `Hello, I am interested in ${product.name} (${product.modelCode}). Please share its wholesale price and current availability.`)} target="_blank" rel="noopener noreferrer">{copy.ask} <ArrowUpRight size={16} /></a>
                <AddToCartDialog product={product} otherModelQuantity={cartLines.filter((line) => line.modelCode === product.modelCode).reduce((total, line) => total + Object.values(line.quantities).reduce((sum, quantity) => sum + quantity, 0), 0)} onSave={addLine} />
              </div>
            </article>
          ))}
        </div>
        {visibleProducts.length === 0 && <p className="catalog-empty" role="status">{copy.empty}</p>}
        <p className="catalog-note"><span>{copy.note}</span> · {copy.noteText}</p>
      </div>
    </section>
  )
}

const benefits = [
  { icon: Scissors, title: 'Turkish quality', text: 'Thoughtful materials and careful finishing from a trusted apparel region.' },
  { icon: Shirt, title: 'Wholesale only', text: 'A focused B2B partner for stores, boutiques, importers and distributors.' },
  { icon: BadgeCheck, title: 'Modern designs', text: 'Easy-to-merchandise styles with a fresh, European-inspired sensibility.' },
  { icon: Truck, title: 'International shipping', text: 'We coordinate shipping options for buyers across our international markets.' },
  { icon: PackageCheck, title: 'Flexible assortments', text: 'Ask about available models, sizes, colors and order quantities.' },
  { icon: Handshake, title: 'Reliable B2B service', text: 'Clear communication and practical support from inquiry to dispatch.' },
]

export function Benefits() {
  const language = useSiteLanguage()
  const copy = {
    en: { eyebrow: 'The Minik difference', title: <>Good business,<br /><em>beautifully made.</em></>, benefits: [['Turkish quality', 'Thoughtful materials and careful finishing from a trusted apparel region.'], ['Wholesale only', 'A focused B2B partner for stores, boutiques, importers and distributors.'], ['Modern designs', 'Easy-to-merchandise styles with a fresh, European-inspired sensibility.'], ['International shipping', 'We coordinate shipping options for buyers across our international markets.'], ['Flexible assortments', 'Ask about available models, sizes, colors and order quantities.'], ['Reliable B2B service', 'Clear communication and practical support from inquiry to dispatch.']] },
    ar: { eyebrow: 'ما يميز مينيك', title: <>تجارة موثوقة،<br /><em>بجودة متقنة.</em></>, benefits: [['جودة تركية', 'خامات مختارة بعناية وتشطيب متقن من منطقة عريقة في صناعة الملابس.'], ['للجملة فقط', 'شريك متخصص في التعاملات التجارية مع المتاجر والبوتيكات والمستوردين والموزعين.'], ['تصاميم عصرية', 'موديلات أنيقة سهلة العرض بلمسة أوروبية متجددة.'], ['شحن دولي', 'ننسق خيارات الشحن للمشترين في أسواقنا الدولية.'], ['تشكيلات مرنة', 'استفسروا عن الموديلات والمقاسات والألوان وكميات الطلب المتاحة.'], ['خدمة أعمال موثوقة', 'تواصل واضح ودعم عملي من الاستفسار حتى تجهيز الشحنة.']] },
    ru: { eyebrow: 'Преимущества Minik', title: <>Надёжное партнёрство,<br /><em>продуманное качество.</em></>, benefits: [['Турецкое качество', 'Тщательно подобранные материалы и аккуратная отделка из региона с развитым производством одежды.'], ['Только опт', 'Специализированный B2B-партнёр для магазинов, бутиков, импортёров и дистрибьюторов.'], ['Современный дизайн', 'Актуальные модели, которые легко представить покупателям.'], ['Международная доставка', 'Подбираем варианты доставки для покупателей на разных рынках.'], ['Гибкий ассортимент', 'Уточняйте доступные модели, размеры, цвета и объём заказа.'], ['Надёжный B2B-сервис', 'Понятная коммуникация и практическая поддержка от запроса до отправки.']] },
  }[language]
  return (
    <section className="section benefits-section" id="why-us">
      <div className="page-width">
        <div className="section-heading centered-heading"><p className="eyebrow"><span className="eyebrow-line" /> {copy.eyebrow}</p><h2>{copy.title}</h2></div>
        <div className="benefit-grid">{benefits.map(({ icon: Icon }, index) => <article className="benefit-card" key={copy.benefits[index][0]}><span className="benefit-index" dir="ltr">0{index + 1}</span><Icon size={23} strokeWidth={1.5} /><h3>{copy.benefits[index][0]}</h3><p>{copy.benefits[index][1]}</p></article>)}</div>
      </div>
    </section>
  )
}

export function Process() {
  const language = useSiteLanguage()
  const copy = {
    en: { eyebrow: 'A simple way to work together', title: <>From first look<br /><em>to first delivery.</em></>, intro: 'A personal, straightforward process designed around wholesale buyers.', cta: 'Start a conversation', steps: [['Browse our collections', 'Explore the styles in our catalog preview.'], ['Contact us on WhatsApp', 'Tell us about your store and what you’re looking for.'], ['Receive wholesale details', 'We’ll share current models, sizes, colors and prices.'], ['Confirm and ship', 'Agree your assortment and delivery arrangements with our team.']] },
    ar: { eyebrow: 'خطوات بسيطة لشراكة ناجحة', title: <>من أول نظرة<br /><em>إلى أول شحنة.</em></>, intro: 'تجربة شخصية وواضحة صُممت لتلبية احتياجات مشتري الجملة.', cta: 'ابدأوا التواصل', steps: [['تصفحوا مجموعاتنا', 'اكتشفوا الموديلات في معاينة الكتالوج.'], ['تواصلوا معنا عبر واتساب', 'أخبرونا عن متجركم وما تبحثون عنه.'], ['استلموا تفاصيل الجملة', 'نشارككم الموديلات والمقاسات والألوان والأسعار الحالية.'], ['اعتمدوا الطلب والشحن', 'نسقوا التشكيلة وترتيبات التسليم مع فريقنا.']] },
    ru: { eyebrow: 'Простой путь к сотрудничеству', title: <>От первого знакомства<br /><em>до первой поставки.</em></>, intro: 'Персональный и понятный процесс для оптовых покупателей.', cta: 'Начать общение', steps: [['Изучите коллекции', 'Посмотрите модели в предварительном каталоге.'], ['Напишите нам в WhatsApp', 'Расскажите о своём магазине и пожеланиях.'], ['Получите оптовую информацию', 'Мы сообщим актуальные модели, размеры, цвета и цены.'], ['Согласуйте поставку', 'Обсудите ассортимент и доставку с нашей командой.']] },
  }[language]
  return (
    <section className="section process-section" id="how-it-works">
      <div className="page-width process-layout">
        <div className="section-heading"><p className="eyebrow"><span className="eyebrow-line" /> {copy.eyebrow}</p><h2>{copy.title}</h2><p className="section-intro">{copy.intro}</p><WhatsAppButton className="process-cta">{copy.cta}</WhatsAppButton></div>
        <div className="process-steps">{copy.steps.map(([title, text], index) => <div className="process-step" key={title}><span className="step-number" dir="ltr">0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight className="step-arrow" size={18} /></div>)}</div>
      </div>
    </section>
  )
}

export function Wholesale() {
  const language = useSiteLanguage()
  const copy = {
    en: { alt: 'A child wearing a timeless neutral outfit', eyebrow: 'For wholesale buyers', title: <>Your next collection<br /><em>starts with a hello.</em></>, text: 'Looking for a reliable children’s clothing supplier from Turkey? Contact us for our latest wholesale collections, available sizes, colors, prices and shipping information.', cta: 'Request the wholesale catalog', note: 'For boutiques · retailers · importers · distributors' },
    ar: { alt: 'طفل يرتدي زياً أنيقاً بألوان هادئة', eyebrow: 'لمشتري الجملة', title: <>مجموعتكم القادمة<br /><em>تبدأ برسالة.</em></>, text: 'تبحثون عن مورد موثوق لملابس الأطفال من تركيا؟ تواصلوا معنا للاطلاع على أحدث مجموعات الجملة والمقاسات والألوان والأسعار ومعلومات الشحن.', cta: 'اطلبوا كتالوج الجملة', note: 'للبوتيكات · المتاجر · المستوردين · الموزعين' },
    ru: { alt: 'Ребёнок в лаконичном наряде нейтральных оттенков', eyebrow: 'Для оптовых покупателей', title: <>Ваша следующая коллекция<br /><em>начинается с разговора.</em></>, text: 'Ищете надёжного поставщика детской одежды из Турции? Свяжитесь с нами, чтобы узнать о новых оптовых коллекциях, размерах, цветах, ценах и доставке.', cta: 'Запросить оптовый каталог', note: 'Для бутиков · магазинов · импортёров · дистрибьюторов' },
  }[language]
  return (
    <section className="wholesale-section">
      <div className="wholesale-image" role="img" aria-label={copy.alt} />
      <div className="wholesale-overlay" />
      <div className="page-width wholesale-content"><p className="eyebrow light-eyebrow"><span className="eyebrow-line" /> {copy.eyebrow}</p><h2>{copy.title}</h2><p>{copy.text}</p><WhatsAppButton>{copy.cta} <ArrowUpRight size={16} /></WhatsAppButton><span className="wholesale-footnote">{copy.note}</span></div>
    </section>
  )
}

export function Social() {
  const language = useSiteLanguage()
  const copy = {
    en: { eyebrow: 'Stay in the loop', title: <>Follow along<br /><em>with Minik.</em></>, intro: 'Follow us for new collections, thoughtful details and the latest arrivals.', instagram: 'New collections & latest arrivals', facebook: 'Follow our brand updates', whatsapp: 'Talk to our wholesale team' },
    ar: { eyebrow: 'ابقوا على اطلاع', title: <>تابعوا جديدنا<br /><em>مع مينيك.</em></>, intro: 'تابعونا للاطلاع على المجموعات الجديدة والتفاصيل المدروسة وأحدث الموديلات.', instagram: 'المجموعات الجديدة وأحدث الموديلات', facebook: 'تابعوا أخبار علامتنا التجارية', whatsapp: 'تواصلوا مع فريق الجملة' },
    ru: { eyebrow: 'Будьте в курсе', title: <>Следите за новостями<br /><em>вместе с Minik.</em></>, intro: 'Следите за новыми коллекциями, продуманными деталями и последними поступлениями.', instagram: 'Новые коллекции и поступления', facebook: 'Новости нашего бренда', whatsapp: 'Связаться с оптовой командой' },
  }[language]
  const channels: Array<{ name: string; handle: string; href: string; icon: 'instagram' | 'facebook' | 'whatsapp' }> = [
    ...(business.instagramUrl ? [{ name: 'Instagram', handle: copy.instagram, href: business.instagramUrl, icon: 'instagram' as const }] : []),
    ...(business.facebookUrl ? [{ name: 'Facebook', handle: copy.facebook, href: business.facebookUrl, icon: 'facebook' as const }] : []),
    { name: 'WhatsApp', handle: copy.whatsapp, href: whatsappUrl(), icon: 'whatsapp' },
  ]
  return (
    <section className="section social-section" id="social">
      <div className="page-width social-layout"><div className="section-heading"><p className="eyebrow"><span className="eyebrow-line" /> {copy.eyebrow}</p><h2>{copy.title}</h2><p className="section-intro">{copy.intro}</p></div>
        <div className="social-grid">{channels.map(({ name, handle, href, icon }) => <a className={`social-card ${icon === 'whatsapp' ? 'whatsapp' : ''}`} href={href} key={name} target="_blank" rel="noopener noreferrer" aria-label={`${name}: ${handle}`} title={handle}><span className="social-icon">{icon === 'whatsapp' ? <MessageCircle size={20} strokeWidth={1.7} /> : <SocialIcon network={icon} size={20} />}</span><span><strong>{name}</strong><small>{handle}</small></span><ArrowUpRight className="social-arrow" size={17} /></a>)}</div>
      </div>
    </section>
  )
}

export function Contact() {
  const language = useSiteLanguage()
  const copy = {
    en: { eyebrow: 'Let’s talk business', title: <>Good things<br /><em>begin here.</em></>, intro: 'Use our smart wholesale inquiry to share your requirements, or contact us directly. Follow our social channels for new collections and model updates.', phone: 'Phone', email: 'Email', location: 'Location', hours: 'Working hours', facebook: 'Follow our business', instagram: 'See new collections', buyers: 'Wholesale buyers', cardTitle: 'Share exactly what you need.', cardText: 'Choose models, sizes, quantities and order requirements in your preferred language.', cta: 'Start a wholesale inquiry' },
    ar: { eyebrow: 'لنتحدث عن أعمالكم', title: <>بدايتكم الموفقة<br /><em>من هنا.</em></>, intro: 'استخدموا نموذج الاستفسار الذكي للجملة لمشاركة متطلباتكم، أو تواصلوا معنا مباشرة. تابعوا قنواتنا لمعرفة أحدث المجموعات والموديلات.', phone: 'الهاتف', email: 'البريد الإلكتروني', location: 'الموقع', hours: 'ساعات العمل', facebook: 'تابعوا أخبارنا', instagram: 'شاهدوا المجموعات الجديدة', buyers: 'لمشتري الجملة', cardTitle: 'أخبرونا بما تحتاجونه بالتحديد.', cardText: 'اختاروا الموديلات والمقاسات والكميات ومتطلبات الطلب باللغة التي تفضلونها.', cta: 'ابدأوا استفسار الجملة' },
    ru: { eyebrow: 'Давайте обсудим сотрудничество', title: <>Хорошее начинается<br /><em>здесь.</em></>, intro: 'Расскажите о потребностях в оптовой форме или свяжитесь с нами напрямую. Следите за новостями о коллекциях и моделях в наших соцсетях.', phone: 'Телефон', email: 'Электронная почта', location: 'Адрес', hours: 'Часы работы', facebook: 'Новости компании', instagram: 'Новые коллекции', buyers: 'Оптовым покупателям', cardTitle: 'Расскажите, что именно вам нужно.', cardText: 'Выберите модели, размеры, количество и параметры заказа на удобном языке.', cta: 'Оформить оптовый запрос' },
  }[language]
  return (
    <section className="section contact-section" id="contact">
      <div className="page-width contact-layout">
        <div className="contact-copy"><p className="eyebrow"><span className="eyebrow-line" /> {copy.eyebrow}</p><h2>{copy.title}</h2><p className="section-intro">{copy.intro}</p>
          <div className="contact-details">
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><span className="contact-icon"><MessageCircle size={18} /></span><span><small>WhatsApp</small><strong dir="ltr">{business.phone}</strong></span><ArrowUpRight size={15} /></a>
            <a href={`tel:${business.phone.replace(/[^+\d]/g, '')}`}><span className="contact-icon"><Phone size={18} /></span><span><small>{copy.phone}</small><strong dir="ltr">{business.phone}</strong></span><ArrowUpRight size={15} /></a>
            <a href={`mailto:${business.email}`}><span className="contact-icon"><Mail size={18} /></span><span><small>{copy.email}</small><strong dir="ltr">{business.email}</strong></span><ArrowUpRight size={15} /></a>
            {business.facebookUrl && <a href={business.facebookUrl} target="_blank" rel="noopener noreferrer"><span className="contact-icon"><SocialIcon network="facebook" size={18} /></span><span><small>Facebook</small><strong>{copy.facebook}</strong></span><ArrowUpRight size={15} /></a>}
            {business.instagramUrl && <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer"><span className="contact-icon"><SocialIcon network="instagram" size={18} /></span><span><small>Instagram</small><strong>{copy.instagram}</strong></span><ArrowUpRight size={15} /></a>}
            <div className="contact-static"><span className="contact-icon"><MapPin size={18} /></span><span><small>{copy.location}</small><strong>{language === 'ar' ? 'إسطنبول، تركيا' : language === 'ru' ? 'Стамбул, Турция' : business.location}</strong></span></div>
            <div className="contact-static"><span className="contact-icon"><Clock3 size={18} /></span><span><small>{copy.hours}</small><strong dir="ltr">{language === 'ar' ? 'الاثنين – الجمعة، 09:00 – 18:00 (TRT)' : language === 'ru' ? 'Понедельник – пятница, 09:00 – 18:00 (TRT)' : business.workingHours}</strong></span></div>
          </div>
        </div>
        <div className="contact-inquiry-card"><p className="eyebrow"><span className="eyebrow-line" /> {copy.buyers}</p><h3>{copy.cardTitle}</h3><p>{copy.cardText}</p><a className="button button-primary" href="#inquiry">{copy.cta} <ArrowRight size={16} /></a></div>
      </div>
    </section>
  )
}

export function Footer() {
  const language = useSiteLanguage()
  const footerCopy = {
    en: { explore: 'Explore', about: 'About us', collections: 'Collections', why: 'Why choose us', how: 'How we work', contact: 'Contact', getInTouch: 'Get in touch', whatsapp: 'WhatsApp', call: 'Call our team', email: 'Email us', follow: 'Follow along', followText: 'Follow for new collections and model updates.', backToTop: 'Back to top', description: business.description, brandTag: 'WHOLESALE · ISTANBUL', rights: 'All rights reserved.', line: 'Wholesale children’s fashion · Istanbul, Türkiye', whatsappTitle: 'Contact via WhatsApp' },
    ar: { explore: 'استكشف', about: 'من نحن', collections: 'المجموعة', why: 'لماذا نحن', how: 'كيف نعمل', contact: 'تواصل معنا', getInTouch: 'تواصل معنا', whatsapp: 'واتساب', call: 'اتصلوا بفريقنا', email: 'راسلونا', follow: 'تابعونا', followText: 'تابعوا أحدث المجموعات والموديلات.', backToTop: 'العودة إلى الأعلى', description: 'شريككم في تجارة ملابس الأطفال بالجملة من إسطنبول، بتصاميم مدروسة وخدمة موثوقة للمتاجر والبوتيكات والموزعين حول العالم.', brandTag: 'ملابس أطفال بالجملة · إسطنبول', rights: 'جميع الحقوق محفوظة.', line: 'أزياء أطفال بالجملة · إسطنبول، تركيا', whatsappTitle: 'تواصلوا معنا عبر واتساب' },
    ru: { explore: 'Разделы', about: 'О нас', collections: 'Коллекции', why: 'Почему мы', how: 'Как мы работаем', contact: 'Контакты', getInTouch: 'Связаться с нами', whatsapp: 'WhatsApp', call: 'Позвонить нашей команде', email: 'Написать нам', follow: 'Мы в соцсетях', followText: 'Следите за новыми коллекциями и моделями.', backToTop: 'Наверх', description: 'Ваш оптовый партнёр по детской одежде в Стамбуле: продуманный дизайн и надёжный сервис для бутиков, магазинов и дистрибьюторов по всему миру.', brandTag: 'ОПТ · СТАМБУЛ', rights: 'Все права защищены.', line: 'Детская одежда оптом · Стамбул, Турция', whatsappTitle: 'Связаться через WhatsApp' },
  }
  const t = footerCopy[language]

  return (
    <footer className="site-footer" dir={language === 'ar' ? 'rtl' : 'ltr'}><div className="page-width footer-main">
      <div className="footer-brand"><a className="brand-mark footer-mark" href={sectionHref('home')} aria-label={`${business.name} ${language === 'ar' ? 'الرئيسية' : language === 'ru' ? 'Главная' : 'home'}`}><span className="brand-symbol">m<span>.</span></span><span className="brand-name">{business.logo}<small>{t.brandTag}</small></span></a><p>{t.description}</p><a className="footer-email" href={`mailto:${business.email}`} dir="ltr">{business.email} <ArrowUpRight size={14} /></a></div>
      <div className="footer-links"><h3>{t.explore}</h3><a href={sectionHref('about')}>{t.about}</a><a href={sectionHref('collections')}>{t.collections}</a><a href={sectionHref('why-us')}>{t.why}</a><a href={sectionHref('how-it-works')}>{t.how}</a><a href={sectionHref('contact')}>{t.contact}</a></div>
      <div className="footer-links"><h3>{t.getInTouch}</h3><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{t.whatsapp} <ArrowUpRight size={13} /></a><a href={`tel:${business.phone.replace(/[^+\d]/g, '')}`} dir="ltr">{t.call}</a><a href={`mailto:${business.email}`}>{t.email}</a><span><MapPin size={13} /> {language === 'ar' ? 'إسطنبول، تركيا' : language === 'ru' ? 'Стамбул, Турция' : business.location}</span></div>
      <div className="footer-social"><h3>{t.follow}</h3><p>{t.followText}</p><div>{business.instagramUrl && <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"><SocialIcon network="instagram" size={17} /></a>}{business.facebookUrl && <a href={business.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"><SocialIcon network="facebook" size={17} /></a>}<a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label={t.whatsappTitle} title={t.whatsappTitle}><MessageCircle size={17} /></a></div></div>
    </div><div className="page-width footer-bottom"><span>© {new Date().getFullYear()} {business.name}. {t.rights}</span><span>{t.line}</span><a href={sectionHref('home')}>{t.backToTop} ↑</a></div></footer>
  )
}