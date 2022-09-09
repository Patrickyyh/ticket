import { OrderStatus } from '@ticketyyh/common';
import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../../app';
import {Order} from '../../models/Order';
import { Ticket } from '../../models/Ticket';

import { natsWrapper } from '../../nats-wrapper';
jest.mock('../../nats-wrapper');

const buildTicket = async ()=>{
    const ticket = Ticket.build({
        title: 'concert',
        price:20,
        id: new mongoose.Types.ObjectId().toHexString(),
    })

    await ticket.save();
    return ticket;
}




it('marks an order as cancelled', async() =>{
    // create a ticket with Ticket model
    const ticketSample = await buildTicket();  
    const userone = global.signin()  


    // make a reques to create a order
    const { body } = await request(app)
    .post('/api/orders')
    .set('Cookie',userone)
    .send({ticketId: ticketSample.id})
    .expect(201);
    const orderId = body.id;

    // make a request to cancel the order 
    await request(app)
           .delete(`/api/orders/${orderId}`)
           .set('Cookie',userone)
           .expect(204)


    //expectation to make sure the thing is cancelled
    const updatedOrder = await Order.findById(orderId);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);


})


it('emits an event when delete the ticket' ,async () => {
    const ticketSample = await buildTicket();  
    const userone = global.signin()  
    const natsWrapperSpy = jest.spyOn(natsWrapper.client, "publish");

    // make a reques to create a order
    const { body } = await request(app)
    .post('/api/orders')
    .set('Cookie',userone)
    .send({ticketId: ticketSample.id})
    .expect(201);
    const orderId = body.id;

    // make a request to cancel the order 
    await request(app)
           .delete(`/api/orders/${orderId}`)
           .set('Cookie',userone)
           .expect(204)


    expect(natsWrapper.client.publish).toHaveBeenCalled();
    expect(natsWrapperSpy.mock.calls[1][0]).toEqual('order:cancelled');

})