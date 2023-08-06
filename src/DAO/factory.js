import envConfig from '../config/config.js';
import MessagesDAO from '../DAO/classes/messages.dao.js';
import CartsDAO from '../DAO/classes/cart.dao.js';
import ProductsDAO from '../DAO/classes/product.dao.js';
import TicketsDAO from '../DAO/classes/tickets.dao.js';
import MessagesFsDAO from './appManager/fsdao/messages.fs.dao.js';
import CartsFsDAO from './appManager/fsdao/carts.fs.dao.js';
import ProductsFsDAO from './appManager/fsdao/products.fs.dao.js';
import TicketsFsDAO from './appManager/fsdao/tickets.fs.dao.js';

switch (envConfig.PERSISTENCE) {
  case 'MONGO':
    console.log('Persistence with MongoDB');
    MessagesDAO, 
    CartsDAO,
    ProductsDAO, 
    TicketsDAO 
    break;

  case 'FILESYSTEM':
    console.log('Persistence with FileSystem');

    MessagesDAO = MessagesFsDAO;
    CartsDAO = CartsFsDAO;
    ProductsDAO = ProductsFsDAO;
    TicketsDAO = TicketsFsDAO;
    break;

  default:
    throw new Error('Invalid persistence type');
}

export { MessagesDAO, CartsDAO, ProductsDAO, TicketsDAO };
