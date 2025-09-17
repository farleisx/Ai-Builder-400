import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;
const SECRET = 'YOUR_SECRET_KEY'; // change to a secure key

app.use(cors());
app.use(bodyParser.json());

// Helper to read users
function readUsers() {
  try {
    return JSON.parse(fs.readFileSync('./users.json'));
  } catch {
    return [];
  }
}

// Helper to write users
function writeUsers(users) {
  fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));
}

// SIGNUP
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({message:'Username & password required'});

  const users = readUsers();
  if(users.find(u=>u.username===username)) return res.status(400).json({message:'User already exists'});

  const hashed = await bcrypt.hash(password, 10);
  users.push({username, password: hashed});
  writeUsers(users);
  res.status(200).json({message:'User created'});
});

// SIGNIN
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({message:'Username & password required'});

  const users = readUsers();
  const user = users.find(u=>u.username===username);
  if(!user) return res.status(400).json({message:'User not found'});

  const match = await bcrypt.compare(password, user.password);
  if(!match) return res.status(400).json({message:'Wrong password'});

  const token = jwt.sign({username}, SECRET, {expiresIn:'1h'});
  res.status(200).json({token});
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
