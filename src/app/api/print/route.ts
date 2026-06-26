import { NextResponse } from "next/server";
import { PrintService } from "@/features/printing/services";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, format = "html" } = body;

    if (format === "escpos") {
      const buffer = await PrintService.generateEscPos(data);
      return new NextResponse(Buffer.from(buffer), {
        headers: { "Content-Type": "application/octet-stream" },
      });
    }

    const html = await PrintService.generateReceiptHtml(data);
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Print generation failed" },
      { status: 500 }
    );
  }
}
