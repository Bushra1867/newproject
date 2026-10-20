import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { products } from '../data/products'
import { CART_STORAGE_KEY, type CartLine, getCartQuantity, parseCart } from './cartModel'
import { CartContext, type CartContextValue } from './CartStore'

function restoreCart() {
  try {
    const value = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!value) return { lines: [] as CartLine[], issues: [], storageUnavailable: false }
    const parsed = parseCart(value, products)
    return { lines: parsed.validLines, issues: parsed.issues, storageUnavailable: false }
  } catch {
    return { lines: [] as CartLine[], issues: [], storageUnavailable: true }
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [restored] = useState(restoreCart)
  const [lines, setLines] = useState(restored.lines)
  const [restorationIssues, setRestorationIssues] = useState(restored.issues)
  const [storageUnavailable, setStorageUnavailable] = useState(restored.storageUnavailable)
  const pieceCount = useMemo(() => getCartQuantity(lines), [lines])

  useEffect(() => {
    const updateStorageStatus = (event: Event) => {
      setStorageUnavailable((event as CustomEvent<boolean>).detail)
    }
    window.addEventListener('cart-storage-status', updateStorageStatus)
    return () => window.removeEventListener('cart-storage-status', updateStorageStatus)
  }, [])

  useEffect(() => {
    let unavailable = false
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines))
    } catch {
      unavailable = true
    }
    window.dispatchEvent(new CustomEvent('cart-storage-status', { detail: unavailable }))
  }, [lines])

  function addLine(incoming: CartLine) {
    setLines((current) => {
      const existing = current.find((line) => line.modelCode === incoming.modelCode && line.color === incoming.color)
      if (!existing) return [...current, incoming]
      const quantities = { ...existing.quantities }
      for (const [size, quantity] of Object.entries(incoming.quantities)) {
        quantities[size] = (quantities[size] ?? 0) + quantity
      }
      return current.map((line) => line === existing ? { ...line, quantities, notes: incoming.notes || line.notes } : line)
    })
  }

  function updateLine(updated: CartLine) {
    setLines((current) => current.map((line) =>
      line.modelCode === updated.modelCode && line.color === updated.color ? updated : line,
    ))
  }

  function removeLine(modelCode: string, color: string) {
    setLines((current) => current.filter((line) => line.modelCode !== modelCode || line.color !== color))
  }

  function clearCart() {
    setLines([])
  }

  const value: CartContextValue = {
    lines, pieceCount, restorationIssues, storageUnavailable,
    addLine, updateLine, removeLine, clearCart,
    dismissRestorationIssues: () => setRestorationIssues([]),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
