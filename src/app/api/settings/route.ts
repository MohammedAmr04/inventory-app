import { NextResponse } from "next/server";
import { SettingsService } from "@/features/settings/services";

export async function GET() {
  try {
    const data = await SettingsService.getAll();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await SettingsService.update(body);
    const data = await SettingsService.getAll();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
