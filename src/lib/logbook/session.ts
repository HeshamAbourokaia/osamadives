import { cookies } from "next/headers";
import { adminKeyOk } from "./admin";

export const ADMIN_COOKIE = "od_mod";
export const ADMIN_MAX_AGE = 60 * 60 * 24 * 30; // a month, then sign in again

/** The passcode from the cookie, or from a shared link, whichever proves out. */
export function moderatorKey(fromLink?: string): string | null {
  if (adminKeyOk(fromLink)) return fromLink;
  const jar = cookies().get(ADMIN_COOKIE)?.value;
  return adminKeyOk(jar) ? jar : null;
}
