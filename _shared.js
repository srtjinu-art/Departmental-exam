import { getUser, verifyRequestOrigin } from '@netlify/identity';
import { getStore } from '@netlify/blobs';
export const docs = () => getStore('train-man-pdfs');
export const catalog = () => getStore('train-man-catalog');
export const json = (data, status=200) => Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function admin(request){
  verifyRequestOrigin(request);
  const user=await getUser();
  const email=process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) return {error:json({error:'ADMIN_EMAIL is not configured on Netlify.'},503)};
  if (!user) return {error:json({error:'Please sign in.'},401)};
  if (user.email?.toLowerCase()!==email) return {error:json({error:'This account cannot manage PDFs.'},403)};
  return {user};
}
export function safeId(id){return typeof id==='string' && /^[a-f0-9-]{36}$/.test(id)}
