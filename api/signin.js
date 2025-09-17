import fs from 'fs';
import bcrypt from 'bcrypt';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({message:'Method not allowed'});
  const {username,password} = req.body;
  if(!username || !password) return res.status(400).json({message:'Username & password required'});

  let users = [];
  try{ users = JSON.parse(fs.readFileSync('./users.json')); }catch(e){}

  const user = users.find(u=>u.username===username);
  if(!user) return res.status(400).json({message:'User not found'});

  const match = await bcrypt.compare(password,user.password);
  if(!match) return res.status(400).json({message:'Wrong password'});

  res.status(200).json({message:'Logged in'});
}
