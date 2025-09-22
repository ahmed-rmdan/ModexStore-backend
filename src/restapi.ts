import { Response,Request } from "express"
import { PrismaClient } from '@prisma/client'
import  Crypto from 'crypto'
import bcrypt from 'bcrypt'
const SibApiV3Sdk = require('sib-api-v3-sdk');

let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey =process.env.brevoapi

const prisma=new PrismaClient()

export const resetpass=async(req:Request,res:Response)=>{
const email:string=req.body.email
console.log(email)
const finduser=await prisma.user.findFirst({where:{email:email}})
if(!finduser){
    return res.status(406).json('wrong email')
}
 Crypto.randomBytes(32,async(err:Error|null,buf:Buffer)=>{
if(err){
    return  res.status(406).json('wrong email')
}
const token=buf.toString('hex')

const expiredreset=new Date(Date.now() + 900000)
await prisma.user.updateMany({where:{id:finduser.id},data:{resettoken:token,expiredreset}})
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();


const username=finduser.name
console.log(username)
sendSmtpEmail.subject = "Rest Your Password";
sendSmtpEmail.htmlContent = `<h1> resiting your password </h1> <h2> click on the link below to rest your password </h2> <a href='https://modexstore.netlify.app/confirmnewpass?token=${token}&email=${email}'> click here to reset your password  </a>`;
sendSmtpEmail.sender = { "name": "modexstore.netlify.app", "email": "ahmedrmadan251998@gmail.com" };
sendSmtpEmail.to = [{ "email": email, "name": username }];
console.log('succeed')
    try {
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log(" Email sent:", data);
      return res.status(200).json("email has been sent");
    } catch (error) {
      console.error(" Error sending email:", error);
      return res.status(500).json("failed to send email");
    }


})


}

export const confirmnewpass=async (req:Request,res:Response)=>{
    console.log('hello')
const email=req.body.email as string
const token=req.body.token as string
const newpass=req.body.newpass
console.log(email,token)
const finduser=await prisma.user.findFirst({where:{email:email}})
if(!finduser){
     return res.status(403).json('wrong email')
}
if(finduser.resettoken !== token){
     return res.status(406).json('wrong token')
}


if( new Date(Date.now()) >  finduser.expiredreset  ){
return res.status(406).json(' token expired')
}
const bcryptpass=await bcrypt.hash(newpass,10)

await prisma.user.updateMany({where:{id:finduser.id},data:{password:bcryptpass,expiredreset:new Date(Date.now())}})
console.log('password changed')
res.status(200).json('password has been updated')


}