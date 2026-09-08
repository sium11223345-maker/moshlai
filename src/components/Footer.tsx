import { Facebook, Instagram, MessageCircle } from 'lucide-react'

export default function Footer({ facebook, instagram, whatsapp }: { facebook: string; instagram: string; whatsapp: string }) {
  return <footer className="bg-black/80 text-white">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
      <div><div className="text-2xl font-black">মশলাই</div><p className="mt-2 text-sm text-white/70">প্রতিদিনের রান্নায় স্বাদ, ঘ্রাণ আর রঙের যত্ন।</p></div>
      <div><div className="font-bold">Quick Links</div><div className="mt-3 space-y-2 text-sm text-white/70"><a href="/#products">Products</a><br/><a href="/about">About Us</a><br/><a href="/contact">Contact Us</a></div></div>
      <div><div className="font-bold">Follow us</div><div className="mt-3 flex gap-4"><a href={facebook} target="_blank"><Facebook/></a><a href={instagram} target="_blank"><Instagram/></a><a href={whatsapp} target="_blank"><MessageCircle/></a></div></div>
    </div>
    <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">© {new Date().getFullYear()} Moshlai. All rights reserved.</div>
  </footer>
}
