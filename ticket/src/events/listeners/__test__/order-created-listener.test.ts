import { OrderCreatedListener } from "../order-created-listener";
import { OrderCreatedEvent } from "@ticketyyh/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/Ticket";
import { OrderStatus } from "@ticketyyh/common";
import mongoose from "mongoose";

jest.mock('../../../nats-wrapper')

const setup =async () => {
    //create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price:  99,
        userId: 'FSEE'
    });
    await ticket.save();

    // create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'FSEE',
        expiresAt: 'string',
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    }

    // @ts-ignore
    const msg : Message = {
        ack : jest.fn()
    }


    return {listener , ticket , data, msg };

}


it('sets the userId of the tikcet',async () => {
    const {listener , ticket , data, msg} = await setup();
    
    await listener.onMessage(data,msg);

    // 
    const updateTicket = await Ticket.findById(ticket.id);
    expect(updateTicket!.orderId).toBeDefined();
    expect(updateTicket!.orderId).toEqual(data.id)

})




it('it acks the message',async () => {
    const {listener , ticket , data, msg} = await setup();
    
    //call the onMessage function with data object + message object
    await listener.onMessage(data,msg);

    //write assertion to make sure ack function is called 
    expect(msg.ack).toHaveBeenCalled();
})


it('publishes a ticket updated event', async () => {
    const {listener , ticket , data, msg} = await setup();
    await listener.onMessage(data,msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
 
    //@ts-ignore
    const ticketUpdatedData = JSON.parse(natsWrapper.client.publish.mock.calls[0][1]);
    expect(data.id).toEqual(ticketUpdatedData.orderId);
})