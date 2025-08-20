import { buildSchema } from "graphql";

export const schema = buildSchema(`
type GetProducts{
   id:String
    name: String
    moreinfo: String
    mainimg: String
    newprice: Int
    oldprice: Int
    slideimg: String
    type: String 
    offer:Boolean 
}
type GetProductsResponse{
 products:[GetProducts],
 length:Int
}
 input TypeInput{
 type:String
 activepage:Int
 }  

type GetOffersResponse{
 products:[GetProducts]
}
 type GetProductResponse{
 product:GetProducts
}
input GetProductInput{
 id:String!
}

  type RootQuery {
    hello: String,
    getproducts(input: TypeInput):GetProductsResponse ,
    getalloffers:GetOffersResponse,
    getproduct(input:GetProductInput):GetProductResponse
  }

  input ProductInput {
    name: String
    moreinfo: String
    mainimge: String
    newprice: Int
    oldprice: Int
    sliderimge: String
    type: String  
  }

  type AddProductResponse { 
    message: String ,
     id:String
  }
   input DeleteProductInput{
     id:String
   } 

    type DeleteProductResponse{
      message: String
    }  
    
  type RootMutation {
    addproduct(input: ProductInput): AddProductResponse,
     deleteproduct(input:DeleteProductInput) : DeleteProductResponse
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)