import ServiceChats from "../services/chats.service.js";

class ChatController{
    async createChat (req, res)  {
            try {
            res.render("chat", {});
            } catch (err) {
            res.status(err.status || 500).json({
                status: "error",
                payload: err.message,
            });
            }
        };
    };

export const chatController = new ChatController();