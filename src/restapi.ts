import { Response,Request } from "express"
import { PrismaClient } from '@prisma/client'
import  Crypto from 'crypto'
import sgMail from "@sendgrid/mail";

sgMail.setApiKey('')
const prisma=new PrismaClient()
export const resetpass=async(req:Request,res:Response)=>{
const email:string=req.body

const finduser=await prisma.user.findFirst({where:{email:email}})
if(!finduser){
    return res.status(402).json('wrong email')
}
 Crypto.randomBytes(32,async(err:Error|null,buf:Buffer)=>{
if(err){
    return  res.status(402).json('wrong email')
}
const token=buf.toString('hex')
 finduser.resettoken=token
const expiredreset=new Date(Date.now() + 900000)
await prisma.user.updateMany({where:{id:finduser.id},data:{resettoken:token,expiredreset}})
sgMail.send({
to:finduser.email,
from:'ahmedrmadan251998@gmail.com',
subject:'reseting yourpassword',
text:'reseting yourpassword',
html:`<h1>Reseting your password</h1>
     <a herf="http://localhost:5173/restpass/${token}">click here to reset your password</a>
`
})


})


}