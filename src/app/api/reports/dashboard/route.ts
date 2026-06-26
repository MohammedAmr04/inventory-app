import { NextResponse } from "next/server";
import { DashboardService } from "@/features/reports/services/dashboard.service";

export async function GET() {
  try {
    const data = await DashboardService.get();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
