import { Publisher , Subjects,  OrderCancelledEvent} from "@ticketyyh/common";

export class OrderCancelledPublisher extends Publisher <OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}