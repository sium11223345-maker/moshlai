import { ShoppingCart, Plus, Minus } from 'lucide-react'
import type { Product } from '../lib/types'

export default function ProductCard({ product, add, remove, qty }: { product: Product; add: (p: Product) => void; remove: (id: string) => void; qty: number }) {
  return <div className="card flex flex-col">
    <div className="aspect-square bg-[#f5e7db]"><img src={product.image_url || '/moshlai-chilli-demo.png'} alt={product.name} className="h-full w-full object-contain p-4" /></div>
    <div className="flex flex-1 flex-col p-4">
      <div className="text-lg font-extrabold">{product.name}</div>
      <div className="mt-1 text-sm text-[#7f6861]">{product.unit}</div>
      {product.description && <p className="mt-2 line-clamp-2 text-sm text-[#6a5149]">{product.description}</p>}
      <div className="mt-auto flex items-center justify-between pt-5">
        <div className="text-xl font-black text-[#7f1d1d]">৳{Number(product.price).toFixed(0)}</div>
        {qty === 0 ? <button onClick={()=>add(product)} className="btn-primary flex items-center gap-2"><ShoppingCart size={17}/>Add</button> : <div className="flex items-center gap-2 rounded-xl bg-[#f3e8df] px-2 py-1"><button className="p-2" onClick={()=>remove(product.id)}><Minus size={16}/></button><span className="font-bold">{qty}</span><button className="p-2" onClick={()=>add(product)}><Plus size={16}/></button></div>}
      </div>
    </div>
  </div>
}
