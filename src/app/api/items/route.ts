import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all items
export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Convert image buffer to base64 data URL for each item
    const itemsWithImages = items.map((item) => ({
      ...item,
      image: item.image
        ? `data:image/png;base64,${Buffer.from(item.image).toString("base64")}`
        : null,
    }));

    return NextResponse.json(itemsWithImages);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 },
    );
  }
}

// POST create new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color, image } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Item name is required" },
        { status: 400 },
      );
    }

    // Convert base64 to buffer if image exists
    let imageBuffer = null;
    if (image && image.startsWith("data:image")) {
      const base64Data = image.split(",")[1];
      imageBuffer = Buffer.from(base64Data, "base64");
    }

    const item = await prisma.item.create({
      data: {
        name: name.trim(),
        color: color || "#3498db",
        image: imageBuffer,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 },
    );
  }
}
