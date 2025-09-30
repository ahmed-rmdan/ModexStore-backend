
import request from "supertest";
import {server} from '../../src/index'
describe('graphqltests',()=>{
    describe('getproducts',()=>{
           it('get single product',async()=>{
          const query=`
          query{
          getproduct(input:{id:"0bf12f73-300e-4327-a968-a50ba3f60210"}){
          product{
          name
          }
          }
          
          }


          `
         const res=await request(server).post('/graphql').send({query})
          expect(res.body.data.getproduct.product.name).toBe('Round Neck Cotton T-Shirt')

           })
        


    })
})