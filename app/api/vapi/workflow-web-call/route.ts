import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { variableValues } = await req.json();

  const resp = await fetch("https://api.vapi.ai/call/web", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY!}`,
    },
    body: JSON.stringify({
      workflowId: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
      workflowOverrides: { variableValues: variableValues ?? {} },
    }),
  });

  const data = await resp.json();
  return NextResponse.json(data, { status: resp.status });
}
