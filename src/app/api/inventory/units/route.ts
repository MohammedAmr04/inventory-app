import { NextRequest, NextResponse } from "next/server";
import { UnitService } from "@/features/inventory/services/unit.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const q = searchParams.get("q");

  try {
    if (id) {
      const unit = await UnitService.getById(Number(id));
      if (!unit) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(unit);
    }
    if (q) {
      const units = await UnitService.search(q);
      return NextResponse.json(units);
    }
    const units = await UnitService.getAll();
    return NextResponse.json(units);
  } catch {
    return NextResponse.json({ error: "Failed to fetch units" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const unit = await UnitService.create(input);
    return NextResponse.json(unit, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create unit" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const input = await request.json();
    const unit = await UnitService.update(Number(id), input);
    return NextResponse.json(unit);
  } catch {
    return NextResponse.json({ error: "Failed to update unit" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    await UnitService.archive(Number(id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to archive unit" }, { status: 500 });
  }
}
