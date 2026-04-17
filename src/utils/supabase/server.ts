import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  
  if (!url || url.startsWith("your_")) {
    console.warn("[Supabase] Missing or placeholder env vars. Auth disabled.");
    // Return a dummy client to avoid crashing the server component
    return {
      auth: { getUser: async () => ({ data: { user: null } }) },
      from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: null }) }), order: () => ({ limit: async () => ({ data: [] }) }), head: true, count: "exact" }) })
    } as any;
  }

  return createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component – cookies can only be set in middleware or Route Handlers
          }
        },
      },
    }
  );
}
