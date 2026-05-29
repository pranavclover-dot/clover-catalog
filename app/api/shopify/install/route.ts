import { NextResponse } from "next/server";

export async function GET() {
  const shop = process.env.SHOPIFY_SHOP!;
  const clientId = process.env.SHOPIFY_CLIENT_ID!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const redirectUri = `${appUrl}/api/shopify/callback`;
  const scopes = "read_files,write_files,read_metaobjects,write_metaobjects,read_content,write_content";

  const installUrl =
    `https://${shop}/admin/oauth/authorize?` +
    `client_id=${clientId}&` +
    `scope=${encodeURIComponent(scopes)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}`;

  return NextResponse.redirect(installUrl);
}
