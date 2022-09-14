import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
// import dotenv from 'dotenv';
//NATS client-instance
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/order-expired-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';


// import the app.ts for testing
import { app } from './app';

const start =async () => {
<<<<<<< HEAD
    console.log('here....');
=======
    console.log('here...');
>>>>>>> 5cf9b39fe2e1e41a3f8eee707c6f77cc7058a712
    try {
        if(!process.env.JWT_KEY){
            throw new Error('JWT_KEY must be defined')
        }

        if(!process.env.MONGO_URI){
            throw new Error('MONGO_URL must be defined');
        }

        if(!process.env.NATS_CLIENT_ID){
            throw new Error('NATS_CLIENT_ID must be defined');
        }

        if(!process.env.NATS_URL){
            throw new Error('NATS_URL must be defined');
        }

        if(!process.env.NATS_CLUSTER_ID){
            throw new Error('NATS_CLUSTER_ID must be defined');
        }


        //NATS-server connection
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID ,process.env.NATS_CLIENT_ID,process.env.NATS_URL);


        // listen for the event to close the NATS gracefully
        natsWrapper.client.on('close',()=>{
                console.log('NATs connection closed!');
                process.exit();
        });
        process.on('SIGINT', ()=>  natsWrapper.client.close());
        process.on('SIGTERM',()=>  natsWrapper.client.close());


        // turn on the listener.

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketCreatedListener(natsWrapper.client).listen();


        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();


        // mongoose connect to the mongoDb
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDb')

    } catch (error) {
         console.log(error);
    }

}
app.listen(3000, ()=>{
    console.log("listen on port 3000!")

});

start();
