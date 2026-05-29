import { NextRequest, NextResponse } from "next/server";

const SHOP = () => process.env.SHOPIFY_SHOP!;
const TOKEN = () => process.env.SHOPIFY_ACCESS_TOKEN!;
const API = "2024-01";

async function gql(query: string, variables?: object) {
  const res = await fetch(`https://${SHOP()}/admin/api/${API}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN(),
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

async function ensureDefinition() {
  await gql(`
    mutation {
      metaobjectDefinitionCreate(definition: {
        name: "Catalog Entry"
        type: "catalog_entry"
        fieldDefinitions: [
          { name: "Product Code", key: "product_code", type: "single_line_text_field" }
          { name: "Category",     key: "category",     type: "single_line_text_field" }
          { name: "Product Type", key: "product_type", type: "single_line_text_field" }
          { name: "File URL",     key: "file_url",     type: "url" }
        ]
      }) {
        metaobjectDefinition { id }
        userErrors { field message }
      }
    }
  `);
}

export async function POST(req: NextRequest) {
  const { category, productCode, productType, fileUrl } = await req.json();

  // Create definition if first time (errors silently if already exists)
  try { await ensureDefinition(); } catch {}

  const result = await gql(
    `mutation Create($fields: [MetaobjectFieldInput!]!) {
       metaobjectCreate(metaobject: { type: "catalog_entry", fields: $fields }) {
         metaobject { id handle }
         userErrors { field message }
       }
     }`,
    {
      fields: [
        { key: "product_code", value: productCode },
        { key: "category",     value: category },
        { key: "product_type", value: productType || "" },
        { key: "file_url",     value: fileUrl },
      ],
    }
  );

  const errors = result.data?.metaobjectCreate?.userErrors;
  if (errors?.length) {
    return NextResponse.json({ error: errors }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
