import { NextResponse } from "next/server";

export async function GET() {
  const resp = await fetch("https://api.vapi.ai/assistant?limit=1", {
    headers: {
      Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY!}`,
    },
  });

  const text = await resp.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  return NextResponse.json({ status: resp.status, data }, { status: 200 });
}
