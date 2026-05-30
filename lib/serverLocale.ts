import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./i18n";

const COOKIE_NAME = "yosurf-locale";

/**
 * Reads the user's locale on server components.
 * Order of resolution:
 *   1. optional ?lang= search param, when a page passes searchParams
 *   2. cookie 'yosurf-locale' (set by LocaleSwitcher when user picks a language)
 *   3. Accept-Language header (browser default)
 *   4. default FR
 *
 * Use in any RSC: `const locale = await getServerLocale(searchParams);`
 */
export async function getServerLocale(
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>
): Promise<Locale> {
  try {
    const params = searchParams ? await searchParams : null;
    const raw = params?.lang;
    const fromQuery = Array.isArray(raw) ? raw[0] : raw;
    if (fromQuery && isLocale(fromQuery)) return fromQuery;
  } catch { /* ignore */ }

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
