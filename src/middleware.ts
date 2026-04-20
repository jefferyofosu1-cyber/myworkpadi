import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIp = request.ip || request.headers.get("x-forwarded-for")?.split(",")[0] || "";
  const DEVELOPER_IP = "41.204.44.36";

  // 1. Define Whitelisted Routes (Accessible to everyone)
  const isPublicAsset = 
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api") || 
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|css|js)$/);

  const isWaitlistPage = pathname === "/" || pathname === "/waitlist";

  // 2. Anticipation Mode Logic
  // If not the developer and not a public asset/waitlist page, redirect to home
  if (clientIp !== DEVELOPER_IP && !isPublicAsset && !isWaitlistPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Normal App Logic for Developer or Whitelisted Routes
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes access control
  const isCustomerRoute = pathname.startsWith("/customer");
  const isTaskerRoute = pathname.startsWith("/tasker");
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtected = isCustomerRoute || isTaskerRoute || isAdminRoute;

  if (isProtected) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;
    const hasAccess = 
      (isCustomerRoute && role === "customer") ||
      (isTaskerRoute && role === "tasker") ||
      (isAdminRoute && role === "admin");

    if (!hasAccess) {
      const url = request.nextUrl.clone();
      if (role === "admin") url.pathname = "/admin";
      else if (role === "tasker") url.pathname = "/tasker/dashboard";
      else url.pathname = "/customer/dashboard";
      
      if (url.pathname !== pathname) return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
