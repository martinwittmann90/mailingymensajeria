import { TicketModel } from "../models/tickets.model.js";
import { v4 as uuidGenerator } from "uuid";
class TicketsDao {
    async createTicket(purchaser, amount) {
        const code = uuidGenerator();
        return await TicketModel.create({ purchaser, amount, code });
    }
}
const ticketsDao = new TicketsDao();
export default ticketsDao;