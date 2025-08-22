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
 input TypeSearchInput{
 search:String
 activepage:Int
 }  
 
  type RootQuery {
    getproducts(input: TypeInput):GetProductsResponse ,
    getalloffers:GetOffersResponse,
    getproduct(input:GetProductInput):GetProductResponse,
    getsearchproducts(input:TypeSearchInput):GetProductsResponse

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
  input EditProductInput{
      id:String
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
     type EditPropductResponse{
      message: String,
      id:String
    }  
 
    
  type RootMutation {
    addproduct(input: ProductInput): AddProductResponse,
     deleteproduct(input:DeleteProductInput) : DeleteProductResponse,
     editproduct(input:EditProductInput) : EditPropductResponse
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)