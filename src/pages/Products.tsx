import type { Product } from '../lib/types'
import ProductCard from '../components/ProductCard'

export default function Products({ products, add, remove, qtyOf }: { products: Product[]; add:(p:Product)=>void; remove:(id:string)=>void; qtyOf:(id:string)=>number }) {
  return <main className="mx-auto max-w-7xl px-4 py-14 md:px-6"><div className="glass rounded-3xl p-6 md:p-10"><div className="text-sm font-bold uppercase tracking-[.2em] text-[#a75a42]">Shop</div><h1 className="mt-2 text-4xl font-black text-[#7f1d1d]">সব মশলা একসাথে</h1><p className="mt-2 max-w-2xl text-[#6a5149]">যেটা পছন্দ হয়েছে cart-এ add করুন, তারপর WhatsApp-এ এক ক্লিকে order করুন।</p></div><div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.map(p=><ProductCard key={p.id} product={p} add={add} remove={remove} qty={qtyOf(p.id)}/>)}</div></main>
}
