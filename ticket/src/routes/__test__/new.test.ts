import request from 'supertest';
import {app} from '../../app'
import {Ticket} from '../../models/Ticket'
import  {natsWrapper} from '../../nats-wrapper';

jest.mock('../../nats-wrapper');
it('has a router handler listening to /api/tickets for post request', async ()=>{

    const response =  await request(app).post('/api/tickets').send({});
    expect(response.status).not.toEqual(404);
})


// authorized test 1
it('can only be accessed if the user is signed in', async ()=>{
  // we expect it to get 401
    const response = await request(app)
    .post('/api/tickets')
    .send({});
    expect(response.status).toEqual(401);
})

// authorized test 2
it('returns a status other than 401 is the user is signed in', async ()=>{
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({});
    expect(response.status).not.toEqual(401);
})


it('return an erro if an invalid title is provided', async ()=>{
    await request (app)
    .post('/api/tickets')
    .set('Cookie' ,global.signin())
    .send({
        title: '',
        price: 10
    })
    expect(400);

    await request(app)
    .post('/api/tickets')
    .set('Cookie' ,global.signin())
    .send({
        price: 10
    })
    .expect(400);


})

it('return an errro if an invalid price is provided', async ()=>{
    await request (app)
    .post('/api/tickets')
    .set('Cookie' ,global.signin())
    .send({
        title: 'test',
        price: -10
    })
    expect(400);

    await request(app)
    .post('/api/tickets')
    .set('Cookie' ,global.signin())
    .send({
        title: 'test'
    })
    .expect(400);
})


it('creates a ticket with valid parameters', async ()=>{

    // add in check to make sure the ticket was saved 

    // retrive all the tickets from the mongodb 
    // in this case only could be equal to 0; 
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    const title ="test";

    await request (app)
    .post('/api/tickets')
    .set('Cookie' ,global.signin())
    .send({
        title,
        price: 10
    })
    expect(201);

    // retrive the specific ticket to make sure it is there 
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(10);
    expect(tickets[0].title).toEqual(title);

})

it('publishes an event' ,async () => {

    const title = 'asldkfj';

    await request (app)
    .post('/api/tickets')
    .set('Cookie' ,global.signin())
    .send({
        title,
        price: 10
    })
    expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})