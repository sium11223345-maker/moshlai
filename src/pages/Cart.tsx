import { Trash2, ShoppingBag } from 'lucide-react'
import type { Product } from '../lib/types'
import type { CartLine } from '../lib/whatsapp'
import { buildWhatsAppUrl, cartTotal } from '../lib/whatsapp'

export default function Cart({cart, add, removeAll, whatsapp}: {cart:CartLine[]; add:(p:Product)=>void; removeAll:(id:string)=>void; whatsapp:string}) {
 const total=cartTotal(cart)
 return <main className="mx-auto max-w-4xl px-4 py-14 md:px-6"><div className="glass rounded-3xl p-6 md:p-10"><div className="flex items-center gap-3"><ShoppingBag className="text-[#7f1d1d]"/><h1 className="text-3xl font-black text-[#7f1d1d]">Your Cart</h1></div>{cart.length===0?<div className="py-14 text-center text-[#6a5149]">Cart is empty.</div>:<><div className="mt-8 space-y-3">{cart.map(l=><div key={l.product.id} className="flex items-center gap-4 rounded-2xl bg-white p-4"><img src={l.product.image_url||'/moshlai-chilli-demo.png'} className="h-16 w-16 rounded-xl object-cover"/><div className="flex-1"><div className="font-bold">{l.product.name}</div><div className="text-sm text-[#7a665d]">{l.product.unit} × {l.qty}</div></div><div className="font-black text-[#7f1d1d]">৳{(Number(l.product.price)*l.qty).toFixed(0)}</div><button onClick={()=>removeAll(l.product.id)} className="rounded-xl p-2 hover:bg-[#f5e7db]"><Trash2 size={18}/></button></div>)}</div><div className="mt-8 flex flex-col gap-4 rounded-2xl bg-white p-5 md:flex-row md:items-center md:justify-between"><div className="text-2xl font-black">Total: <span className="text-[#7f1d1d]">৳{total.toFixed(0)}</span></div><a target="_blank" href={buildWhatsAppUrl(whatsapp,cart)} className="btn-primary text-center">Order Now on WhatsApp</a></div></>}</div></main>
}
