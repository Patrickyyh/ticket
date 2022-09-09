import express, { Request, Response } from 'express';
import { NotFoundError } from '@ticketyyh/common';
import { Ticket } from '../models/Ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  
  const ticket = await Ticket.findById(req.params.id).maxTimeMS(1000);
  if(!ticket){
    throw new NotFoundError();
  }
 
  res.send(ticket);

});

export { router as showTicketRouter };
