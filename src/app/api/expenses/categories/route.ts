import { NextRequest, NextResponse } from "next/server";
import { ExpenseCategoryRepository } from "@/features/expenses/repositories";

export async function GET() {
  try {
    const categories = await ExpenseCategoryRepository.findAll();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const category = await ExpenseCategoryRepository.create(input);
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...input } = await request.json();
    const category = await ExpenseCategoryRepository.update(Number(id), input);
    if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}
