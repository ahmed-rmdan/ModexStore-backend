import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { io } from "..";

export const prisma =new PrismaClient()
type ProductInput = {
  name: string;
  moreinfo: string;
  mainimge: string;
  newprice: number;
  oldprice: number;
  sliderimge: string[];
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
type createrderinput={
items:{productid:string,quantity:number}[],
address:string,
location:{longitude:number,latitude:number}|null

}
export const resolver={
    hello:()=>'hello',

addproduct: async ({ input }: { input: ProductInput },context: {user:null|string}) => {
  if(!context.user){
                     throw new GraphQLError("not authorized", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              }); 
       }
       const finduser=await prisma.user.findUnique({where:{id:context.user}})
       if(finduser?.username!=='adminn'){
                   throw new GraphQLError("you are not the admin", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              }); 
       }

  let offer = false;
  if (input.oldprice !== input.newprice) {
    offer = true;
  }
  const slideimg=input.sliderimge.join(',')
console.log(input.oldprice !== input.newprice)
  const data = {
    name: input.name,
    type: input.type,
    mainimg:  "no-image.png",
    moreinfo: input.moreinfo,
    newprice: input.newprice,
    oldprice: input.oldprice,
    slideimg,
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
getadminproducts:async ({input}:{input:{type:string,activepage:number}},context: {user:null|string})=>{
       if(!context.user){
                     throw new GraphQLError("not authorized", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              }); 
       }
       const finduser=await prisma.user.findUnique({where:{id:context.user}})
       if(finduser?.username!=='adminn'){
                   throw new GraphQLError("you are not the admin", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              }); 
       }


 
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
getalloffers:async (input:any)=>{



const data= await prisma.product.findMany({where:{offer:true}})
return {products:data}
},
getadminoffers:async (input:any,context:{user:string|null})=>{
    if(!context.user){
                     throw new GraphQLError("not authorized", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              }); 
       }
       const finduser=await prisma.user.findUnique({where:{id:context.user}})
       if(finduser?.username!=='adminn'){
                   throw new GraphQLError("you are not the admin", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              }); 
       }

const data= await prisma.product.findMany({where:{offer:true}})
return {products:data}
},
getproduct:async ({input}:{input:{id:string}},context:{user:string|null})=>{
          
           let isfav:boolean=false
           const product=await prisma.product.findUnique({where:{id:input.id}})
           if(!context.user){
           
          console.log(product)
          return {product:{...product,isfav:false}};
           }
           const isexist=await prisma.wishlist.findFirst({where:{userid:context.user,productid:product?.id as string}})
           if(!isexist){
            return {product:{...product,isfav}};
           }
           isfav=true;
           return {product:{...product,isfav}};
          
},
deleteproduct:async ({input}:{input:{id:string}},context:{user:string|null})=>{
      if(!context.user){
                     throw new GraphQLError("not authorized", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              }); 
       }
       const finduser=await prisma.user.findUnique({where:{id:context.user}})
       if(finduser?.username!=='adminn'){
                   throw new GraphQLError("you are not the admin", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              }); 
       }
           console.log(input.id)
          await prisma.product.delete({where:{id:input.id}})
          
          return {message:'product has been deleted'};
},

