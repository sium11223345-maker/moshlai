import type { Product } from './types'

export type CartLine = { product: Product; qty: number }

export function cartTotal(cart: CartLine[]) {
  return cart.reduce((sum, line) => sum + Number(line.product.price) * line.qty, 0)
}

export function buildWhatsAppUrl(number: string, cart: CartLine[]) {
  const total = cartTotal(cart)
  const lines = cart.map(l => `• ${l.product.name} (${l.product.unit}) × ${l.qty} = ৳${(Number(l.product.price) * l.qty).toFixed(0)}`)
  const text = `আসসালামু আলাইকুম, মশলাই থেকে আমি অর্ডার করতে চাই:\n\n${lines.join('\n')}\n\nমোট: ৳${total.toFixed(0)}\n\nঅনুগ্রহ করে অর্ডারটি কনফার্ম করুন।`
  const encoded = encodeURIComponent(text)
  const normalized = number.replace(/\D/g, '')
  return `https://wa.me/${normalized}?text=${encoded}`
}
