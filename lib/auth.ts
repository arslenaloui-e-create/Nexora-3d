import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { db } from './db';
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-only-change-me');
export type Session={id:string;role:'ADMIN'|'CLIENT';email:string};
export async function createSession(s:Session){
 const token=await new SignJWT(s).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('7d').sign(secret);
 (await cookies()).set('nexora_session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*24*7});
}
export async function getSession():Promise<Session|null>{
 const token=(await cookies()).get('nexora_session')?.value; if(!token)return null;
 try{return (await jwtVerify(token,secret)).payload as unknown as Session}catch{return null}
}
export async function requireUser(role?:Session['role']){const s=await getSession();if(!s)throw new Error('UNAUTHENTICATED');if(role&&s.role!==role)throw new Error('FORBIDDEN');const u=await db.user.findUnique({where:{id:s.id}});if(!u||u.status!=='ACTIVE')throw new Error('FORBIDDEN');return u;}
export async function logout(){(await cookies()).delete('nexora_session');}
