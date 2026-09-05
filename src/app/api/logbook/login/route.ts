import { NextResponse } from "next/server";
import { adminKeyOk } from "@/lib/logbook/admin";
import { ADMIN_COOKIE, ADMIN_MAX_AGE } from "@/lib/logbook/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Signing in keeps the passcode in a cookie the browser will not hand to scripts,
// so it never sits in the address bar or in somebody's history.
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const key = form?.get("key");
  const back = new URL("/logbook/admin", req.url);

  if (!adminKeyOk(key)) {
    back.searchParams.set("wrong", "1");
    return NextResponse.redirect(back, 303);
  }

  const res = NextResponse.redirect(back, 303);
  res.cookies.set(ADMIN_COOKIE, key, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_MAX_AGE,
  });
  return res;
}

// Signing out.
export async function DELETE(req: Request) {
  const res = NextResponse.redirect(new URL("/logbook/admin", req.url), 303);
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