editproduct: async ({ input }: { input: EditProductInput },context:{user:string|null}) => {
    if(!context.user){
                     throw new GraphQLError("not authorized", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              }); 
       }
       const finduser=await prisma.user.findUnique({where:{id:context.user}})
       if(finduser?.username!=='adminn'){
                   throw new GraphQLError("you are not the admin", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              }); 
       }


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
 
    
  const data= await prisma.product.findMany({where:{name:{contains:input.search}},skip:(input.activepage-1)*4,take:4})
  const length= (await prisma.product.findMany({where:{name:{contains:input.search}}})).length
  return {products:data,length}


},
createuser:async ({input}:{input:User})=>{
 

  
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

             const bcyptpass= await bcrypt.hash(input.password,10)

      const newuser= await prisma.user.create({data:{name:input.name,username:input.username,password:bcyptpass,email:input.email,telphone:input.telphone}})
           console.log(newuser)


          const token=jwt.sign({userid:newuser.id},'veryverysecret',{expiresIn:'1h'})

          return {message:'creeated new user',token}}
          ,
          
          
          login :async ({input}:{input:{username:string,password:string}})=>{
       
           
       const finduser=await prisma.user.findFirst({where:{username:input.username}})
       if(!finduser){
                   throw new GraphQLError("UserName is not correct", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
       }

     
        
         const coreectpass=await bcrypt.compare(input.password,finduser.password as string)
         if(!coreectpass){
                         throw new GraphQLError("password is not correct", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
         }

        const token=jwt.sign({userid:finduser.id},'veryverysecret',{expiresIn:'1h'})
          
        return {token,userid:finduser.id,name:finduser.name}
                   
},
getwishlist:async ({input}:{input:{page:number}},context : {user:null|string})=>{
            const userid=context.user
            if (!userid){
                    throw new GraphQLError("not authorized", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
            }
            const user=await prisma.user.findUnique({where:{id:userid},include:{wishlist:true}})
            const userwishlist=user?.wishlist
            if(!userwishlist){
         
              return {products:[]}
            }

            let wishlistproductid:string[]=[];

            userwishlist.forEach(elm=>{
              wishlistproductid.push(elm.productid)
            })
       
            const wishlistproducts=await prisma.product.findMany({where:{id:{in:wishlistproductid}},skip:(input.page-1)*6,take:6})
           
            return {products:wishlistproducts,length:userwishlist.length}


},
wishlistaction:async ({input}:{input:{productid:string}},context : {user:null|string})=>{
            const userid=context.user
            if (!userid){
                    throw new GraphQLError("not authorized", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
            }
          
             const ifexist=await prisma.wishlist.findFirst({where:{userid,productid:input.productid}})

             if(!ifexist){
              await prisma.wishlist.create({data:{productid:input.productid,userid}})
              return {message:'wishlist added'}
             }
             await prisma.wishlist.delete({where:{id:ifexist?.id }})
           return {message:'wishlist remove'}


},
islogin:async (input:any,context : {user:null|string})=>{
            const userid=context.user
      
            if (!userid){
                    throw new GraphQLError("not authorized", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
            }
            console.log('sucess')
          
           return {message:'you are authorized'}
            }
,
createorder:async ({input}:{input:createrderinput},context : {user:null|string})=>{
            const userid=context.user
     
            if (!userid){
                    throw new GraphQLError("not authorized", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
            }
               const curruser=await prisma.user.findUnique({where:{id:userid}})
                            
                               const productsid= input.items.map(elm=>{
                                return elm.productid
                               })
                               console.log(productsid)
                            const products=await prisma.product.findMany({where:{id:{in:productsid}}})
                            let totalprice:number=0
                               
                            products.forEach((product,i)=>{
                                 totalprice=totalprice+( product.newprice*(input.items[i]?.quantity as number))
                            })
                            
                           let details:string=''
                           input.items.forEach((item,i)=>{
                           
                           if(i===products.length-1){
                            details=details+`${item.quantity} X ${products[i]?.name}`
                           }else{
                            details=details+`${item.quantity} X ${products[i]?.name} + `
                           }

                           })
                           
                           if(!input.location){
                             const order= await prisma.order.create({data:{userid,name:curruser?.name as string,totalprice,details,payment:'On Delivery',state:'Processing',adress:input.address}})
                              console.log(order)
                             return{message:'order has been created'}
                           }
                     const location=await prisma.location.create({data:{latitude:input.location.latitude,longitude:input.location.longitude}})

                 const order= await prisma.order.create({data:{userid,name:curruser?.name as string,totalprice,details,payment:'On Delivery'
                  ,state:'Processing',adress:input.address,locationid:location.id}})
                  
                 console.log(order)

                      
                   

                 return{message:'order has been created'}
          
            },
            getuserorders:async ({input}:{input:{page:number}},context : {user:null|string})=>{
      
            const userid=context.user
        
            if (!userid){
                    throw new GraphQLError("not authorized", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
            }
            try{
                    const orderslength=(await prisma.order.findMany({where:{userid}})).length
                     const orders=await prisma.order.findMany({where:{userid},include:{location:true},skip:(input.page-1)*6,take:6})
                             

                const userorders=orders.map((elm)=>{
                   const at=elm.date.toLocaleDateString("en-GB",{ day: "2-digit", month: "2-digit", year: "numeric"})
                    if(!elm.location){
                       return {id:elm.id,name:elm.name,at,address:elm.adress,state:elm.state,payment:elm.payment,
                    totalprice:elm.totalprice,details:elm.details,location:null}
                    }else{
                        return {id:elm.id,name:elm.name,at,address:elm.adress,state:elm.state,payment:elm.payment,
                    totalprice:elm.totalprice,details:elm.details,location:{longitude:elm.location?.longitude,latitude:elm.location?.latitude}}
                    }
                  
                })
               console.log('sucess')
                      console.log(userorders)
                return {orders:userorders,length:orderslength}
            }catch(err){
              console.log(err)
            }
             
          
           
            },
      
     getadminorders:async ({input}:{input:{page:number}},context : {user:null|string})=>{
              
            const userid=context.user

            if (!userid){
                    throw new GraphQLError("not authorized", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
            }
                    const finduser=await prisma.user.findUnique({where:{id:userid}})
                  if(finduser?.username!=='adminn'){
                   throw new GraphQLError("you are not the admin", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              }); 
               }

            try{
                        const orderslegnth=(await prisma.order.findMany()).length
                     const orders=await prisma.order.findMany({include:{location:true},skip:((input.page-1)*3),take:3})
                 

                const adminorders=orders.map((elm)=>{
                   const at=elm.date.toLocaleDateString("en-GB",{ day: "2-digit", month: "2-digit", year: "numeric"})
                    if(!elm.location){
                       return {id:elm.id,name:elm.name,at,address:elm.adress,state:elm.state,payment:elm.payment,
                    totalprice:elm.totalprice,details:elm.details,location:null}
                    }else{
                        return {id:elm.id,name:elm.name,at,address:elm.adress,state:elm.state,payment:elm.payment,
                    totalprice:elm.totalprice,details:elm.details,location:{longitude:elm.location?.longitude,latitude:elm.location?.latitude}}
                    }
                  
                })
               console.log('sucess')

                return {orders:adminorders,length:orderslegnth}
            }catch(err){
              console.log(err)
            }
             
          
           
            },
          deleteorder:async ({input}:{input:{orderid:string}},context : {user:null|string})=>{
            
            const userid=context.user

            if (!userid){
                    throw new GraphQLError("not authorized", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
            }
                      const finduser=await prisma.user.findUnique({where:{id:userid}})
                  if(finduser?.username!=='adminn'){
                   throw new GraphQLError("you are not the admin", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              }); 
               }
            try{
                       const order=await prisma.order.findUnique({where:{id:input.orderid,},include:{location:true}})
                       if(!order?.location){
                        await prisma.order.delete({where:{id:input.orderid}}) 
                         return {message:'order has been deleted'}
                       }
                         await prisma.location.delete({where:{id:order.location.id}})
                          await prisma.order.delete({where:{id:input.orderid}}) 
                return {message:'order has been deleted'}

            }catch(err){
                          throw new GraphQLError("somthing wet wrong", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
            }
          })
        }
           
            },
            editorder:async ({input}:{input:{orderid:string,state:string}},context : {user:null|string})=>{
              
            const userid=context.user
       
            if (!userid){
                    throw new GraphQLError("not authorized", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
            }

         const finduser=await prisma.user.findUnique({where:{id:userid}})
                 if(finduser?.username!=='adminn'){
                   throw new GraphQLError("you are not the admin", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              }); 
               }

            try{

                 await prisma.order.update({where:{id:input.orderid},data:{state:input.state}}) 
                   const order=await prisma.order.findUnique({where:{id:input.orderid}})
                     const orderuserid=order!.userid
                      const userorders=await prisma.order.findMany({where:{userid:orderuserid}})

                       console.log('the userid',orderuserid)
                 io.to(orderuserid as string).emit('getorders',{orders:userorders})
                return {message:'order has been edited'}
            }catch(err){
                          throw new GraphQLError("somthing wet wrong", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
            }
          })
        }
           
            },

          loginadmin:async({input}:{input:{username:string,password:string}})=>{
            console.log(input)
           
       const finduser=await prisma.user.findFirst({where:{username:input.username}})
       if(!finduser){
                   throw new GraphQLError("UserName is not correct", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
       }
       console.log('1')
           
       if(finduser.username!=='adminn'){
                             throw new GraphQLError("you are not the admin", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
       }
                 
         const coreectpass=await bcrypt.compare(input.password,finduser.password as string)
         if(!coreectpass){
                         throw new GraphQLError("password is not correct", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
         }
         console.log('2')
        const token=jwt.sign({userid:finduser.id},'veryverysecret',{expiresIn:'1h'})
          
        return {token}
                   
},
isadmin:async (input:any,context : {user:null|string})=>{
            const userid=context.user
            console.log(userid)
            if (!userid){
                    throw new GraphQLError("not authorized", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
            }
            const finduser=await prisma.user.findUnique({where:{id:userid}})
            if(finduser?.username!=='adminn'){
                         throw new GraphQLError("not you are not the admin", {
              extensions: {
           code: "BAD_USER_INPUT",
           http: { status: 409 }, 
             }
              });
            }
            console.log('sucess')
          
           return {message:'you are the admin'}
            }
,



}

