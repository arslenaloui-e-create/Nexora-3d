import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
export const hashPassword=(p:string)=>bcrypt.hash(p,12);
export const verifyPassword=(p:string,h:string)=>bcrypt.compare(p,h);
export const randomToken=()=>randomBytes(32).toString('hex');
export const hashToken=(t:string)=>createHash('sha256').update(t).digest('hex');
export const safeName=(name:string)=>name.replace(/[^a-zA-Z0-9._-]/g,'_').slice(0,160);
