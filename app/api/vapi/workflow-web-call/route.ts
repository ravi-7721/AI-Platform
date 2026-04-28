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
  try {
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

    const text = await resp.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    // Always return what Vapi said (even on errors)
    return NextResponse.json(
      { vapiStatus: resp.status, vapiBody: data },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Route crashed", message: err?.message, stack: err?.stack },
      { status: 500 }
    );
  }
}
