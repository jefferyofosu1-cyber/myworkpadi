import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  // Guard: return a stub if not configured to avoid runtime errors in dev
  if (!url || url.startsWith("your_")) {
    console.warn("[Supabase] Missing or placeholder env vars. Auth disabled.");
    return null as any;
  }
  return createBrowserClient(url, key);
}
