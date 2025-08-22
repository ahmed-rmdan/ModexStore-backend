import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";
import validator from 'validator'
import bcrypt from 'bcrypt'

export const prisma =new PrismaClient()
type ProductInput = {
  name: string;
  moreinfo: string;
  mainimge: string;
  newprice: number;
  oldprice: number;
  sliderimge: string;
  type: string;
};
type EditProductInput ={
  id:string;
  name: string;
  moreinfo: string;
  mainimge: string;
  newprice: number;
  oldprice: number;
  sliderimge: string;
  type: string;
}
  type User = {
  name: string;
   username:string,
   password:string,
   confirmpassword:string,
  email: string,
  telphone:string
}

export const resolver={
    hello:()=>'hello',

addproduct: async ({ input }: { input: ProductInput }) => {
  let offer = false;
  if (input.oldprice !== input.newprice) {
    offer = true;
  }
console.log(input.oldprice !== input.newprice)
  const data = {
    name: input.name,
    type: input.type,
    mainimg:  "no-image.png",
    moreinfo: input.moreinfo,
    newprice: input.newprice,
    oldprice: input.oldprice,
    slideimg: input.sliderimge,
    offer:offer
  };

  console.log("Data to insert:", data);

try {
   const newproduct= await prisma.product.create({ data });
  return { message: "product has been added", id:newproduct.id };
} catch (err) {
  console.error("Prisma Error:", err);
  throw err;
}
},
getproducts:async ({input}:{input:{type:string,activepage:number}})=>{
  console.log(input.type)
if (input.type==='allproducts'){
  const data= await prisma.product.findMany({skip:(input.activepage-1)*4,take:4})
  const length=(await prisma.product.findMany()).length
  return {products:data,length }

}if(input.type==='offers'){
   const data= await prisma.product.findMany({where:{offer:true},skip:(input.activepage-1)*4,take:4})
    const length=(await prisma.product.findMany({where:{offer:true}})).length
  return {products:data,length}
}
else{
  const data= await prisma.product.findMany({where:{type:input.type},skip:(input.activepage-1)*4,take:4})
  const length= (await prisma.product.findMany({where:{type:input.type}})).length
  return {products:data,length}
}

},
getalloffers:async ()=>{
const data= await prisma.product.findMany({where:{offer:true}})
return {products:data}
},
getproduct:async ({input}:{input:{id:string}})=>{
           console.log(input.id)
          const product=await prisma.product.findUnique({where:{id:input.id}})
          console.log(product)
          return {product};
},
deleteproduct:async ({input}:{input:{id:string}})=>{
           console.log(input.id)
          await prisma.product.delete({where:{id:input.id}})
          
          return {message:'product has been deleted'};
},

editproduct: async ({ input }: { input: EditProductInput }) => {
  let offer = false;
      const data = {
        id:input.id,
    name: input.name,
    type: input.type,
    mainimg:  "no-image.png",
    moreinfo: input.moreinfo,
    newprice: input.newprice,
    oldprice: input.oldprice,
    slideimg: input.sliderimge,
    offer:offer
       };
           
          if(data.name!==''){
                await prisma.product.update({where:{id:data.id},data:{name:data.name}});
                
           }
            if(data.type!==''){
                await prisma.product.update({where:{id:data.id},data:{type:data.type}});
           }
           if(data.moreinfo!==''){
                await prisma.product.update({where:{id:data.id},data:{moreinfo:data.moreinfo}});
           }
             if(data.newprice!==0){
                await prisma.product.update({where:{id:data.id},data:{newprice:data.newprice}});
           }
              if(data.oldprice!==0){
                await prisma.product.update({where:{id:data.id},data:{oldprice:data.oldprice}});
           }
              if(data.slideimg!==''){
                await prisma.product.update({where:{id:data.id},data:{slideimg:data.slideimg}});
           }
          
                const editedproduct=await prisma.product.findUnique({where:{id:data.id}})
                if(editedproduct?.oldprice!==editedproduct?.newprice){
                  console.log(true)
                  await prisma.product.update({where:{id:data.id},data:{offer:true}});
                }else{
                   console.log(false)
                  await prisma.product.update({where:{id:data.id},data:{offer:false}});
                }
            
           return { message: "product has been edited", id:data.id };

},
getsearchproducts:async ({input}:{input:{search:string,activepage:number}})=>{
  console.log(input.search)
    
  const data= await prisma.product.findMany({where:{name:{contains:input.search}},skip:(input.activepage-1)*4,take:4})
  const length= (await prisma.product.findMany({where:{name:{contains:input.search}}})).length
  return {products:data,length}


},
createuser:async ({input}:{input:User})=>{
 
     console.log(input)
  
         if(!validator.isLength(input.username, { min: 6, max: 20 })){
               throw new GraphQLError("please enter a username from 6 to 20 hcarcter", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              }); 
         }

      const findusername=await prisma.user.findFirst({where:{username:input.username}})
          if(findusername){
            throw new GraphQLError("Username already exists", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });   
          }    
         
               if(!validator.isLength(input.password, { min: 6, max: 20 })){
               throw new GraphQLError("please enter a password from 6 to 20 hcarcter", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              }); 
         }


            if(input.password!==input.confirmpassword){
            throw new GraphQLError("Please enter similiar password", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
          }
                  if(!validator.isEmail(input.email)){
                        throw new GraphQLError("ENTER A VALID EMAIL", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
                  }
           const findemail=await prisma.user.findFirst({where:{email:input.email}})
               if(findemail){
            throw new GraphQLError("Email already exists", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
          }

             const bcyptpass= await bcrypt.hash(input.password,20)

      const newuser= await prisma.user.create({data:{name:input.name,username:input.username,password:bcyptpass,email:input.email,telphone:input.telphone}})
           console.log(newuser)
          return {message:'creeated new user'}


},


}