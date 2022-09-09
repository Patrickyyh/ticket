import express , {Request, Response} from 'express';
import { body } from 'express-validator';
import { Order } from '../models/Order';
import { NotAuthError, NotFoundError, OrderStatus ,requireAuth } from '@ticketyyh/common';

import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
// cancel the order 

const router = express.Router();
router.delete('/api/orders/:orderId', async (req:Request, res:Response)=>{
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId).populate('ticket');
    if(!order){
        throw new NotFoundError();
    }

    if(order.userId !== req.currentUser!.id){
        throw new NotAuthError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();


    // published event
    const publisher = new OrderCancelledPublisher(natsWrapper.client);
    publisher.publish({
        id: order.id,
        version: order.version,
        ticket:{
            id: order.ticket.id
        }
    })


    res.status(204).send(order);
    
});

export {router as deleteOrderRouter};