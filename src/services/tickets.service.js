/* import TicketModel from "../DAO/models/tickets.model.js"


class TicketService {
  async createTicket(ticketData) {
    try {
      const ticket = new TicketModel(ticketData);
      const createdTicket = await ticket.save();
      return createdTicket;
    } catch (error) {
      throw new Error('Error creating ticket.');
    }
  }
} */

/* class TicketService {
  async createTicket(code, amount, purchaser) {
    try {
      const newTicket = new TicketModel({
        code,
        amount,
        purchaser
      });

      const ticket = await newTicket.save();
      return ticket;
    } catch (error) {
      throw error;
    }
  }
  async getTicketById(ticketId) {
    try {
      const ticket = await TicketModel.findById(ticketId);
      return ticket;
    } catch (error) {
      throw error;
    }
  }
  async getAllTickets() {
    try {
      const tickets = await TicketModel.find();
      return tickets;
    } catch (error) {
      throw error;
    }
  }
} */

/* export default TicketService; */
