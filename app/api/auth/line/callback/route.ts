import { NextResponse, type NextRequest } from "next/server";
import { simpanSesi } from "@/lib/session";
import { upsertProfilLine } from "@/lib/db";

// id_token diterima langsung dari server LINE lewat pertukaran kode di
// server ini (back channel), bukan dari browser, jadi cukup didekode tanpa
// verifikasi tanda tangan.
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const stateCookie = req.cookies.get("pawfox_state")?.value;
    const { LINE_CHANNEL_ID: clientId, LINE_CHANNEL_SECRET: clientSecret, APP_URL: appUrl } = process.env;

    const gagal = (alasan: string) => NextResponse.redirect(new URL(`/masuk?error=${alasan}`, req.url));

    if (!code || !state || !stateCookie || state !== stateCookie) return gagal("state");
    if (!clientId || !clientSecret || !appUrl) return gagal("konfigurasi");

    const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${appUrl}/api/auth/line/callback`,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    if (!tokenRes.ok) return gagal("token");
    const tokenJson = (await tokenRes.json()) as { id_token?: string };
    if (!tokenJson.id_token) return gagal("token");

    const payload = JSON.parse(
      Buffer.from(tokenJson.id_token.split(".")[1] ?? "", "base64url").toString("utf8")
    ) as { sub?: string; name?: string; picture?: string };
    if (!payload.sub) return gagal("token");

    const { profil, jadiAdmin } = await upsertProfilLine(payload.sub, payload.name ?? "Buyer LINE", payload.picture ?? null);
    await simpanSesi(profil.id);

    const lanjutCookie = req.cookies.get("pawfox_lanjut")?.value;
    const lanjut = lanjutCookie && lanjutCookie.startsWith("/") && !lanjutCookie.startsWith("//") ? lanjutCookie : null;
    const tujuan = jadiAdmin && !lanjut ? "/admin?selamat=1" : (lanjut ?? "/tagihan");
    const res = NextResponse.redirect(new URL(tujuan, req.url));
    res.cookies.delete("pawfox_state");
    res.cookies.delete("pawfox_lanjut");
    return res;
  } catch {
    return NextResponse.redirect(new URL("/masuk?error=server", new URL(req.url).origin));
  }
}
