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
import Stripe from 'stripe';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from 'jsonwebtoken';

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

// const lol="http://localhost:5173"

app.use(cors({
  origin: ["https://modexstore.netlify.app","http://localhost:5173"],
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

const stripe=new Stripe(process.env.stripe_secret_key as string)
console.log(process.env.stripe_secret_key)

app.post('/stripecheck',async (req,res)=>{
  console.log('stripe')
   const token=req.headers.authorization?.split(' ')[1]
   console.log(token)
 if(!token){
  return res.status(401).send({message:'not authorized'})
       }
      try{
    const dectoken= jwt.verify(token,'veryverysecret') as any
             if(!dectoken){
            return res.status(401).send({message:'not authorized'})
               
           }
          }
           catch(err){
               return res.status(401).send({message:'not authorized'})
           }

          const items:{productid:string,quantity:number}[]= await req.body
             console.log(items)
                     const productsid= items.map(elm=>{
                                return elm.productid
                               })
                const products=await prisma.product.findMany({where:{id:{in:productsid}}})
                                
                                     
                                         const itemsstripe=products.map((product,i)=>{
                                          return  {price_data:{
                                                currency:'USD',
                                      product_data:{name:`${product.name}`},
                                  unit_amount:(product.newprice/50)*100
                                      },quantity:items[i]?.quantity as number}
                                                    })
                              const payment=await stripe.checkout.sessions.create({
                                line_items:itemsstripe
                                ,
                                mode:'payment',
                                success_url:'https://modexstore-backend.onrender.com/stripesucess',
                                cancel_url:'https://modexstore-backend.onrender.com/stripecancel'
                              })
                              console.log(payment.url)
                     return res.status(200).json(payment.url)                 

})



app.all('/graphql', createHandler({ schema, rootValue: resolver, context:(req:Request):any=>{
         
     const token=req.headers.authorization?.split(' ')[1]
   
         if(!token){
          return {user:null}
         }
         try{
          const dectoken= jwt.verify(token,'veryverysecret') as any
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



let io:Server;

const port=process.env.port||3000
const server=app.listen(port, () => {
  console.log("Server running on https://modexstore-backend.onrender.com")
})

io=new Server(server,{cors:{origin:'*'}})
io.on('connection',(socket)=>{
  const token:string=socket.handshake.auth.token
const dectoken= jwt.verify(token,'veryverysecret') as JwtPayload
const userid:string=dectoken.userid 

socket.on('joinuserroom',async ()=>{
  console.log(socket.id)
socket.join(userid)
console.log(userid)
console.log(socket.rooms)
})
socket.on('disconnect',()=>{

})


})

export {io};