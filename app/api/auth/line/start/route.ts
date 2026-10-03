import { randomBytes } from "crypto";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { LINE_CHANNEL_ID: clientId, LINE_CHANNEL_SECRET: clientSecret, APP_URL: appUrl } = process.env;
  if (!clientId || !clientSecret || !appUrl) {
    return NextResponse.redirect(new URL("/masuk?error=konfigurasi", req.url));
  }
  const lanjutParam = req.nextUrl.searchParams.get("lanjut");
  const lanjut = lanjutParam && lanjutParam.startsWith("/") && !lanjutParam.startsWith("//") ? lanjutParam : null;

  const state = randomBytes(16).toString("hex");
  const url = new URL("https://access.line.me/oauth2/v2.1/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", `${appUrl}/api/auth/line/callback`);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", "openid profile");

  const res = NextResponse.redirect(url.toString());
  res.cookies.set("pawfox_state", state, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 600 });
  if (lanjut) {
    res.cookies.set("pawfox_lanjut", lanjut, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 600 });
  }
  return res;
}
