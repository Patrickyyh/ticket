import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from 'mongoose';
import { Message } from "node-nats-streaming";
import {Order} from '../../../models/Order';
import { 
          OrderStatus , 
          OrderCancelledEvent,
          Listener
       }  from "@ticketyyh/common";


jest.mock('../../../nats-wrapper')
const setup =async () => {
    //create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 19,
        userId : 'admin',
        version: 0
    });
    await order.save();


    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket:{
           id: 'fkof'
        }
   }


    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {order, data, msg, listener};
}



it('update the status of the order' , async()=>{
   const  { order, data, msg, listener }  = await setup();
   await listener.onMessage(data,msg);
   const updateOrder = await Order.findById(order.id);
   expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
})



it('ack the messsage', async () => {
    const  { order, data, msg, listener }  = await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
})