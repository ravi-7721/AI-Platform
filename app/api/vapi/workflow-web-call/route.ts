import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { variableValues } = await req.json();

  const privateKey = process.env.VAPI_PRIVATE_KEY;
  const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;

  if (!privateKey) {
    return NextResponse.json(
      { message: "Missing VAPI_PRIVATE_KEY env var on server" },
      { status: 500 }
    );
  }

  if (!workflowId) {
    return NextResponse.json(
      { message: "Missing NEXT_PUBLIC_VAPI_WORKFLOW_ID env var on server" },
      { status: 500 }
    );
  }

  // quick sanity: Vapi keys are UUIDs (length 36)
  if (privateKey.length !== 36) {
    return NextResponse.json(
      {
        message: `VAPI_PRIVATE_KEY looks wrong length (${privateKey.length}). It should be a UUID.`,
      },
      { status: 500 }
    );
  }

  const resp = await fetch("https://api.vapi.ai/call/web", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${privateKey}`,
    },
    body: JSON.stringify({
      workflowId,
      workflowOverrides: { variableValues: variableValues ?? {} },
    }),
  });

  const data = await resp.json();
  return NextResponse.json(
    { vapiStatus: resp.status, vapiBody: data },
    { status: 200 }
  );
}
