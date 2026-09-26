import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
export async function quotePdf(q:any,settings:any){
 const pdf=await PDFDocument.create();const page=pdf.addPage([595,842]);const font=await pdf.embedFont(StandardFonts.Helvetica);const bold=await pdf.embedFont(StandardFonts.HelveticaBold);let y=790;
 const txt=(s:string,x:number,yy:number,size=10,f=font)=>page.drawText(s,{x,y:yy,size,font:f,color:rgb(0.08,0.1,0.14)});
 txt('NEXORA 3D',42,y,22,bold);txt('Ingénierie 3D & impression haute précision',42,y-18,9);txt(`DEVIS ${q.number}`,400,y,12,bold);y-=60;
 txt(`Client : ${q.client.firstName} ${q.client.lastName}`,42,y,10,bold);txt(`Date : ${new Date(q.createdAt).toLocaleDateString('fr-FR')}`,400,y);y-=16;txt(`Valide jusqu'au : ${new Date(q.validUntil).toLocaleDateString('fr-FR')}`,400,y);y-=32;
 txt('Prestation',42,y,10,bold);txt('Qté',350,y,10,bold);txt('Prix',410,y,10,bold);txt('Total',490,y,10,bold);y-=18;
 for(const l of q.lines){const total=Number(l.quantity)*Number(l.unitPrice);txt(String(l.description).slice(0,48),42,y);txt(String(l.quantity),350,y);txt(`${Number(l.unitPrice).toFixed(2)} TND`,410,y);txt(`${total.toFixed(2)} TND`,490,y);y-=18;if(y<130){page.drawText('Suite en page suivante',{x:42,y:80,size:9,font});break}}
 y-=12;txt(`Remise : ${Number(q.discount).toFixed(2)} TND`,380,y);y-=18;txt(`Total HT : ${Number(q.totalHT).toFixed(2)} TND`,380,y,11,bold);y-=18;txt(`TVA (${Number(q.taxRate).toFixed(2)}%) : ${(Number(q.totalTTC)-Number(q.totalHT)).toFixed(2)} TND`,380,y);y-=18;txt(`Total TTC : ${Number(q.totalTTC).toFixed(2)} TND`,380,y,12,bold);y-=40;txt('Conditions :',42,y,10,bold);y-=15;txt(String(q.conditions).slice(0,105),42,y,9);if(q.notes){y-=28;txt('Notes :',42,y,10,bold);y-=15;txt(String(q.notes).slice(0,105),42,y,9)}
 return pdf.save();
}
