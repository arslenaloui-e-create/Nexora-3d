import path from 'path';import fs from 'fs/promises';import crypto from 'crypto';import {safeName} from './security';
const root=path.join(process.cwd(),'storage');
export const allowed=new Set(['.stl','.step','.stp','.sldprt','.sldasm','.obj','.3mf','.pdf','.zip','.png','.jpg','.jpeg','.webp']);
export async function saveUpload(file:File){const ext=path.extname(file.name).toLowerCase();if(!allowed.has(ext))throw new Error('TYPE_NOT_ALLOWED');const max=Number(process.env.MAX_UPLOAD_MB||50)*1024*1024;if(file.size>max)throw new Error('FILE_TOO_LARGE');await fs.mkdir(root,{recursive:true});const stored=`${crypto.randomUUID()}-${safeName(file.name)}`;await fs.writeFile(path.join(root,stored),Buffer.from(await file.arrayBuffer()));return {storedName:stored,originalName:file.name,mimeType:file.type||'application/octet-stream',size:file.size};}
export async function readStored(name:string){return fs.readFile(path.join(root,path.basename(name)));}
export async function removeStored(name:string){try{await fs.unlink(path.join(root,path.basename(name)))}catch{}}
