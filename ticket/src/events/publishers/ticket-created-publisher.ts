import  {
    Publisher,
    Subjects, 
    TicketCreatedEvent
} from '@ticketyyh/common';
export class TicketCreatedPublisher extends Publisher <TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}



