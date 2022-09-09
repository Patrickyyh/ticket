import nats , {Message, Stan} from 'node-nats-streaming';
import {randomBytes} from 'crypto';
import {TicketCreatedListener} from './events/ticket-created-listener';



console.clear();

const stan = nats.connect('ticketing',randomBytes(4).toString('hex'),{
    url:'http://localhost:4222'
}); 


stan.on('connect', ()=>{
   console.log('Listen connected to NATS: Listen side');

   stan.on('close',()=>{
    console.log('NATs connection closed!');
    process.exit();
   })

   new TicketCreatedListener(stan).listen();
   
});

// listern the signal sent from the terminal
process.on('SIGINT',()=>stan.close());
process.on('SIGTERM', ()=>stan.close());




