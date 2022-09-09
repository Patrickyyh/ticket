import {
    Publisher,
    Subjects,
    ExpirationCompleteEvent

} from '@ticketyyh/common'

export class ExpirationCompletePublisher extends Publisher <ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}



