import { useCartStore } from '@/store/cart.store'
import type { Product } from '@/types'

export const useCart = () => {
  const { items, total, addItem, removeItem, updateQuantity, clearCart, getCartTotal } = useCartStore()

  const addToCart = (product: Product, quantity: number = 1) => {
    addItem(product, quantity)
  }

  const removeFromCart = (productId: string) => {
    removeItem(productId)
  }

  const updateItemQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity)
  }

  const checkout = () => {
    const order = {
      items,
      total: getCartTotal(),
    }
    return order
  }

  return {
    items,
    total,
    itemCount: items.length,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    checkout,
  }
}
