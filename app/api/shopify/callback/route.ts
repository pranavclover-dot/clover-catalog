import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new NextResponse("Missing authorization code", { status: 400 });
  }

  const shop = process.env.SHOPIFY_SHOP!;
  const clientId = process.env.SHOPIFY_CLIENT_ID!;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET!;

  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });

  const data = await tokenRes.json();
  const access_token = data.access_token;

  if (!access_token) {
    return new NextResponse(`OAuth error: ${JSON.stringify(data)}`, { status: 400 });
  }

  const html = `<!DOCTYPE html>
<html>
<head><title>Shopify Connected — Clover</title></head>
<body style="font-family:system-ui,sans-serif;padding:40px;max-width:620px;margin:0 auto;background:#f0f9f4">
  <div style="background:white;border-radius:16px;padding:36px;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="font-size:48px;margin-bottom:12px">✅</div>
    <h1 style="color:#0e6b3a;margin:0 0 8px">Shopify Connected!</h1>
    <p style="color:#666;margin-bottom:24px">Copy the token below, then follow the steps.</p>

    <label style="font-size:11px;font-weight:700;color:#999;letter-spacing:0.12em;text-transform:uppercase">SHOPIFY_ACCESS_TOKEN</label>
    <div onclick="navigator.clipboard.writeText('${access_token}');this.innerText='Copied!';setTimeout(()=>this.innerText='${access_token}',2000)"
      style="background:#f8faf9;border:2px solid #0e6b3a;border-radius:8px;padding:14px 16px;margin:8px 0 28px;font-family:monospace;font-size:13px;word-break:break-all;cursor:pointer;user-select:all"
      title="Click to copy">
      ${access_token}
    </div>

    <h3 style="color:#333;margin:0 0 12px">Next steps:</h3>
    <ol style="color:#555;line-height:2.2;margin:0;padding-left:20px">
      <li>Go to <strong>Vercel → Your Project → Settings → Environment Variables</strong></li>
      <li>Add <code style="background:#f0f0f0;padding:2px 8px;border-radius:4px;font-size:12px">SHOPIFY_ACCESS_TOKEN</code> and paste the token above</li>
      <li>Click <strong>Save</strong> then <strong>Redeploy</strong></li>
    </ol>
  </div>
</body>
</html>`;

  return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
}
