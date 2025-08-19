import { PrismaClient } from "@prisma/client";
const prisma =new PrismaClient()
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

  const data = {
    name: input.name,
    type: input.type,
    mainimg:  "no-image.png",
    moreinfo: input.moreinfo,
    newprice: input.newprice,
    oldprice: input.oldprice,
    slideimg: input.sliderimge,
    offer,
  };

  console.log("Data to insert:", data);

try {
   const newproduct= await prisma.product.create({ data });
  return { message: "product has been added", id:newproduct.id };
} catch (err) {
  console.error("Prisma Error:", err);
  throw err;
}
}



}