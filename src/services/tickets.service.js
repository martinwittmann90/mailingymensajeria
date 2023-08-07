import TicketsDAO from '../DAO/classes/tickets.dao.js';
const ticketsDAO = new TicketsDAO();

class ServiceTickets {
  async createTicketService(code, amount, purchaser) {
    try {
        const newTicket = await ticketsDAO.createTicketDao({ code, amount, purchaser });
        return newTicket;
    } catch (error) {
        throw new Error('Error creating ticket: ' + error.message);
    }
}
}

export default ServiceTickets;
