import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "@/features/inventory/services/category.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const q = searchParams.get("q");

  try {
    if (id) {
      const category = await CategoryService.getById(Number(id));
      if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(category);
    }
    if (q) {
      const categories = await CategoryService.search(q);
      return NextResponse.json(categories);
    }
    const categories = await CategoryService.getAll();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const category = await CategoryService.create(input);
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const input = await request.json();
    const category = await CategoryService.update(Number(id), input);
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    await CategoryService.archive(Number(id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to archive category" }, { status: 500 });
  }
}
