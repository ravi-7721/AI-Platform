import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { variableValues } = await req.json();

    const privateKey = process.env.VAPI_PRIVATE_KEY;
    const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;

    if (!privateKey) {
      return NextResponse.json(
        { error: "Missing VAPI_PRIVATE_KEY in server env" },
        { status: 500 }
      );
    }

    if (!workflowId) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_VAPI_WORKFLOW_ID in server env" },
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
    return NextResponse.json(data, { status: resp.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Route crashed", message: err?.message, stack: err?.stack },
      { status: 500 }
    );
  }
}
