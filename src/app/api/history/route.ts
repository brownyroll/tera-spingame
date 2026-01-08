import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all history
export async function GET() {
  try {
    const history = await prisma.history.findMany({
      include: {
        item: true,
        participant: true,
      },
      orderBy: { wonAt: "desc" },
    });
    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 },
    );
  }
}

// POST create new history entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, participantId } = body;

    if (!itemId || !participantId) {
      return NextResponse.json(
        { error: "Item ID and Participant ID are required" },
        { status: 400 },
      );
    }

    const parsedItemId = parseInt(itemId);
    const parsedParticipantId = parseInt(participantId);

    // Use transaction to create history and deactivate item & participant
    const result = await prisma.$transaction(async (tx) => {
      // Create history entry
      const history = await tx.history.create({
        data: {
          itemId: parsedItemId,
          participantId: parsedParticipantId,
        },
        include: {
          item: true,
          participant: true,
        },
      });

      // Deactivate the item (already won)
      await tx.item.update({
        where: { id: parsedItemId },
        data: { isActive: false },
      });

      // Deactivate the participant (already received prize)
      await tx.participant.update({
        where: { id: parsedParticipantId },
        data: { isActive: false },
      });

      return history;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating history:", error);
    return NextResponse.json(
      { error: "Failed to create history" },
      { status: 500 },
    );
  }
}
