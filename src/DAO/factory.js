import MongoStore from "connect-mongo";
import { connectMongo } from "../config/configMongoDB.js";
export let factoryStore;
export let cartsDao;
export let messagesDao;
export let productsDao;
export let usersDao;
export let ticketsDao;
export async function initFactory() {
    switch (process.env.DAO) {
        case "MONGO":
            const MONGO_PASS = process.env.MONGO_PASS;
            const MONGO_USER = process.env.MONGO_USER;
            const DB_NAME = process.env.DB_NAME;
            connectMongo(MONGO_PASS, MONGO_USER, DB_NAME );
            factoryStore = {
                store: MongoStore.create({
                    mongoUrl: `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@projectmartinwittmann.l8a7l5b.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
                    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
                    ttl: 60 * 10 
                }),
                };
            const { default: MongoCarts } = await import("../DAO/classes/carts.dao.js");
            const { default: MongoMessages } = await import("../DAO/classes/messages.dao.js");
            const { default: MongoProducts } = await import("../DAO/classes/products.dao.js");
            const { default: MongoUsers } = await import("../DAO/classes/users.dao.js");
            const { default: MongoTickets } = await import("../DAO/classes/tickets.dao.js");
            cartsDao = MongoCarts;
            messagesDao = MongoMessages;
            productsDao = MongoProducts;
            usersDao = MongoUsers;
            ticketsDao = MongoTickets;
    }
}