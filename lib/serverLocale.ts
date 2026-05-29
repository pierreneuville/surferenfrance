import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./i18n";

const COOKIE_NAME = "yosurf-locale";

/**
 * Reads the user's locale on server components.
 * Order of resolution:
 *   1. cookie 'yosurf-locale' (set by LocaleSwitcher when user picks a language)
 *   2. Accept-Language header (browser default)
 *   3. default FR
 *
 * Use in any RSC: `const locale = await getServerLocale();`
 */
export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const fromCookie = cookieStore.get(COOKIE_NAME)?.value;
    if (fromCookie && isLocale(fromCookie)) return fromCookie;
  } catch { /* ignore */ }

  try {
    const headerStore = await headers();
    const accept = headerStore.get("accept-language") ?? "";
    const candidate = accept.split(",")[0]?.slice(0, 2).toLowerCase();
    if (candidate && isLocale(candidate)) return candidate;
  } catch { /* ignore */ }

  return DEFAULT_LOCALE;
}
