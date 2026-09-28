import {logout,verifyRequestOrigin} from '@netlify/identity';
import {json} from './_shared.js';
export default async(req)=>{if(req.method!=='POST')return json({error:'Method not allowed'},405);try{verifyRequestOrigin(req);await logout();return json({ok:true})}catch(e){return json({error:e.message||'Could not sign out.'},400)}};
