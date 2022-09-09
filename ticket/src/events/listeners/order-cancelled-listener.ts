import{
    Subjects,
    Listener,
    OrderCancelledEvent
} from '@ticketyyh/common'


import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/Ticket'
import { queueGroupName } from './queue-group-name'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName; 

    async onMessage(data: OrderCancelledEvent['data'],msg:Message) 
    {
        const { ticket } = data;
        const findTicket = await Ticket.findById(ticket.id);

        // If no ticket throw an error
        if(!findTicket){
            throw new Error('Ticket not Found !');
        }

        // set orderId to undefined to notify that order to this ticket has been 
        // cancelled
        findTicket.set({orderId: undefined});
        await findTicket.save();

        // published the TicketUpdated event to notify the other service 
        new TicketUpdatedPublisher(this.client).publish({
            id:     findTicket.id,
            price:  findTicket.price,
            title:  findTicket.title,
            userId: findTicket.userId,
            orderId:findTicket.orderId,
            version:findTicket.version
        })

        msg.ack();
        
    }


}