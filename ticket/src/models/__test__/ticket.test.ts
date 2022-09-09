import mongoose from "mongoose";
import { Ticket } from "../Ticket";
it('implements optimistic concurrency control' ,async () => {
    
    // create an instance of ticket 
    const ticket = Ticket.build({
        title: 'concert',
        price : 5,
        userId: '123'
    })

    // Save the ticket to the database
    await ticket.save();

    //fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make two seperate changes to the tickets we fetched
    firstInstance!.set({price: 10});
    secondInstance!.set({price: 15});
    
    // save the first fetched ticket 
    await firstInstance!.save();

    // save the second fetched ticket and expect and error 
    try {
        await secondInstance!.save();
        throw new Error('Should not reach this point')
    } catch (error) {
        expect(error).toBeInstanceOf(mongoose.Error.VersionError);
    }


})


it('increments the versio number on multipel saves',async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price : 5,
        userId: '123'
    });


    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);


})