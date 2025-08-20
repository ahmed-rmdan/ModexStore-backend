import { PrismaClient } from "@prisma/client";
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
  type User = {
  id: number;
  name: string;
  email: string;
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
}



}