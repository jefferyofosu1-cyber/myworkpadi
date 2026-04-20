# Supabase Integration Cheat Sheet for TaskGH

Quick reference for integrating Supabase into TaskGH Next.js app.

---

## 📦 Installation

```bash
npm install @supabase/supabase-js
```

---

## 🔧 Initialize Supabase Client

### `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations (use service role key)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

---

## 🔐 Authentication

### Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@taskgh.com',
  password: 'SecurePassword123!',
  options: {
    data: {
      full_name: 'John Doe',
      user_type: 'customer' // customer or tasker
    }
  }
})
```

### Login

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@taskgh.com',
  password: 'SecurePassword123!'
})

const user = data.user
const session = data.session
```

### Get Current User

```typescript
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  // Not logged in
}
```

### Logout

```typescript
await supabase.auth.signOut()
```

### Listen to Auth State

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // User logged in
  } else if (event === 'SIGNED_OUT') {
    // User logged out
  }
})
```

---

## 💾 Database CRUD

### Create

```typescript
const { data, error } = await supabase
  .from('bookings')
  .insert([
    {
      customer_id: userId,
      tasker_id: taskerId,
      service_category: 'cleaning',
      status: 'pending'
    }
  ])
  .select()
```

### Read (Single)

```typescript
const { data: booking, error } = await supabase
  .from('bookings')
  .select()
  .eq('id', bookingId)
  .single()
```

### Read (Multiple)

```typescript
const { data: bookings, error } = await supabase
  .from('bookings')
  .select()
  .eq('customer_id', userId)
  .order('created_at', { ascending: false })
  .limit(10)
```

### Read with Relations

```typescript
const { data, error } = await supabase
  .from('bookings')
  .select(`
    *,
    customer:customers(id, full_name, email),
    tasker:taskers(id, full_name, rating)
  `)
  .eq('id', bookingId)
```

### Update

```typescript
const { data, error } = await supabase
  .from('bookings')
  .update({ status: 'completed' })
  .eq('id', bookingId)
```

### Delete

```typescript
const { error } = await supabase
  .from('bookings')
  .delete()
  .eq('id', bookingId)
```

### Count

```typescript
const { count, error } = await supabase
  .from('bookings')
  .select('*', { count: 'exact', head: true })
```

---

## 🔍 Advanced Queries

### Filter (WHERE clause)

```typescript
// Single condition
.eq('status', 'pending')           // WHERE status = 'pending'
.neq('status', 'cancelled')        // WHERE status != 'cancelled'
.gt('price', 100)                  // WHERE price > 100
.gte('price', 100)                 // WHERE price >= 100
.lt('price', 1000)                 // WHERE price < 1000
.lte('price', 1000)                // WHERE price <= 1000
.like('email', '%@taskgh.com')     // LIKE search
.ilike('name', '%john%')           // Case-insensitive LIKE
.in('status', ['pending', 'active']) // IN clause
.is('completed_at', null)           // IS NULL

// Multiple conditions
.eq('customer_id', userId)
.eq('status', 'pending')
```

### Full-Text Search

```typescript
const { data } = await supabase
  .from('services')
  .select()
  .textSearch('description', 'cleaning apartment')
```

### Pagination

```typescript
const limit = 10
const page = 1
const from = (page - 1) * limit
const to = from + limit - 1

const { data, count } = await supabase
  .from('bookings')
  .select('*', { count: 'exact' })
  .range(from, to)
```

### Sorting

```typescript
.order('created_at', { ascending: false })     // Newest first
.order('rating', { ascending: false })         // Highest rating first
.order('distance', { ascending: true })        // Closest first
```

---

## 💾 File Storage

### Upload File

```typescript
const file = event.target.files[0]
const fileName = `${userId}/${new Date().getTime()}`

const { data, error } = await supabase.storage
  .from('avatars')
  .upload(fileName, file, {
    cacheControl: '3600',
    upsert: false
  })
```

### Get Public URL

```typescript
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/profile.jpg`)

console.log(data.publicUrl)
```

### Get Signed URL (Private)

```typescript
const { data, error } = await supabase.storage
  .from('documents')
  .createSignedUrl(`${userId}/invoice.pdf`, 3600)

// Send signedUrl to user (valid for 1 hour)
```

### Delete File

