# মশলাই E-commerce — Free Setup Guide

এই projectটি React + Vite + Supabase দিয়ে বানানো। Frontend Netlify-তে এবং database/auth/storage/secure admin action Supabase-এ চালানো হবে। WhatsApp order-এ customer-এর cart summary pre-filled যাবে।

## 1) যা লাগবে

- একটি GitHub account
- একটি Netlify account
- একটি Supabase account
- একটি WhatsApp number

## 2) Supabase Project তৈরি

1. https://supabase.com/ এ গিয়ে New project করুন।
2. Project তৈরি হলে **Project Settings → API** থেকে `Project URL` এবং `anon public key` নিন।
3. Supabase-এর **SQL Editor** খুলে `supabase/schema.sql` পুরোটা paste করে Run করুন।
4. প্রথমে আপনার website account তৈরি করুন `/signup` দিয়ে।
5. তারপর SQL Editor-এ নিচের query চালিয়ে আপনার account-কে owner করুন:

```sql
update public.profiles
set role='owner'
where id=(select id from auth.users where email='YOUR_OWNER_EMAIL');
```

`YOUR_OWNER_EMAIL` আপনার আসল owner email দিয়ে বদলাবেন।

## 3) Supabase Edge Function deploy

Computer-এ Node.js থাকলে terminal-এ:

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy admin-user
```

`YOUR_PROJECT_REF` Supabase project URL-এর অংশ। Deploy হওয়ার পর function URL হবে:

```text
https://YOUR_PROJECT_REF.supabase.co/functions/v1/admin-user
```

এই URL-টি `.env`-এর `VITE_SUPABASE_FUNCTION_URL`-এ বসাতে হবে।

## 4) Local configuration

`.env.example` copy করে `.env` বানান:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_SUPABASE_FUNCTION_URL=https://YOUR_PROJECT.supabase.co/functions/v1/admin-user
VITE_WHATSAPP_NUMBER=8801XXXXXXXXX
VITE_FACEBOOK_URL=https://facebook.com/yourpage
VITE_INSTAGRAM_URL=https://instagram.com/youraccount
VITE_OWNER_EMAIL=owner@example.com
```

WhatsApp number আন্তর্জাতিক format-এ লিখবেন, যেমন `88017XXXXXXXX`; `+`, space বা dash দেবেন না।

## 5) Local test

```bash
npm install
npm run dev
```

তারপর terminal যে local URL দেবে সেটি browser-এ খুলবেন।

## 6) GitHub-এ upload

Project folder GitHub-এ push করুন। তারপর Netlify-তে:

1. **Add new project → Import an existing project**
2. GitHub repo select করুন
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Site settings → Environment variables-এ `.env`-এর 6টি variable বসান
6. Deploy করুন

`public/_redirects` থাকার কারণে React-এর `/products`, `/about`, `/admin-login` ইত্যাদি route refresh হলেও কাজ করবে।

## 7) Admin ব্যবহার

Regular visitor header-এ Dashboard link দেখবে না। Owner/admin সরাসরি:

```text
/admin-login
```

এ ঢুকে login করতে পারবে।

Owner:
- Product add/edit/delete
- Product image upload
- Hero background upload/change
- About/Contact/social links edit
- User password create/reset
- সর্বোচ্চ ১ জন extra admin grant/revoke

Extra admin:
- Product/content management করতে পারবে
- User password বা extra-admin control করতে পারবে না

## 8) যেগুলো পরে আমাকে দিলে আমি content-ready version বানিয়ে দিতে পারি

- WhatsApp number
- Facebook page link
- Instagram link
- সব product-এর নাম, unit, দাম
- প্রতিটি product-এর ছবি
- About Us-এর লেখা
- Contact address/phone
- Logo (থাকলে)

## গুরুত্বপূর্ণ

এই starter-এ আপনার দেওয়া spice photo-কে placeholder hero image এবং Kashmiri chilli image-কে demo product image হিসেবে রাখা হয়েছে। Admin dashboard থেকে এগুলো বদলানো যাবে।
