import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/global.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Auth from './pages/Auth'
import Account from './pages/Account'
import AdminLogin from './pages/AdminLogin'
import Admin from './pages/Admin'
import { supabase } from './lib/supabase'
import type { Product, SiteSettings } from './lib/types'
import type { CartLine } from './lib/whatsapp'

const defaultSettings: SiteSettings = { id:true, about_title:'মশলাই — আমাদের গল্প', about_text:'মশলাই-এর লক্ষ্য হলো ভালো মানের মশলা সহজভাবে মানুষের রান্নাঘরে পৌঁছে দেওয়া।', contact_phone:'+8801XXXXXXXXX', contact_whatsapp:'8801XXXXXXXXX', contact_address:'Bangladesh', hero_image_url:'/hero-spices.jpg', hero_title:'স্বাদের শুরু ভালো মশলায়', hero_subtitle:'Premium spices, সুন্দর রঙ, authentic taste — মশলাই।', facebook_url:'https://facebook.com/', instagram_url:'https://instagram.com/' }

function App(){
 const [products,setProducts]=useState<Product[]>([]); const [settings,setSettings]=useState<SiteSettings>(defaultSettings); const [session,setSession]=useState<any>(null); const [cart,setCart]=useState<CartLine[]>(()=>{try{return JSON.parse(localStorage.getItem('moshlai-cart')||'[]')}catch{return []}})
 const reload=async()=>{ if(!supabase)return; const {data:p}=await supabase.from('products').select('*').eq('active',true).order('created_at',{ascending:false}); if(p)setProducts(p as Product[]); const {data:s}=await supabase.from('site_settings').select('*').eq('id',true).maybeSingle(); if(s)setSettings(s as SiteSettings) }
 useEffect(()=>{supabase?.auth.getSession().then(({data})=>setSession(data.session)); const sub=supabase?.auth.onAuthStateChange((_e,s)=>setSession(s)); reload(); return ()=>{sub?.data.subscription.unsubscribe()}},[])
 useEffect(()=>{localStorage.setItem('moshlai-cart',JSON.stringify(cart))},[cart])
 const add=(p:Product)=>setCart(prev=>{const f=prev.find(x=>x.product.id===p.id); return f?prev.map(x=>x.product.id===p.id?{...x,qty:x.qty+1}:x):[...prev,{product:p,qty:1}]})
 const remove=(id:string)=>setCart(prev=>prev.flatMap(x=>x.product.id===id?(x.qty>1?[{...x,qty:x.qty-1}]:[]):[x]))
 const removeAll=(id:string)=>setCart(prev=>prev.filter(x=>x.product.id!==id))
 const qtyOf=(id:string)=>cart.find(x=>x.product.id===id)?.qty||0
 return <div className="app-shell"><Header session={session} cartCount={cart.reduce((a,b)=>a+b.qty,0)}/><Routes>
   <Route path="/" element={<Home products={products} settings={settings} add={add} remove={remove} qtyOf={qtyOf}/>}/>
   <Route path="/products" element={<Products products={products} add={add} remove={remove} qtyOf={qtyOf}/>}/>
   <Route path="/about" element={<About settings={settings}/>}/><Route path="/contact" element={<Contact settings={settings}/>}/>
   <Route path="/cart" element={<Cart cart={cart} add={add} removeAll={removeAll} whatsapp={settings.contact_whatsapp||import.meta.env.VITE_WHATSAPP_NUMBER}/>}/>
   <Route path="/login" element={<Auth mode="login"/>}/><Route path="/signup" element={<Auth mode="signup"/>}/><Route path="/account" element={<Account/>}/>
   <Route path="/admin-login" element={<AdminLogin/>}/><Route path="/admin" element={<Admin products={products} setProducts={setProducts} settings={settings} reload={reload}/>}/>
 </Routes><Footer facebook={settings.facebook_url||import.meta.env.VITE_FACEBOOK_URL} instagram={settings.instagram_url||import.meta.env.VITE_INSTAGRAM_URL} whatsapp={`https://wa.me/${(settings.contact_whatsapp||import.meta.env.VITE_WHATSAPP_NUMBER).replace(/\D/g,'')}`}/></div>
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>)
