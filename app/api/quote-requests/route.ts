import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {requireUser} from '@/lib/auth';
import {quoteRequestSchema} from '@/lib/validators';
import {sendMail} from '@/lib/mail';
export async function POST(req:Request){
 try{
  const u=await requireUser('CLIENT'); const d=quoteRequestSchema.parse(await req.json());
  const q=await db.quoteRequest.create({data:{clientId:u.id,serviceType:d.serviceType,title:d.title,description:d.description,dimensions:d.dimensions||null,quantity:d.quantity??null,material:d.material||null,tolerance:d.tolerance||null,budget:d.budget??null,deadline:d.deadline?new Date(`${d.deadline}T23:59:59`):null}});
  const admin=await db.user.findFirst({where:{role:'ADMIN',status:'ACTIVE'}});
  if(admin){await db.notification.create({data:{userId:admin.id,type:'QUOTE_REQUEST',message:`Nouvelle demande : ${q.title}`}});if(process.env.SMTP_USER)await sendMail(process.env.SMTP_USER,'Nouvelle demande de devis',`<p>${q.title}</p><p>${q.description}</p>`)}
  return NextResponse.json({message:'Demande créée.',id:q.id});
 }catch(e){const message=e instanceof Error&&e.message==='UNAUTHENTICATED'?'Connexion requise.':'Demande invalide.';return NextResponse.json({error:message},{status:message==='Connexion requise.'?401:400})}
}
