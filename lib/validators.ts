import { z } from 'zod';

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(''));
const password = z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.').max(100);

export const registerSchema = z.object({
  firstName: z.string().trim().min(2, 'Prénom trop court.').max(60),
  lastName: z.string().trim().min(2, 'Nom trop court.').max(60),
  email: z.email('Adresse email invalide.'),
  phone: optionalText(30),
  company: optionalText(160),
  password,
  confirmPassword: z.string().max(100),
}).refine(d => d.password === d.confirmPassword, { path: ['confirmPassword'], message: 'Les deux mots de passe ne correspondent pas.' });

export const loginSchema = z.object({ email: z.email('Adresse email invalide.'), password: z.string().min(1, 'Mot de passe requis.') });

export const resetSchema = z.object({ token: z.string().min(10, 'Lien invalide.'), password });

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Indiquez votre nom.').max(120),
  email: z.email('Adresse email invalide.'),
  phone: optionalText(30),
  subject: z.string().trim().min(2, 'Indiquez un sujet.').max(160),
  message: z.string().trim().min(10, 'Le message doit faire au moins 10 caractères.').max(5000),
  website: z.string().max(0).optional().or(z.literal('')),
});

const emptyToUndefined = (v: unknown) => (v === '' || v === null ? undefined : v);

export const quoteRequestSchema = z.object({
  serviceType: z.string().trim().min(2, 'Choisissez un service.').max(80),
  title: z.string().trim().min(2, 'Donnez un titre au projet.').max(160),
  description: z.string().trim().min(10, 'Décrivez le besoin en au moins 10 caractères.').max(10000),
  dimensions: optionalText(160),
  quantity: z.preprocess(emptyToUndefined, z.coerce.number().int().positive('Quantité invalide.').max(100000).optional()),
  material: optionalText(120),
  tolerance: optionalText(120),
  budget: z.preprocess(emptyToUndefined, z.coerce.number().nonnegative('Budget invalide.').max(100000000).optional()),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
});

export const profileSchema = z.object({
  firstName: z.string().trim().min(2, 'Prénom trop court.').max(60),
  lastName: z.string().trim().min(2, 'Nom trop court.').max(60),
  phone: optionalText(30),
  company: optionalText(160),
  currentPassword: z.string().max(100).optional().or(z.literal('')),
  newPassword: password.optional().or(z.literal('')),
});

export const projectStatus = z.enum(['DRAFT', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'ARCHIVED']);
export const requestStatus = z.enum(['NEW', 'REVIEWING', 'QUOTED', 'ACCEPTED', 'REJECTED', 'CLOSED']);
export const quoteStatus = z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED']);

export const projectCreateSchema = z.object({
  clientId: z.string().min(1, 'Choisissez un client.'),
  title: z.string().trim().min(2, 'Titre trop court.').max(160),
  description: z.string().trim().min(2, 'Ajoutez une description.').max(10000),
  status: projectStatus.default('DRAFT'),
});

export const projectUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(2).max(160).optional(),
  description: z.string().trim().min(2).max(10000).optional(),
  status: projectStatus.optional(),
  note: z.string().trim().max(500).optional(),
});

export const quoteCreateSchema = z.object({
  clientId: z.string().min(1, 'Choisissez un client.'),
  requestId: z.string().optional().or(z.literal('')),
  lines: z.array(z.object({
    description: z.string().trim().min(1, 'Chaque ligne a besoin d’une description.').max(300),
    quantity: z.coerce.number().positive('Quantité invalide.').max(1000000),
    unitPrice: z.coerce.number().nonnegative('Prix invalide.').max(100000000),
  })).min(1, 'Ajoutez au moins une ligne.').max(50),
  discount: z.coerce.number().nonnegative().max(100000000).default(0),
  taxRate: z.coerce.number().min(0).max(100).default(19),
  validUntil: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date de validité requise.'),
  conditions: z.string().trim().max(3000).optional(),
  notes: z.string().trim().max(3000).optional(),
  send: z.boolean().optional(),
});

export const faqSchema = z.object({
  question: z.string().trim().min(3, 'Question trop courte.').max(300),
  answer: z.string().trim().min(3, 'Réponse trop courte.').max(5000),
  category: z.string().trim().max(80).optional(),
  sortOrder: z.coerce.number().int().min(-1000).max(1000).default(0),
  visible: z.boolean().default(true),
});

export const settingsSchema = z.object({
  email: z.email('Adresse email invalide.'),
  phone: optionalText(40),
  instagram: optionalText(300),
  linkedin: optionalText(300),
  description: z.string().trim().max(500),
  taxRate: z.coerce.number().min(0).max(100),
});
