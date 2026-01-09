import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

// GET single item
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Convert image buffer to base64 data URL
    const itemWithImage = {
      ...item,
      image: item.image
        ? `data:image/png;base64,${Buffer.from(item.image).toString("base64")}`
        : null,
    };

    return NextResponse.json(itemWithImage);
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 },
    );
  }
}

// PUT update item
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, color, image, isActive } = body;

    // Convert base64 to buffer if image exists
    let imageBuffer = undefined;
    if (image !== undefined) {
      if (image === null) {
        imageBuffer = null;
      } else if (image.startsWith("data:image")) {
        const base64Data = image.split(",")[1];
        imageBuffer = Buffer.from(base64Data, "base64");
      }
    }

    const item = await prisma.item.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(color !== undefined && { color }),
        ...(imageBuffer !== undefined && { image: imageBuffer }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 },
    );
  }
}

// DELETE item
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.item.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 },
    );
  }
}
