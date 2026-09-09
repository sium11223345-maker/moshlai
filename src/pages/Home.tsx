import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'
import type { Product, SiteSettings } from '../lib/types'
import ProductCard from '../components/ProductCard'

export default function Home({ products, settings, add, remove, qtyOf }: { products: Product[]; settings: SiteSettings; add: (p:Product)=>void; remove:(id:string)=>void; qtyOf:(id:string)=>number }) {
  const hero = settings.hero_image_url || '/hero-spices.jpg'
  return <div>
    <section className="relative min-h-[78vh] overflow-hidden" style={{backgroundImage:`url(${hero})`,backgroundSize:'cover',backgroundPosition:'center'}}>
      <div className="hero-overlay absolute inset-0" />
      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 py-24 md:px-6">
        <div className="max-w-2xl text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur"> <Star size={15} fill="currentColor"/> Premium spices for everyday cooking</div>
          <h1 className="text-5xl font-black leading-tight md:text-7xl">{settings.hero_title}</h1>
          <p className="mt-5 max-w-xl text-lg text-white/85 md:text-xl">{settings.hero_subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link to="/products" className="inline-flex items-center rounded-xl bg-[#7f1d1d] px-5 py-3 font-bold !text-white hover:bg-[#991b1b]">
  Shop Products <ArrowRight className="ml-2" size={17} />
</Link><Link to="/about" className="rounded-xl border border-white/40 bg-white/10 px-5 py-3 font-bold backdrop-blur">About Moshlai</Link></div>
        </div>
      </div>
    </section>
    <section id="products" className="mx-auto max-w-7xl px-4 py-16 md:px-6"><div className="mb-8 flex items-end justify-between"><div><div className="text-sm font-bold uppercase tracking-[.2em] text-[#a75a42]">Our collection</div><h2 className="mt-2 text-3xl font-black text-white md:text-4xl">Popular products</h2></div><Link to="/products" className="rounded-xl bg-white/90 px-4 py-2 text-sm font-bold text-[#7f1d1d]">View all</Link></div>{products.length===0 ? <div className="glass rounded-2xl p-8 text-center">No products yet. Add your first product from Admin.</div> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.slice(0,6).map(p=><ProductCard key={p.id} product={p} add={add} remove={remove} qty={qtyOf(p.id)}/>)}</div>}</section>
    <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6"><div className="glass rounded-3xl p-8 md:p-12"><h2 className="text-3xl font-black text-[#7f1d1d]">রান্নায় একটু বেশি স্বাদ, একটু বেশি যত্ন।</h2><p className="mt-3 max-w-2xl text-[#644e46]">মশলাই-এর মশলা বেছে নেওয়া হয় রঙ, ঘ্রাণ ও Authentic taste-এর ভারসাম্য ধরে রাখার জন্য।</p></div></section>
  </div>
}
