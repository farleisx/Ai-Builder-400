import fs from 'fs';
import bcrypt from 'bcrypt';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({message:'Method not allowed'});
  const {username,password} = req.body;
  if(!username || !password) return res.status(400).json({message:'Username & password required'});

  let users = [];
  try{ users = JSON.parse(fs.readFileSync('./users.json')); }catch(e){}

  if(users.find(u=>u.username===username)) return res.status(400).json({message:'User exists'});

  const hashed = await bcrypt.hash(password,10);
  users.push({username,password:hashed});
  fs.writeFileSync('./users.json', JSON.stringify(users));

  res.status(200).json({message:'User created'});
}
