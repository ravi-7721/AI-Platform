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

    const text = await resp.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!resp.ok) {
      return NextResponse.json(
        {
          error: "Vapi call/web failed",
          vapiStatus: resp.status,
          vapiResponse: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Route crashed", message: err?.message, stack: err?.stack },
      { status: 500 }
    );
  }
}
