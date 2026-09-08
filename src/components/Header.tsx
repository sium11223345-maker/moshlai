import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export default function Header({ session, cartCount }: { session: Session | null; cartCount: number }) {
  const [open, setOpen] = useState(false)
  const logout = async () => { await supabase?.auth.signOut() }
  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-black/45 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="text-2xl font-black tracking-tight">মশলাই</Link>
        <nav className="hidden items-center gap-6 md:flex">
          {['/', '/products', '/about', '/contact'].map((path, i) => {
            const names = ['Home', 'Products', 'About Us', 'Contact Us']
            return <NavLink key={path} to={path} className={({isActive}) => isActive ? 'font-bold text-white' : 'text-white/75 hover:text-white'}>{names[i]}</NavLink>
          })}
          <Link to="/cart" className="relative flex items-center gap-1"><ShoppingBag size={18}/>Cart{cartCount > 0 && <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-[#7f1d1d]">{cartCount}</span>}</Link>
          {session ? <><Link to="/account" title="Account"><User size={19}/></Link><button onClick={logout} title="Logout"><LogOut size={19}/></button></> : <Link to="/login">Login</Link>}
        </nav>
        <button className="md:hidden" onClick={() => setOpen(v => !v)}>{open ? <X/> : <Menu/>}</button>
      </div>
      {open && <div className="border-t border-white/10 bg-black/80 px-4 pb-4 pt-3 md:hidden">
        {['/','/products','/about','/contact','/cart'].map((p, idx) => <Link onClick={()=>setOpen(false)} key={p} to={p} className="block py-2">{['Home','Products','About Us','Contact Us',`Cart (${cartCount})`][idx]}</Link>)}
        {session ? <><Link onClick={()=>setOpen(false)} to="/account" className="block py-2">Account</Link><button onClick={logout} className="block py-2">Logout</button></> : <Link onClick={()=>setOpen(false)} to="/login" className="block py-2">Login</Link>}
      </div>}
    </header>
  )
}
