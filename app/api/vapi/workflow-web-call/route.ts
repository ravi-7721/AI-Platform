import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { variableValues } = await req.json();

    const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
    if (!workflowId) {
      return NextResponse.json(
        { message: "Missing NEXT_PUBLIC_VAPI_WORKFLOW_ID" },
        { status: 500 }
      );
    }

    const resp = await fetch("https://api.vapi.ai/call/web", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY!}`,
      },
      body: JSON.stringify({
        workflowId,
        workflowOverrides: {
          variableValues: variableValues ?? {},
        },
      }),
    });

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
