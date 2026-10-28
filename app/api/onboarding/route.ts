import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireUser("CLIENT");

    return NextResponse.json({
      onboardingCompleted: user.onboardingCompleted,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Non autorisé.",
      },
      {
        status: 401,
      },
    );
  }
}

export async function POST() {
  try {
    const user = await requireUser("CLIENT");

    if (!user.onboardingCompleted) {
      await import("@/lib/db").then(({ db }) =>
        db.user.update({
          where: {
            id: user.id,
          },
          data: {
            onboardingCompleted: true,
          },
        }),
      );
    }

    return NextResponse.json({
      success: true,
      onboardingCompleted: true,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Impossible de terminer le guide.",
      },
      {
        status: 401,
      },
    );
  }
}