import { createContext } from 'react'
import type { CartIssue, CartLine } from './cartModel'

export type CartContextValue = {
  lines: CartLine[]
  pieceCount: number
  restorationIssues: CartIssue[]
  storageUnavailable: boolean
  addLine: (line: CartLine) => void
  updateLine: (line: CartLine) => void
  removeLine: (modelCode: string, color: string) => void
  clearCart: () => void
  dismissRestorationIssues: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
