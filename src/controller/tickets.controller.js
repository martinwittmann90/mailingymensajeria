/* import TicketService from "../services/tickets.service.js";
const ticketService = new TicketService();

import ServiceCarts from "../services/carts.service.js";
const dbCarts = new ServiceCarts();

import  CartModel from '../DAO/models/carts.model.js';


class TicketController { 
  async createTicket(req, res) {
    try {
      const { } = req.body;
      const cartId = req.params.cid;
      const cart = await CartModel.findById(cartId).populate('products.product');
      const purchaserId = req.user.email;
      const ticketData = {
        amount: 100,
        purchaser: purchaserId,
      };
      const createdTicket = await ticketService.createTicket(ticketData);
      res.status(201).json(createdTicket);
      console.log(ticketData)
    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({ error: 'Error creating ticket' });
    }
  }
async showTicketById (req, res) {
    const ticketId = req.params.id;
    try {
      const ticket = await ticketService.getTicketById(ticketId);
      if (!ticket) {
        return res.render('error', { error: 'Ticket no encontrado' });
      }
      res.render('ticket', { ticket });
    } catch (error) {
      res.render('error', { error: 'Error al obtener el Ticket' });
    }
  };
    async purchaseCart(req, res) {
      const cartId = req.params.cid;
      try {
        const cart = await CartModel.findById(cartId).populate('products.product');
        const productsToPurchase = [];
        const productsNotPurchased = [];
        for (const item of cart.products) {
          const product = item.product;
          const quantityToPurchase = item.quantity;
          if (product.stock >= quantityToPurchase) {
            product.stock -= quantityToPurchase;
            productsToPurchase.push(product);
          } else {
            productsNotPurchased.push(product._id);
          }
        }
        if (productsToPurchase.length > 0) {
          // Update cart to contain only products that couldn't be purchased
          cart.products = cart.products.filter(item => {
            return productsNotPurchased.includes(item.product._id);
          });
          await Promise.all([
            cart.save(),
            ...productsToPurchase.map(product => product.save()),
          ]);
          // Generate a ticket for the purchase
          const totalAmount = productsToPurchase.reduce((acc, product) => {
            return acc + product.price * cart.products.find(item => item.product.toString() === product._id.toString()).quantity;
          }, 0);
          const ticketData = {
            code: generateUniqueTicketCode(),
            amount: totalAmount,
            purchaser: cart.userEmail,
          };
          const ticketService = new TicketService();
          const createdTicket = await ticketService.createTicket(ticketData);
          return res.status(200).json(createdTicket);
        } else {
          return res.status(400).json({ error: 'No products available for purchase.' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred during the purchase process.' });
      }
    }
}

export const ticketController = new TicketController();



/* class TicketController{
        async createTicket  (req, res) {
            const { code, purchaser } = req.body;
            try {
            // Obtén los productos del carrito para el ID determinado (reemplaza 'cartId' con el ID real del carrito)
            const cartId = req.params.cid;
            const cartProducts = await dbCarts.updateProductQuantity(cartId);
            // Calcula el total de la compra sumando los precios de los productos en el carrito
            let amount = 0;
            for (const product of cartProducts) {
            amount += product.price;
            }
            // Crea el ticket con los datos proporcionados
            const ticket = await ticketService.createTicket(code, amount, purchaser);
            // Asigna los productos del carrito al ticket creado (opcional, dependiendo de tu modelo de datos)
            ticket.products = cartProducts;
            await ticket.save();
            // Limpia el carrito después de incorporar los productos al ticket (opcional)
            //await ServiceCarts.clearCart(cartId);
            res.render('ticket', { ticket });
            } catch (error) {
            res.render('error', { error: 'Error al crear el Ticket' });
            }
        };
        async showTicketById (req, res) {
            const ticketId = req.params.id; // El ID del ticket se recibe como parámetro en la URL
            try {
              const ticket = await ticketService.getTicketById(ticketId);
              if (!ticket) {
                return res.render('error', { error: 'Ticket no encontrado' });
              }
              res.render('ticket', { ticket });
            } catch (error) {
              res.render('error', { error: 'Error al obtener el Ticket' });
            }
          };
        // Controlador para mostrar todos los Tickets
        async showAllTickets (req, res) {
            try {
            const tickets = await ticketService.getAllTickets();
            res.render('alltickets', { tickets });
            } catch (error) {
            res.render('error', { error: 'Error al obtener los Tickets' });
            }
        };
}

export const ticketController = new TicketController(); */