import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest';


// beforeAll -> the function be called before every other things
// beforeAll hook 

declare global{
    var signin: ()=> Promise<string[]>
}


let mongo:any;




beforeAll(async ()=>{
    process.env.JWT_KEY = 'fasdfasdf';
    const mongo = MongoMemoryServer.create();
    const mongoUri = (await mongo).getUri();
    await mongoose.connect(mongoUri, {});
    jest.setTimeout(10000);
} )

 
//  run before each test's run 
beforeEach( async()=>{
    // clear the data stored in each collections
    jest.setTimeout(60000);
    const collections = await mongoose.connection.db.collections();
    for(let collection of collections){
        await collection.deleteMany({});
    }
})

 
// run after every test finished  
afterAll(async () => {
    if (mongo) {
      await mongo.stop();
    }
    await mongoose.connection.close();
  });


// helper signin function 




global.signin =async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
    .post('/api/users/signup')
    .send({
        email, password
    })
    .expect(201)

   const cookie = response.get('Set-Cookie');
   return cookie;
   
}
  