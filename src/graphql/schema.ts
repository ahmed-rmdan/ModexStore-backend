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
 type singleproduct{
   id:String
    name: String
    moreinfo: String
    mainimg: String
    newprice: Int
    oldprice: Int
    slideimg: String
    type: String 
    offer:Boolean 
    isfav:Boolean
}
 input TypeInput{
 type:String
 activepage:Int
 }  

type GetOffersResponse{
 products:[GetProducts]
}
 type GetProductResponse{
 product:singleproduct
}
input GetProductInput{
 id:String!
}
 input TypeSearchInput{
 search:String
 activepage:Int
 }  
 

 type GetWishListResponse{
 products:[GetProducts]
 }

 type isloginResponse{
 message:String
 
 }

  type RootQuery {
    getproducts(input: TypeInput):GetProductsResponse ,
    getalloffers:GetOffersResponse,
    getproduct(input:GetProductInput):GetProductResponse,
    getsearchproducts(input:TypeSearchInput):GetProductsResponse,
    getwishlist:GetWishListResponse,
    islogin:isloginResponse
  

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
   
    input CreateUserInput{
     name:String
       username: String
      password:String
      confirmpassword:String
       email:String
    telphone:String
    }
    type CreateUserResponse{
        message:String      
    }
        input LoginInput{
      username:String
    password:String
       }
    type LoginResponse{
      token:String,
    userid:String,
    name:String
        }

    input WishListInput{
    userid:String
    productid:String
    
    }

   type WishListResponse{
   message:String
    }
   input wishlistactionInput{
    productid:String
   }

   type wishlistactionResponse{
   message:String
   }

type items{
id:String,
quantity:Int
}   
input orderproducts{
productid:String,
quantity:Int
}
input orderlocation{
longitude:Float,
latitude:Float
}
input createorderInput{
items : [orderproducts]
address : String
location: orderlocation
}
type generalResponse{
message:String
}

  type RootMutation {
    addproduct(input: ProductInput): AddProductResponse,
     deleteproduct(input:DeleteProductInput) : DeleteProductResponse,
     editproduct(input:EditProductInput) : EditPropductResponse,
     createuser(input:CreateUserInput):CreateUserResponse,
       login(input:LoginInput):LoginResponse,
       addwishlist(input:WishListInput):WishListResponse,
       wishlistaction(input:wishlistactionInput):wishlistactionResponse,
       islogin:isloginResponse,
       createorder(input:createorderInput):generalResponse

  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)