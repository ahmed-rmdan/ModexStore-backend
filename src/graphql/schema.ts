import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type RootQuery {
    hello: String
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

  type RootMutation {
    addproduct(input: ProductInput): AddProductResponse
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)