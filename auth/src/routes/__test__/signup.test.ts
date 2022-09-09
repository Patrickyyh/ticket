import { response } from 'express';
import request from 'supertest';
import assert  from 'supertest';
import { app } from '../../app';
  
it('returns a 201 on successful signup',async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email:   'test@test.com',
        password:'testpassword'
    })
    .expect(201); 
})



// test for invalid email
it('returns a 400 with an invalid email',async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email:'testtestcom',
        password:'testpassword'
    })
    .expect(400); 
})


// test for invalid password
it('returns a 400 with an invalid password',async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email:'testtestcom',
        password:''
    })
    .expect(400); 
})


//Requinrg Unique email 

it('disallow duplicate emails',async () => {
     await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:'fefewfdfefee'
    })
    .expect(201); 


    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:'fefewfdfefee'
    })
    .expect(400); 
})




// Test for if cookie has been set up successfully 
it('sets a cookie after a successfull sign up ', async () => {
    const response =  await request(app)
   .post('/api/users/signup')
   .send({
       email:'test@test.com',
       password:'fefewfdfefee'
   })
   .expect(201); 

   expect(response.get('Set-Cookie')).toBeDefined();

})
