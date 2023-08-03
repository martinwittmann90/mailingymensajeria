import { MessageModel } from "../models/messages.model.js";
class MessagesDao {
    async getAll() {
        return await MessageModel.find({});
    }
    async addMessage(message) {
        const newMessage = new MessageModel(message);
        await newMessage.save();
    }
}
const messagesDao = new MessagesDao();
export default messagesDao;