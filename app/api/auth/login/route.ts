import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/security";
import { createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { apiError, clientIp, jsonError } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const data = loginSchema.parse(await req.json());

    // 10 essais par compte et par connexion, 50 par connexion tous comptes confondus.
    const ip = clientIp(req);

    if (
      !rateLimit(
        `login:${ip}:${data.email.toLowerCase()}`,
        10,
        10 * 60_000,
      ) ||
      !rateLimit(`login:${ip}`, 50, 10 * 60_000)
    ) {
      return jsonError(
        "Trop de tentatives. Réessayez dans quelques minutes.",
        429,
      );
    }

    const u = await db.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (!u || !(await verifyPassword(data.password, u.passwordHash))) {
      return jsonError("Email ou mot de passe incorrect.", 401);
    }

    if (u.status !== "ACTIVE") {
      return jsonError(
        "Ce compte est désactivé. Contactez Nexora 3D.",
        403,
      );
    }

    await createSession({
      id: u.id,
      role: u.role,
      email: u.email,
    });

    return NextResponse.json({ role: u.role });
  } catch (e) {
    return apiError(e, "Connexion impossible pour le moment.");
  }
}