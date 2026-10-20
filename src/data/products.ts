export type Product = {
  name: string
  category: string
  modelCode: string
  sizes: string
  colors: string
  image: string
  imageAlt: string
  ageRange?: string
  fabric?: string
  views?: Partial<Record<'front' | 'back' | 'side' | 'detail', string>>
  availableSizes?: string[]
  orderRule?: {
    minimumQuantity?: number
    requireCompleteSizeSeries?: boolean
  }
  badge?: string
}

export const products: Product[] = [
  {
    name: 'Petal Collar Dress', category: "Girls' Dresses", modelCode: 'MK-2418', sizes: '2–8 years', availableSizes: ['2 years', '3 years', '4 years', '5 years', '6 years', '7 years', '8 years'], colors: 'Ivory, rose, sage',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=850&q=82', imageAlt: 'Young child in a soft neutral outfit in natural light', badge: 'New season',
  },
  {
    name: 'Everyday Linen Set', category: "Boys' Clothing", modelCode: 'MK-2306', sizes: '1–7 years', availableSizes: ['1 year', '2 years', '3 years', '4 years', '5 years', '6 years', '7 years'], colors: 'Sand, sky, olive',
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=850&q=82', imageAlt: 'Children wearing relaxed everyday clothing outdoors',
  },
  {
    name: 'Little Occasion Suit', category: 'Occasion Wear', modelCode: 'MK-2512', sizes: '2–10 years', availableSizes: ['2 years', '3 years', '4 years', '5 years', '6 years', '7 years', '8 years', '9 years', '10 years'], colors: 'Cream, navy, blush',
    image: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=850&q=82', imageAlt: 'Child dressed for a special occasion',
  },
  {
    name: 'Holiday Embroidered Set', category: 'Eid & Holiday', modelCode: 'MK-2520', sizes: '2–9 years', availableSizes: ['2 years', '3 years', '4 years', '5 years', '6 years', '7 years', '8 years', '9 years'], colors: 'White, emerald, dusty pink',
    image: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=850&q=82', imageAlt: 'Children in dressed-up festive looks', badge: 'Limited edit',
  },
  {
    name: 'Soft Knit Co-ord', category: 'New Arrivals', modelCode: 'MK-2603', sizes: '6 months–6 years', availableSizes: ['6 months', '1 year', '2 years', '3 years', '4 years', '5 years', '6 years'], colors: 'Oat, lilac, cocoa',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=850&q=82', imageAlt: 'A cozy, light-filled nursery scene with baby clothing', badge: 'Just arrived',
  },
  {
    name: 'Garden Party Dress', category: "Girls' Dresses", modelCode: 'MK-2426', sizes: '2–8 years', availableSizes: ['2 years', '3 years', '4 years', '5 years', '6 years', '7 years', '8 years'], colors: 'Floral, butter, blue',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=850&q=82', imageAlt: 'Child enjoying a sunny day in a playful outfit',
  },
]