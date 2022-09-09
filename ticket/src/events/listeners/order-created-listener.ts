import {
    Subjects,
    Listener,
    OrderCreatedEvent
} from '@ticketyyh/common'

import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/Ticket'
import { showTicketRouter } from '../../routes/show';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener <OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName
    async onMessage(data:OrderCreatedEvent['data'],msg:Message){
        // find the associate ticket that the order is reserving 
        const { ticket } = data;
        const findTicket  = await Ticket.findById(ticket.id);

        // If no ticket, throw error
        if(!findTicket){
            throw new Error('Ticket not Found');
        }
        // Mark the ticket as being resrved by setting its orderId property
        findTicket.set({orderId : data.id})

        // Save the ticket 
        await findTicket.save();

        // published the TicketUpdated event
        new TicketUpdatedPublisher(this.client).publish({
            id:     findTicket.id,
            price:  findTicket.price,
            title:  findTicket.title,
            userId: findTicket.userId,
            orderId:findTicket.orderId,
            version:findTicket.version
        });
        // ack the message
        msg.ack();

    }

}

