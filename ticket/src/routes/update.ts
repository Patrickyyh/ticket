import express, { Request, Response } from 'express';
import { NotFoundError , 
        validateRequest, 
        requireAuth, 
        NotAuthError,
        BadRequestError} from '@ticketyyh/common';
import { Ticket } from '../models/Ticket';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';



const router = express.Router();
router.put('/api/tickets/:id' ,
requireAuth ,
 [ 
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
 ], 
validateRequest ,
async (req:Request, res:Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        throw new NotFoundError();
    }

    if(ticket.orderId){
        throw new BadRequestError('Cannot edit a reserved ticket');
    }

    if(ticket.userId !== req.currentUser!.id){
        throw new NotAuthError();
    }



    ticket.set({
        title: req.body.title,
        price: req.body.price
    });

    // update the ticket
    await ticket.save();

    //publish the event to NATS-streaming server 
    const publisher = new TicketUpdatedPublisher(natsWrapper.client);
    publisher.publish({
      id:    ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    })
    
    res.send(ticket);
})


export {router as updateTicketRouter}