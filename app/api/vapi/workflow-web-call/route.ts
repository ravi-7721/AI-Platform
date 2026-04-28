import { NextResponse } from "next/server";

export async function GET() {
  const privateKey = process.env.VAPI_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
  const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;

  return NextResponse.json({
    hasPrivateKey: !!privateKey,
    privateKeyLength: privateKey?.length,
    privateKeyLast4: privateKey?.slice(-4),

    hasPublicKey: !!publicKey,
    publicKeyLength: publicKey?.length,
    publicKeyLast4: publicKey?.slice(-4),

    hasWorkflowId: !!workflowId,
    workflowIdLast4: workflowId?.slice(-4),
  });
}

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
