import {login,verifyRequestOrigin} from '@netlify/identity';
import {json} from './_shared.js';
export default async(req)=>{
 if(req.method!=='POST') return json({error:'Method not allowed'},405);
 try {verifyRequestOrigin(req);const {email,password}=await req.json();if(typeof email!=='string'||typeof password!=='string') return json({error:'Enter your email and password.'},400);await login(email,password);return json({ok:true})}
 catch(e){return json({error:e.message||'Sign in failed.'},401)}
};
