export type Role = 'user' | 'admin' | 'owner'

export type Product = {
  id: string
  name: string
  unit: string
  price: number
  description: string | null
  image_url: string | null
  active: boolean
  created_at?: string
}

export type SiteSettings = {
  id: boolean
  about_title: string
  about_text: string
  contact_phone: string
  contact_whatsapp: string
  contact_address: string
  hero_image_url: string | null
  hero_title: string
  hero_subtitle: string
  facebook_url: string | null
  instagram_url: string | null
}
