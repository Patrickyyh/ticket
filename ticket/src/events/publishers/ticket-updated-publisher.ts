import { 
        Publisher,
        Subjects, 
        TicketUpdatedEvent
} from "@ticketyyh/common";    

export class TicketUpdatedPublisher extends Publisher <TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}