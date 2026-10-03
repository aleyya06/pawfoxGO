import { NextResponse, type NextRequest } from "next/server";
import { hapusSesi } from "@/lib/session";

export async function POST(req: NextRequest) {
  await hapusSesi();
  return NextResponse.redirect(new URL("/", req.url));
}
