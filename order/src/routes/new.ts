// express and express-validator
import express , {Request, Response} from 'express';
import { body } from 'express-validator';
import {
        BadRequestError, 
        NotFoundError, 
        OrderStatus, 
        requireAuth, 
        validateRequest } from '@ticketyyh/common';

// Mongo related depedency 
import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { Ticket } from '../models/Ticket';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

// rotuer
const router = express.Router();
const expirTime = 15 * 60; 
router.post('/api/orders',
    requireAuth, 
[
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input:string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided')
]
, validateRequest
,async (req:Request, res:Response)=>{
   
    // Find the ticket the user is trying to order in the database
    //  - throw error if 
    const {ticketId} = req.body;
    const ticket = await Ticket.findById(ticketId);
    
    if(!ticket){
        throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved (expires time check)
        // run query to look at all orders
        // Find an order where the ticket is the ticket was just found and 
        // the orders status is not cancelled
        // If we find an order from that means the ticket is reserved. 

    const isReserved = await ticket.isReserved();
    if(isReserved){
        throw new BadRequestError("Ticket is already reserved");
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + expirTime);
    // Build the order and save it to the database 
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });
    await order.save();

    console.log('here');
    // Published and event that saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        userId :order.userId,
        expiresAt : order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    })

    // sending response back to the front-end;

    res.status(201).send(order);

});

export {router as newOrderRouter};