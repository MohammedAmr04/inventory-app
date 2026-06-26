import { NextRequest, NextResponse } from "next/server";
import { SupplierService } from "@/features/suppliers/services/supplier.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const q = searchParams.get("q");

  try {
    if (id) {
      const supplier = await SupplierService.getById(Number(id));
      if (!supplier) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(supplier);
    }
    if (q) {
      const suppliers = await SupplierService.search(q);
      return NextResponse.json(suppliers);
    }
    const filters = {
      search: searchParams.get("search") ?? undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
      pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : undefined,
      sortBy: searchParams.get("sortBy") as "name" | "currentBalance" | "createdAt" | undefined,
      sortOrder: searchParams.get("sortOrder") as "asc" | "desc" | undefined,
    };
    const suppliers = await SupplierService.getAll(filters);
    return NextResponse.json(suppliers);
  } catch {
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const supplier = await SupplierService.create(input);
    return NextResponse.json(supplier, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const input = await request.json();
    const supplier = await SupplierService.update(Number(id), input);
    return NextResponse.json(supplier);
  } catch {
    return NextResponse.json({ error: "Failed to update supplier" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    await SupplierService.archive(Number(id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to archive supplier" }, { status: 500 });
  }
}
