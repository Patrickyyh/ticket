import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { 
         OrderCreatedEvent,
         OrderStatus  
} from "@ticketyyh/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/Order";

jest.mock('../../../nats-wrapper')

const setup =async () => {
    //create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'FSEE',
        expiresAt: 'string',
        ticket: {
            id:'ticketname',
            price: 10
        }
    }

    // @ts-ignore
    const msg : Message = {
        ack : jest.fn()
    }
    return {listener ,data, msg };

}

it('replicate the order info',async () => {
        const { listener , data, msg } = await setup();
        await listener.onMessage(data,msg);

        const findOrder = await Order.findById(data.id);
        expect(findOrder!.price).toEqual(data.ticket.price);
})



it('it acks the message',async () => {
    const {listener ,data, msg} = await setup();
    
    //call the onMessage function with data object + message object
    await listener.onMessage(data,msg);

    //write assertion to make sure ack function is called 
    expect(msg.ack).toHaveBeenCalled();

})




