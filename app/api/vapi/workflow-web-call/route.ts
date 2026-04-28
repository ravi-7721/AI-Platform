import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { variableValues } = await req.json();

  const resp = await fetch("https://api.vapi.ai/call", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY!}`,
    },
    body: JSON.stringify({
      type: "webCall",
      workflowId: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
      workflowOverrides: { variableValues: variableValues ?? {} },
    }),
  });

  const text = await resp.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  return NextResponse.json(
    { vapiStatus: resp.status, vapiBody: data },
    { status: 200 }
  );
}
