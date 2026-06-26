import { NextResponse } from "next/server";
import { BackupService } from "@/features/backup/services";

export async function GET() {
  const backups = await BackupService.list();
  return NextResponse.json(backups);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (body.action === "restore" && body.filename) {
      const result = await BackupService.restore(body.filename);
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    const result = await BackupService.create();
    return NextResponse.json(result, { status: result.success ? 201 : 500 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Operation failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");
    if (!filename) {
      return NextResponse.json(
        { success: false, message: "Filename is required" },
        { status: 400 }
      );
    }
    const result = await BackupService.delete(filename);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}
