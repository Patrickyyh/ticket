import { OrderStatus } from '@ticketyyh/common';
import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../../app';
import {Order} from '../../models/Order';
import {Ticket} from '../../models/Ticket';
import { natsWrapper } from '../../nats-wrapper';

jest.mock('../../nats-wrapper');

it('returns an error if the ticket doew not exit',async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
        ticketId
    })
    .expect(404);


});


it('returns an error if the ticket is already reserved',async () => {
    // create the ticket 
    const ticket = Ticket.build({
        title: 'kendricke lamar concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();
    
    // created the order
    const order = Order.build({
        ticket,
        userId: 'fojijfiefe',
        status: OrderStatus.Created,
        expiresAt: new Date()
    })
    await order.save();
    
    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(400);

    
});


it('reserve a ticket',async () => {
    const ticket = Ticket.build({
        title: 'kendricke lamar concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();
    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(201);
});


it('emits an order created event' , async() => {

    const natsWrapperSpy = jest.spyOn(natsWrapper.client, "publish");
    const ticket = Ticket.build({
        title: 'kendricke lamar concert',
        price: 100,
        id: new mongoose.Types.ObjectId().toHexString(),
        
    });

    await ticket.save();
    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(201);
    

    // test for the nats 
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    expect(natsWrapperSpy.mock.calls[0][0]).toEqual('order:created');

});




