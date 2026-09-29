import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, hashToken, randomToken } from "@/lib/security";
import { registerSchema } from "@/lib/validators";
import { escapeHtml, sendMail } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";
import { apiError, clientIp, jsonError } from "@/lib/api";

export async function POST(req: Request) {
  try {
    if (!rateLimit(`register:${clientIp(req)}`, 5, 60 * 60_000))
      return jsonError(
        "Trop de comptes créés depuis cette connexion. Réessayez plus tard.",
        429,
      );
    const d = registerSchema.parse(await req.json());
    const email = d.email.toLowerCase().trim();
    if (await db.user.findUnique({ where: { email } }))
      return jsonError(
        "Un compte existe déjà avec cet email. Connectez-vous ou réinitialisez votre mot de passe.",
        409,
      );
    const u = await db.user.create({
      data: {
        firstName: d.firstName,
        lastName: d.lastName,
        email,
        phone: d.phone || null,
        company: d.company || null,
        passwordHash: await hashPassword(d.password),
      },
    });
    const raw = randomToken();
    await db.emailVerificationToken.create({
      data: {
        userId: u.id,
        tokenHash: hashToken(raw),
        expiresAt: new Date(Date.now() + 86400000),
      },
    });
    const url = `${process.env.APP_URL || "http://localhost:3000"}/api/auth/verify?token=${raw}`;
    const emailSent = await sendMail(
      email,
      "Confirmez votre compte Nexora 3D",
      `<p>Bonjour ${escapeHtml(u.firstName)},</p>
   <p>Confirmez votre adresse email :
   <a href="${url}">${url}</a></p>`,
    );

    if (!emailSent) {
      console.error("REGISTER: email de vérification non envoyé");

      return jsonError(
        "Votre compte a été créé, mais nous n’avons pas réussi à envoyer l’email de vérification. Réessayez plus tard.",
        503,
      );
    }

    return NextResponse.json({
      message:
        "Compte créé. Un email de vérification vient de vous être envoyé.",
    });
  } catch (e) {
    return apiError(e, "Impossible de créer le compte pour le moment.");
  }
}
