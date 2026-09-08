import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Missing authorization' }, 401)

    const url = Deno.env.get('SUPABASE_URL')!
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const userClient = createClient(url, anon, { global: { headers: { Authorization: authHeader } } })
    const adminClient = createClient(url, service)

    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) return json({ error: 'Unauthorized' }, 401)
    const { data: caller } = await adminClient.from('profiles').select('role').eq('id', user.id).single()
    if (!caller || !['owner','admin'].includes(caller.role)) return json({ error: 'Admin access required' }, 403)

    const body = await req.json()
    const action = body.action as string

    if (action === 'upsert-user') {
      if (caller.role !== 'owner') return json({ error: 'Only owner can manage passwords' }, 403)
      const email = String(body.email || '').trim().toLowerCase()
      const password = String(body.password || '')
      if (!email || password.length < 6) return json({ error: 'Valid email and password (6+ chars) are required.' }, 400)
      const { data: existing } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 })
      const found = existing.users.find(u => u.email?.toLowerCase() === email)
      if (found) {
        const { error } = await adminClient.auth.admin.updateUserById(found.id, { password })
        if (error) return json({ error: error.message }, 400)
        return json({ message: 'Password updated for existing user.' })
      }
      const { error } = await adminClient.auth.admin.createUser({ email, password, email_confirm: true })
      if (error) return json({ error: error.message }, 400)
      return json({ message: 'New user created with the password.' })
    }

    if (action === 'grant-admin' || action === 'revoke-admin') {
      if (caller.role !== 'owner') return json({ error: 'Only owner can grant/revoke admin.' }, 403)
      const targetId = String(body.userId || '')
      if (!targetId) return json({ error: 'userId required' }, 400)
      const { data: target } = await adminClient.from('profiles').select('id,role,full_name').eq('id', targetId).single()
      if (!target) return json({ error: 'User not found' }, 404)
      if (action === 'grant-admin') {
        const { data: another } = await adminClient.from('profiles').select('id').eq('role','admin').maybeSingle()
        if (another && another.id !== targetId) return json({ error: 'There is already one extra admin. Revoke that admin first.' }, 409)
        if (target.role === 'owner') return json({ error: 'Owner is already the highest role.' }, 400)
        const { error } = await adminClient.from('profiles').update({ role:'admin' }).eq('id', targetId)
        if (error) return json({ error: error.message }, 400)
        return json({ message: 'User granted admin access.' })
      }
      if (target.role === 'owner') return json({ error: 'Owner cannot be revoked.' }, 400)
      const { error } = await adminClient.from('profiles').update({ role:'user' }).eq('id', targetId)
      if (error) return json({ error: error.message }, 400)
      return json({ message: 'Admin access revoked.' })
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Unexpected error' }, 500)
  }
})
