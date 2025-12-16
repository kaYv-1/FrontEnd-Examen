import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  total: number
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (product: Product, quantity: number) => {
        const { items } = get()
        const existingItem = items.find((item) => item.producto_id === product.id)

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.producto_id === product.id
                ? { ...item, cantidad: item.cantidad + quantity }
                : item
            ),
          })
        } else {
          set({
            items: [
              ...items,
              {
                producto_id: product.id,
                cantidad: quantity,
                product,
              },
            ],
          })
        }
        get().getCartTotal()
      },

      removeItem: (productId: number) => {
        const { items } = get()
        set({ items: items.filter((item) => item.producto_id !== productId) })
        get().getCartTotal()
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        const { items } = get()
        set({
          items: items.map((item) =>
            item.producto_id === productId ? { ...item, cantidad: quantity } : item
          ),
        })
        get().getCartTotal()
      },

      clearCart: () => {
        set({ items: [], total: 0 })
      },

      getCartTotal: () => {
        const { items } = get()
        const total = items.reduce((sum, item) => {
          const price = item.product?.precio || 0
          return sum + price * item.cantidad
        }, 0)
        set({ total })
        return total
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
