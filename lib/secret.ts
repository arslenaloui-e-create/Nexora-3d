// Partagé par lib/auth.ts et middleware.ts (le middleware ne peut pas importer Prisma).
// En production, un AUTH_SECRET absent ou laissé à la valeur d'exemple permettrait
// à n'importe qui de forger une session admin : on refuse de signer/vérifier.
export function authSecret() {
  const value = process.env.AUTH_SECRET || '';
  const weak = !value || value.startsWith('CHANGE_ME') || value.length < 32;
  if (weak && process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET manquant ou trop faible (32 caractères minimum).');
  }
  return new TextEncoder().encode(value || 'dev-only-change-me');
}
