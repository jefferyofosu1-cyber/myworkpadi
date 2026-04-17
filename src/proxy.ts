import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip auth checks if Supabase is not configured (e.g. local dev without credentials)
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.startsWith("your_")) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public routes that share a protected prefix — must be whitelisted first
  const publicPaths = ["/tasker/apply"];
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return supabaseResponse;
  }

  // Protected routes access control
  const isCustomerRoute = pathname.startsWith("/customer");
  const isTaskerRoute = pathname.startsWith("/tasker");
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtected = isCustomerRoute || isTaskerRoute || isAdminRoute;

  if (isProtected) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    // Role Enforcement (RBAC)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;

    // Check if the user has permission to access the requested route
    const hasAccess = 
      (isCustomerRoute && role === "customer") ||
      (isTaskerRoute && role === "tasker") ||
      (isAdminRoute && role === "admin");

    if (!hasAccess) {
      // Redirect to their respective dashboard if they try to access another role's area
      const url = request.nextUrl.clone();
      if (role === "admin") url.pathname = "/admin/dashboard";
      else if (role === "tasker") url.pathname = "/tasker/dashboard";
      else url.pathname = "/customer/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  const authPages = ["/login", "/signup", "/forgot-password"];
  if (user && authPages.includes(pathname)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;
    const url = request.nextUrl.clone();
    if (role === "admin") url.pathname = "/admin/dashboard";
    else if (role === "tasker") url.pathname = "/tasker/dashboard";
    else url.pathname = "/customer/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
