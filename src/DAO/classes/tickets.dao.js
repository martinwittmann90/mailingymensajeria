import TicketModel from "../models/ticket.model.js"
class TicketsDAO {
    async getAll() {
        try {
        const tickets = await TicketModel.find({});
        return tickets;
        } catch (error) {
        console.log(error);
        }
    }
    async getById(id) {
        try {
        let ticket;
        ticket = await TicketModel.findOne({ _id: id }).lean();
        return ticket;
        } catch (error) {
        console.log(error);
        }
    }

    async add(ticket) {
        try {
        const newTicket = await TicketModel.create(ticket);
        return newTicket;
        } catch (error) {
        console.log(error);
        }
    }

    async update(id, ticket) {}
    async delete(id) {}
}

export default TicketsDAO;
