import { NextResponse } from "next/server";

export async function GET() {
  const shop = process.env.SHOPIFY_SHOP;
  const token = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!shop || !token) {
    return NextResponse.json({ entries: [] });
  }

  const res = await fetch(`https://${shop}/admin/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({
      query: `{
        metaobjects(type: "catalog_entry", first: 250, sortKey: CREATED_AT) {
          nodes {
            id
            createdAt
            fields { key value }
          }
        }
      }`,
    }),
    next: { revalidate: 0 },
  });

  const data = await res.json();
  const nodes = data.data?.metaobjects?.nodes ?? [];

  const entries = nodes.map((node: { id: string; createdAt: string; fields: { key: string; value: string }[] }) => {
    const f: Record<string, string> = {};
    node.fields.forEach(({ key, value }) => { f[key] = value; });
    return { id: node.id, createdAt: node.createdAt, ...f };
  });

  // Sort newest first
  entries.sort((a: { createdAt: string }, b: { createdAt: string }) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({ entries });
}
