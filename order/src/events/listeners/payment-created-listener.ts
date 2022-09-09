import {

    Listener,
    OrderStatus,
    PaymentCreatedEvent,
    Subjects
    
} from '@ticketyyh/common'

import { Message } from 'node-nats-streaming'
import { Order } from '../../models/Order'
import { queueGroupName } from './queue-group-name'


export class PaymentCreatedListener extends Listener <PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;
    async onMessage(data:PaymentCreatedEvent['data'],msg:Message){
        const order = await Order.findById(data.orderId);
        if(!order){
            throw Error("Order does not exists !");
        }

        order.set({status: OrderStatus.Complete});
        await order.save();

        msg.ack();

    }
}