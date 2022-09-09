import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
// import dotenv from 'dotenv';
//NATS client-instance 
import { natsWrapper } from './nats-wrapper';

// import the listener
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';


// import the app.ts for testing 
import { app } from './app';
const start =async () => {
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
        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

        
        // listen for the event to close the NATS gracefully
        natsWrapper.client.on('close',()=>{
                console.log('NATs connection closed!');
                process.exit();
        });
        process.on('SIGINT', ()=>  natsWrapper.client.close());
        process.on('SIGTERM',()=>  natsWrapper.client.close());


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