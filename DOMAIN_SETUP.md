# Domain Setup Guide: TaskGH.com

Follow these steps to connect your domain (`taskgh.com`) to your Vercel deployment and configure Supabase for authentication.

## 1. Vercel DNS Settings

Go to your domain registrar (e.g., GoDaddy, Namecheap, Google Domains) and update the DNS records.

### For `taskgh.com` (Root Domain)
- **Type**: `A`
- **Name**: `@`
- **Value**: `76.76.21.21`

### For `www.taskgh.com` (Subdomain)
- **Type**: `CNAME`
- **Name**: `www`
- **Value**: `cname.vercel-dns.com`

---

## 2. Vercel Dashboard Configuration

1. Go to your project on [Vercel](https://vercel.com).
2. Navigate to **Settings** > **Domains**.
3. Add `taskgh.com` (Vercel will suggest adding the `www` redirect automatically).
4. Wait for the SSL certificate to be issued (usually takes a few minutes after DNS propagation).

---

## 3. Supabase Configuration (CRITICAL for Auth)

Since authentication redirects rely on the official URL, you MUST update your Supabase project settings.

1. Go to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project.
3. Go to **Authentication** > **URL Configuration**.
4. Update **Site URL**:
   - Change from `https://myworkpadi.vercel.app` to `https://www.taskgh.com`.
5. Update **Redirect URLs**:
   - Ensure `https://www.taskgh.com/auth/callback` is added to the list.

---

## 4. Troubleshooting
- **DNS Propagation**: It can take anywhere from 1 to 24 hours for DNS changes to propagate globally. You can check the status at [whatsmydns.net](https://www.whatsmydns.net/#A/taskgh.com).
- **SSL Issues**: Vercel will automatically generate an SSL certificate once the DNS is pointing correctly. If it fails, check that there are no conflicting `AAAA` (IPv6) records.
