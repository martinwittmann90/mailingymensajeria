import ServiceCarts from "../services/carts.service.js";
const serviceCarts = new ServiceCarts();

import ServiceTickets from '../services/tickets.service.js';
const serviceTickets = new ServiceTickets();

import userDTO from "../DAO/DTO/user.dto.js";
class CartController{
    async createCart (req, res)  {
        try {
            const newCart = await serviceCarts.createOne();
            res.status(201).json(newCart);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
        };
    async getById  (req, res)  {
        try {
            const cartId = req.params.cid;
            const cart = await serviceCarts.get(cartId);
            res.status(200).json(cart);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
        };
    async addProductToCart (req, res) {
        try {
            const { cid, pid } = req.params;
            const cart = await serviceCarts.addProductToCart(cid, pid);
            res.status(200).json(cart);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
        };
    async deletOneProductbyCart  (req, res)  {
        try {
        const { cid, pid } = req.params;
        const cart = await serviceCarts.removeProductFromCart(cid, pid);
        res
            .status(200)
            .json({ status: "success", message: "Product removed from cart", cart });
        } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal server error" });
        }
        };
    async updateCart  (req, res)  {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const cart = await serviceCarts.updateCart(cid, products);
        res
          .status(200)
          .json({ status: "success", message: "Cart updated successfully", cart });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal server error" });
      }
    }
    async clearCart (req, res) {
        try {
            const { cid } = req.params;
            await serviceCarts.clearCart(cid);
            res
            .status(200)
            .json({ status: "success", message: "Cart cleared successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "error", message: "Internal server error" });
        }
        };
    async purchaseCart (req, res) {
      const id = req.params.cid;
      const cartList = req.body;
      const infoUser = new userDTO(req.session);
      const response = await serviceTickets.purchaseCart(id, cartList, infoUser.email, infoUser.cartID);
      return res.status(response.status).json(response.result);
    };
    async getTicketById (req, res) {
      const id = req.params.cid;
      const response = await serviceTickets.getTicketById(id);
      return res.render('ticket', { ticket: response.result });
    };
};    
export const cartController = new CartController();