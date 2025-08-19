import { Request, Response, NextFunction } from 'express';
export const setheaders=(req:Request,res:Response,next:NextFunction)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PUT,PATCH')
     res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === 'OPTIONS') {
    return res.sendStatus(200); 
  }
    next()
}