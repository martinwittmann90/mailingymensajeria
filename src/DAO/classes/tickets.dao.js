import TicketModel from "../models/ticket.model.js"
class TicketsDAO {
    async createTicketDao(){
        const ticket = TicketModel.create();
        return ticket;
    };
}

export default TicketsDAO;
