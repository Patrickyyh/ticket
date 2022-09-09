import { TicketUpdatedListener} from "../ticket-updated-listener";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@ticketyyh/common";
import { TicketCreatedEvent } from "@ticketyyh/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";

jest.mock('../../../nats-wrapper');


const setup =async () => {
    //crete an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    // create and saved a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })

    await ticket.save();


    //create a fake data event
    const data:TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: "new concert",
        price: 100,
        userId :new mongoose.Types.ObjectId().toHexString()
    }

    // create a fake message object 
    // @ts-ignore
    const msg : Message = {
        ack: jest.fn()
    }

    // return all of the stuff
    return {msg,data,listener,ticket};
    
}


it('finds messags, and saves a ticket',async()=>{
    const {msg, data,ticket,listener} = await setup();
    
    // call the onMessage function with data object + message object 
    await listener.onMessage(data,msg);

    //fetch the data again
    const updateTicket = await Ticket.findById(data.id);
    expect(updateTicket).toBeDefined();
    expect(updateTicket!.title).toEqual(data.title);
    expect(updateTicket!.price).toEqual(data.price);
    expect(updateTicket!.version).toEqual(data.version);

})


it('ack the messag',async()=>{
    const {listener, data,msg,ticket} = await setup();

    //call the onMessage function with data object + message object
    await listener.onMessage(data,msg);

    //write assertion to make sure ack function is called 
    expect(msg.ack).toHaveBeenCalled();

})


it('does not call ack if the event has a skipped version number',async () => {
    const {listener, data,msg,ticket} = await setup();

    data.version = 10; 
    
    try {
        await listener.onMessage(data,msg);
    } catch (error) {
        
    }

    expect(msg.ack).not.toHaveBeenCalled();
})




