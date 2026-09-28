import { getUser } from '@netlify/identity';
import { json } from './_shared.js';
export default async()=>{
 try {const u=await getUser();return json({email:u?.email||null,admin:!!u && !!process.env.ADMIN_EMAIL && u.email?.toLowerCase()===process.env.ADMIN_EMAIL.trim().toLowerCase()})}
 catch {return json({email:null,admin:false})}
};
