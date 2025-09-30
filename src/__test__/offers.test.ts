import request from "supertest";
import {server} from '../../src/index'
describe('offerstests',()=>{
 describe('getoffers',()=>{
    it('offerslength',async()=>{
        const query=`
        query{
        getalloffers{
        products{
        id
        }
        }
        }
        `
        const res=await request(server).post('/graphql').send({query})
        expect(res.body.data.getalloffers.products).toHaveLength(15)
    })
 })

})