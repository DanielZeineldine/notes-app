import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET || "";

export const auth = (req: Request, res: Response, next: any) => {
  try {
    const token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(403).send({ error: "Token missing! (nothing saved to token in auth) " });
    }
    console.log(token);

    const decoded = jwt.verify(token, TOKEN_SECRET);

    if (decoded) {
    //   @ts-ignore
      req.decoded = decoded;
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to verify JWT" });
  }
};
