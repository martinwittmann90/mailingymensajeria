import { Router } from 'express';
import { ticketsController } from '../controller/ticket.controller.js';
import { isLogged, isUser } from '../middleware/auth.js';

const routerTicket = Router();

routerTicket.get("/checkout", isLogged, isUser, ticketsController.checkOut);
routerTicket.post("/checkout", isLogged, isUser, ticketsController.addTicket); 
routerTicket.get("/ticketfinished", isLogged, isUser, ticketsController.addTicket);

export default routerTicket;