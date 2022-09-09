import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
// import dotenv from 'dotenv';



// import the app.ts for testing 
import { app } from './app';
const start =async () => {
    try {
        if(!process.env.JWT_KEY){
            throw new Error('JWT_KEY must be defined')
        }
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    } catch (error) {
         console.log(error);
    }
    
}
app.listen(3000, ()=>{
    console.log("listen on port 3000!")

});

start();