```typescript
const { error } = await supabase.storage
  .from('avatars')
  .remove([`${userId}/profile.jpg`])
```

---

## 🔄 Real-Time Subscriptions

### Listen for Changes

```typescript
supabase
  .channel('bookings_changes')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'bookings',
      filter: `customer_id=eq.${userId}`
    },
    (payload) => {
      console.log('Change received!', payload.eventType, payload.new)
    }
  )
  .subscribe()
```

### Presence (Online Status)

```typescript
supabase.channel('online-users')
  .on('presence', { event: 'sync' }, () => {
    const presenceState = supabase.channel('online-users').presenceState()
    console.log('Online taskers:', presenceState)
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await supabase.channel('online-users').track({
        user_id: userId,
        online_at: new Date()
      })
    }
  })
```

---

## 🛡️ Row-Level Security

### Check Auth Context

```typescript
// In stored procedures or triggers
SELECT auth.uid() -- Current user ID
SELECT auth.jwt() -- JWT payload
SELECT auth.role() -- authenticated or anon
```

### Force RLS Policy

```typescript
// After RLS is enabled, queries are filtered automatically
// Only data user has permission for is returned
const { data } = await supabase.from('users').select()
// Returns only current user's data (RLS policy applies)
```

---

## 🚀 Next.js Integration

### Server-Side (Route Handler)

```typescript
// app/api/bookings/route.ts
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: Request) {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select()
  
  return Response.json(data)
}
```

### Client-Side (React Component)

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function BookingsList() {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select()
      setBookings(data)
    }

    fetchBookings()
  }, [])

  return (
    <ul>
      {bookings.map(b => (
        <li key={b.id}>{b.status}</li>
      ))}
    </ul>
  )
}
```

### Using Hooks (Recommended)

```bash
npm install @supabase/auth-helpers-nextjs
```

```typescript
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

export default function Profile() {
  const supabase = useSupabaseClient()
  const user = useUser()

  return <div>Hello {user?.email}</div>
}
```

---

## ⚠️ Error Handling

```typescript
try {
  const { data, error } = await supabase
    .from('bookings')
    .select()
  
  if (error) {
    throw error
  }
  
  return data
} catch (error) {
  console.error('Query failed:', error.message)
  // Handle error
}
```

---

## 📊 Common Patterns

### Fetch Bookings for Current User

```typescript
const { data: bookings } = await supabase
  .from('bookings')
  .select(`
    *,
    tasker:taskers(id, full_name, rating)
  `)
  .eq('customer_id', user.id)
  .order('created_at', { ascending: false })
```

### Update User Profile

```typescript
const { error } = await supabase
  .from('customers')
  .update({
    full_name,
    phone,
    bio
  })
  .eq('id', user.id)
```

### Create Booking & Update Tasker

```typescript
// Use transactions for consistency
const { data: booking } = await supabase
  .from('bookings')
  .insert([{ customer_id, tasker_id, status: 'pending' }])
  .select()

await supabase
  .from('taskers')
  .update({ active_bookings: activeBookings + 1 })
  .eq('id', tasker_id)
```

---

## 🔗 TypeScript Support

Generate types from your database:

```bash
supabase gen types typescript > src/types/supabase.ts
```

Then use in code:

```typescript
import { Database } from '@/types/supabase'

type Booking = Database['public']['Tables']['bookings']['Row']
```

---

## 📚 Documentation Links

- **Supabase Docs**: https://supabase.com/docs
- **JS Client API**: https://supabase.com/docs/reference/javascript/introduction
- **Auth**: https://supabase.com/docs/guides/auth
- **Database**: https://supabase.com/docs/guides/database
- **Storage**: https://supabase.com/docs/guides/storage
- **Realtime**: https://supabase.com/docs/guides/realtime
- **RLS**: https://supabase.com/docs/guides/auth/row-level-security

---

## 🎯 Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check ANON_KEY, verify RLS policies |
| 403 Forbidden | RLS policy reject, check user permissions |
| 404 Not Found | Table doesn't exist, check schema |
| No real-time updates | Enable realtime on table: `ALTER TABLE public.tablename REPLICA IDENTITY FULL;` |
| Slow queries | Add indexes on filtered/joined columns |

---

**Reference**: Supabase v2 | Last Updated: April 2026

