import nodemailer from 'nodemailer';
const enabled=Boolean(process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASSWORD);
export async function sendMail(to:string,subject:string,html:string){if(!enabled)return false;const t=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:Number(process.env.SMTP_PORT||587)===465,auth:{user:process.env.SMTP_USER,password:process.env.SMTP_PASSWORD}} as any);await t.sendMail({from:process.env.SMTP_FROM||process.env.SMTP_USER,to,subject,html});return true;}
