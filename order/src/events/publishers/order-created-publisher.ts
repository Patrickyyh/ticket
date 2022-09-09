import { Publisher , Subjects,  OrderCreatedEvent} from "@ticketyyh/common";

export class OrderCreatedPublisher extends Publisher <OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}