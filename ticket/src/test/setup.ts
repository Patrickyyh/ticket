import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest';
import jwt from 'jsonwebtoken';

// beforeAll -> the function be called before every other things
// beforeAll hook 

declare global{
    var signin: ()=>string[]
}


let mongo:any;
beforeAll(async ()=>{
    process.env.JWT_KEY = 'fasdfasdf';
    const mongo = MongoMemoryServer.create();
    const mongoUri = (await mongo).getUri();
    await mongoose.connect(mongoUri, {});
   
} )

 
//  run before each test's run 
beforeEach( async()=>{
    // clear the data stored in each collections
    jest.setTimeout(60000);
    jest.clearAllMocks();

    const collections = await mongoose.connection.db.collections();
    for(let collection of collections){
        await collection.deleteMany({});
    }
})

 
// run after every test finished  
afterAll(async () => {
    await mongoose.connection.close();
    if (mongo) {
      await mongo.stop();
    }
   
  });


// helper signin function 
global.signin = () => {
    
    // generate random id

    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
    }
    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };
  
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);
  
    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');
  
    // return a string thats the cookie with the encoded data
    return [`session=${base64}`];

}
  