import {catalog,docs,json,admin,safeId} from './_shared.js';
export default async(req)=>{
 try{
  if(req.method==='GET'){
   const id=new URL(req.url).searchParams.get('id');
   if(id){if(!safeId(id))return json({error:'Invalid document'},400);const meta=await (await catalog()).get(id,{type:'json'});if(!meta)return json({error:'Document not found'},404);const blob=await (await docs()).get(id,{type:'arrayBuffer'});if(!blob)return json({error:'Document not found'},404);return new Response(blob,{headers:{'Content-Type':'application/pdf','Content-Disposition':`inline; filename="${id}.pdf"`,'Cache-Control':'public, max-age=3600','X-Content-Type-Options':'nosniff'}})}
   const entries=[];let cursor;do{const page=await (await catalog()).list({cursor});for(const item of page.blobs){const meta=await (await catalog()).get(item.key,{type:'json'});if(meta)entries.push(meta)}cursor=page.cursor}while(cursor);return json({documents:entries.sort((a,b)=>b.uploadedAt.localeCompare(a.uploadedAt))});
  }
  if(req.method==='POST'){
   const check=await admin(req);if(check.error)return check.error;
   const data=await req.formData();const file=data.get('file');const title=String(data.get('title')||'').trim();const category=String(data.get('category')||'').trim();
   if(!file||typeof file.arrayBuffer!=='function'||!title||title.length>120||!category||category.length>60)return json({error:'Enter a title, category and PDF.'},400);
   if(file.size>4_000_000)return json({error:'PDF must be under 4 MB.'},413);
   const bytes=await file.arrayBuffer();const signature=new Uint8Array(bytes.slice(0,5));if(String.fromCharCode(...signature)!=='%PDF-')return json({error:'Only PDF files are accepted.'},400);
   const id=crypto.randomUUID();const meta={id,title,category,filename:String(file.name||'document.pdf').slice(0,150),size:file.size,uploadedAt:new Date().toISOString()};
   await (await docs()).set(id,bytes);try{await (await catalog()).setJSON(id,meta)}catch(e){await (await docs()).delete(id);throw e}return json({document:meta},201);
  }
  if(req.method==='DELETE'){
   const check=await admin(req);if(check.error)return check.error;const id=new URL(req.url).searchParams.get('id');if(!safeId(id))return json({error:'Invalid document'},400);await (await catalog()).delete(id);await (await docs()).delete(id);return json({ok:true});
  }
  return json({error:'Method not allowed'},405)
 }catch(e){console.error(e);return json({error:'The request could not be completed. Please try again.'},500)}
};
