import ServiceCarts from "../services/carts.service.js";
const serviceCarts = new ServiceCarts();
import ServiceTickets from "../services/tickets.service.js";
const serviceTickets = new ServiceTickets();

class TicketsController {
  async addTicket(req, res) {  
      try {
        const user = req.session.user;
        const userCartId = user.cartID;
        const purchaser = user.email;
        const ticketPreview = await serviceTickets.stockCartProductsForTicket(userCartId);
        const ticket = ticketPreview.cartWithStock;
        const totalCart = ticketPreview.totalPriceTicket;
        const oldProductsCart = ticketPreview.cartWithOutStock;
        await serviceCarts.updateCartService(userCartId, oldProductsCart );
        await serviceTickets.addTicket(purchaser, ticket, totalCart);
        return res.render('ticketsdone', { ticket, totalCart, purchaser });      
      }catch (err) {
        console.error("Error en addTicket:", err);
        res.status(500).json("Error addticket");
      };
  };
  async checkOut(req, res) {  
    try {
        const user = req.session.user;
        const userCartId = user.cartID;
        const cartProducts = await serviceCarts.getCartService(userCartId);
        const ticketPreview = await serviceTickets.stockCartProductsForTicket(userCartId);
        return res.render('tickets', { user, cartProducts,ticketPreview });
        }catch (err) {
        res.status(500).json("Error");
        };
    };
};

export const ticketsController = new TicketsController();
