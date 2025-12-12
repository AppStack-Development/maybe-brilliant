// lib/unsplash.ts
export function unsplashThumb(
    url: string,
    { w = 900, h = 506, q = 60 }: { w?: number; h?: number; q?: number } = {}
) {
    try {
        const u = new URL(url);
        u.searchParams.set("auto", "format");
        u.searchParams.set("fit", "crop");
        u.searchParams.set("w", String(w));
        u.searchParams.set("h", String(h));
        u.searchParams.set("q", String(q));
        // optional: slightly more compression
        // u.searchParams.set("fm", "webp");
        return u.toString();
    } catch {
        return url; // fallback if it's not a valid URL
    }
}
