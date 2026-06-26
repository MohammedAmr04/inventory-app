import { NextRequest, NextResponse } from "next/server";
import { HeldInvoiceService } from "@/features/pos/services/held-invoice.service";

export async function GET() {
  try {
    const held = await HeldInvoiceService.findAll();
    return NextResponse.json(held);
  } catch {
    return NextResponse.json({ error: "Failed to fetch held invoices" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const held = await HeldInvoiceService.hold(input);
    return NextResponse.json(held, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to hold invoice" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id } = await request.json();
    const resumed = await HeldInvoiceService.resume(Number(id));
    return NextResponse.json(resumed);
  } catch {
    return NextResponse.json({ error: "Failed to resume invoice" }, { status: 500 });
  }
}
