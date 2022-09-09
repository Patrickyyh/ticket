import { Listener } from "./base-listener";
import {Message} from 'node-nats-streaming'
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-creted-event";


export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    // make sure that the subject will always equal to ticketCreated
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = 'payments-srv';
    onMessage(data:TicketCreatedEvent['data'] ,msg:Message){
        console.log('Event data!', data);
        msg.ack();
    }

}
