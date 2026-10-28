import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/security";
import { registerSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { apiError, clientIp, jsonError } from "@/lib/api";

export async function POST(req: Request) {
  try {
    if (!rateLimit(`register:${clientIp(req)}`, 5, 60 * 60_000)) {
      return jsonError(
        "Trop de comptes créés depuis cette connexion. Réessayez plus tard.",
        429,
      );
    }

    const d = registerSchema.parse(await req.json());
    const email = d.email.toLowerCase().trim();

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return jsonError(
        "Un compte existe déjà avec cet email. Connectez-vous ou réinitialisez votre mot de passe.",
        409,
      );
    }

    const user = await db.user.create({
      data: {
        firstName: d.firstName,
        lastName: d.lastName,
        email,
        phone: d.phone || null,
        company: d.company || null,
        passwordHash: await hashPassword(d.password),
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      message: "Votre compte Nexora 3D a été créé avec succès.",
      userId: user.id,
    });
  } catch (e) {
    return apiError(
      e,
      "Impossible de créer le compte pour le moment.",
    );
  }
}