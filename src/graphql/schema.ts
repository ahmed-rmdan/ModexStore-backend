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
 
input getwishlistInput{
page:Int
}
 type GetWishListResponse{
 products:[GetProducts],
 length:Int
 }

 type isloginResponse{
 message:String
 
 }

type location{
    longitude:Float,
      latitude:Float
           }

  type order{
  id:String,
    name:String,
    details:String,
    at:String,
    address:String,
    state:String,
    payment:String,
    totalprice:Int,
    location:location 
  }

  input getuserordersInput{
    page:Int
    }


  type getuserordersResponse{
  orders:[order],
  length:Int
  }

  type RootQuery {
    getproducts(input: TypeInput):GetProductsResponse ,
    getadminproducts(input: TypeInput):GetProductsResponse ,
    getalloffers:GetOffersResponse,
    getproduct(input:GetProductInput):GetProductResponse,
    getsearchproducts(input:TypeSearchInput):GetProductsResponse,
    getwishlist(input:getwishlistInput):GetWishListResponse,
    islogin:isloginResponse,
     getadminoffers:GetOffersResponse,
    getuserorders(input:getuserordersInput):getuserordersResponse,
    getadminorders(input:getuserordersInput):getuserordersResponse,
    isadmin:isloginResponse

  }

  input ProductInput {
    name: String
    moreinfo: String
    mainimge: String
    newprice: Int
    oldprice: Int
    sliderimge: [String]
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
        message:String,
        token:String     
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

input deleteorderInput{
  orderid:String
}
 
     type deleteorderResponse{
      message:String
     }

      input editorderInput{
        orderid:String
        state:String
      }
      type editorderResponse{
      message:String
      }
      type loginadminResponse{
      token:String
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
       createorder(input:createorderInput):generalResponse,
       deleteorder(input:deleteorderInput):deleteorderResponse,
       editorder(input:editorderInput):editorderResponse,
        loginadmin(input:LoginInput):loginadminResponse,
          isadmin:isloginResponse

  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)