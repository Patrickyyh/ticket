import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent } from "@ticketyyh/common";
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/Ticket";
import mongoose from 'mongoose';
import { Message } from "node-nats-streaming";


jest.mock('../../../nats-wrapper')

const setup =async () => {
    //create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

     // Create and save a ticket
     const orderId = new mongoose.Types.ObjectId().toHexString();
     const ticket = Ticket.build({
         title: 'concert',
         price:  99,
         userId: 'FSEE',
     });

     ticket.set({orderId});
     await ticket.save();

     // create the fake data event
    const data: OrderCancelledEvent['data'] = {
         id: orderId,
         version: 0,
         ticket:{
            id: ticket.id
         }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
     
    return {listener , ticket , data , msg, orderId};
}



it('updates the ticket, published an event, and ack the message',async () => {
    
    const {listener , ticket , data , msg, orderId} = await setup();
    await listener.onMessage(data,msg);
    const updateTicket = await Ticket.findById(ticket.id);
    expect(updateTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();

})
