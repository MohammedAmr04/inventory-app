import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/features/inventory/services/product.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const barcode = searchParams.get("barcode");
  const searchBarcode = searchParams.get("searchBarcode");

  try {
    if (id) {
      const product = await ProductService.getById(Number(id));
      if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(product);
    }
    if (barcode) {
      const product = await ProductService.findByBarcode(barcode);
      if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(product);
    }
    if (searchBarcode) {
      const products = await ProductService.searchBarcode(searchBarcode);
      return NextResponse.json(products);
    }

    const filters = {
      search: searchParams.get("search") ?? undefined,
      categoryId: searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined,
      type: searchParams.get("type") as "physical" | "service" | undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
      pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : undefined,
    };
    const products = await ProductService.getAll(filters);
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const product = await ProductService.create(input);
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const input = await request.json();
    const product = await ProductService.update(Number(id), input);
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    await ProductService.archive(Number(id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to archive product" }, { status: 500 });
  }
}
