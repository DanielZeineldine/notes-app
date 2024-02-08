import express from "express";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient();
const TOKEN_SECRET = process.env.TOKEN_SECRET || " ";
const saltRounds = 10;

const UserController = express.Router()

UserController.post("/register", async (req, res)=>{
    try {
        const { username, email, password } = req.body;
    
        // Check if the username is already taken
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
    
        if (existingUser) {
          return res.status(400).json({ error: 'email already exists' });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create a new user
        const newUser = await prisma.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
          },
        });
    
        res.status(201).json({ message: 'User registered successfully', user: newUser });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }

})
UserController.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Check if the password is correct
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user.id, username: user.username }, TOKEN_SECRET, {
        expiresIn: '1h',
      });
  
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  export default UserController;
