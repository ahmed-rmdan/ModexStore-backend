import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'

import { createHandler   } from 'graphql-http/lib/use/express';
import { resolver } from './graphql/resolver'
import { schema } from './graphql/schema'
import dotenv from 'dotenv'
import fs from 'fs'
import { setheaders } from './middleware'
import { PrismaClient } from '@prisma/client'
import sgMail from "@sendgrid/mail";
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'



const prisma=new PrismaClient()
dotenv.config();

cloudinary.config({
  cloud_name:'df0no7xar',
  api_key:process.env.cloudinary_api_key as string,
  api_secret:process.env.cloudinary_api_secret as string

})

const storge=multer.diskStorage({
  destination(req, file, callback) {
    callback(null,'upload/')
  },
  filename(req, file, callback) { 
    callback(null,Date.now()+'-'+file.originalname)
  },
})

const upload=multer({storage:storge,limits:{ fileSize: 10 * 1024 * 1024 }})

const app = express()




app.use(express.json({ limit: "10mb" }));



app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.post('/uploadimge/:productid',upload.single('mainimge'),async (req,res)=>{
  
 const id=req.params.productid
 if(!id){
  res.status(401).send({message:'productid not found'})
 }
    const result = await cloudinary.uploader.upload(req.file!.path, {
      folder: "modexstore",
    });
    console.log(result.secure_url)
          fs.unlinkSync(req.file?.path as string)
    try{
  await prisma.product.update({where:{id:id as string},data:{mainimg:result.secure_url}})
   res.status(200).send({message:'main img has been added'})
    }catch(err){
          console.log(err)
           res.status(401).send({message:'upload failed'})
    }
  

})




app.all('/graphql', createHandler({ schema, rootValue: resolver, context:(req:Request):any=>{
         
     const token=req.headers.authorization?.split(' ')[1]
   
         if(!token){
          return {user:null}
         }
         try{
          const dectoken=  jwt.verify(token,'veryverysecret') as any
             if(!dectoken){
            return {user:null}
           }
           const userid=dectoken.userid 
          
           return {user:userid}
         }catch(err){
         return {user:null}

         }
         
         
      
        
             
}
  
  }) )

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/graphql")
})