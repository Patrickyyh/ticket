import  {
    Publisher,
    Subjects, 
    PaymentCreatedEvent
} from '@ticketyyh/common';

export class PaymentCreatedPublisher extends Publisher <PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
};




