import MongoCarts from '../services/carts.service.js';
const Services = new MongoCarts();
import mongoose from 'mongoose';

import { TicketsDAO, ProductsDAO, CartsDAO } from '../DAO/factory.js';
const ticketsDAO = new TicketsDAO();
const productDAO = new ProductsDAO();
const cartsDAO = new CartsDAO();

class ServiceTickets {
  async purchaseCart(cartId, cartList, userMail, userCartId) {
    try {
      if (!Array.isArray(cartList)) {
        return { status: 400, result: { status: 'error', error: ' The cart list must be a valid array.', }, };
      }
      if (!cartList || cartList.length === 0) {
        return { status: 400, result: { status: 'error', error: ` Cart list is empty.`,},};
      }

      if (!Schema.Types.ObjectId(cartId)) {
        return { status: 400, result: { status: 'error', error: ` Invalid cart ID.`, }, };
      }
      const cartFiltered = await cartsDAO.getById(cartId);
      if (!cartFiltered) {
        return { status: 400, result: { status: 'error', error: ` Cart not found.`,
          },
        };
      }
      const productsNotPurchased = [];
      const products = await Promise.all(
        cartList.map(async (product) => {
          const productFiltered = await productDAO.getById(product.id);
          if (!productFiltered) {
            return { status: 400, result: { status: 'error', error: ` Product not found.`, },};
          }
          if (productFiltered.stock >= product.quantity) {
            productFiltered.stock -= product.quantity;
            await productFiltered.save();
            return productFiltered;
          } else {
            productsNotPurchased.push(product);
            return null;
          }
        })
      );
      const productsFiltered = products.filter((product) => product !== null);
      if (productsFiltered.length === 0) {
        return { status: 400, result: { status: 'error', error: ` No products available.`,},};
      }
      const totalAmount = cartList.reduce((acc, product) => {
        const productFiltered = productsFiltered.find((p) => p._id.equals(product.id));
        if (productFiltered) {
          acc += productFiltered.price * product.quantity;
        }
        return acc;
      }, 0);
      const newOrder = {
        code: Math.floor(Math.random() * 1000000),
        purchase_datetime: new Date(),
        amount: +totalAmount,
        purchaser: userMail,
        products: productsFiltered.map((product) => ({
          id: product._id,
          quantity: cartList.find((p) => p.id === product._id.toString()).quantity,
        })),
      };
      const orderCreated = await ticketsDAO.add(newOrder);
      if (productsFiltered.length > 0) {
        await Services.deleteProduct(
          cartId,
          productsFiltered.map((product) => product._id)
        );
        await Services.deleteCart(cartId);
      }
      if (productsNotPurchased.length > 0) {
        await Services.updateCart(cartId, productsNotPurchased);
      }
      return { status: 200, result: { status: 'success', payload: orderCreated },
      };
    } catch (error) {
      console.log(error);
      return { status: 500, result: { status: 'error', msg: 'Internal Server Error', payload: {} },};
    }
  }
  async getTicketById(id) {
    try {
      if (!Schema.Types.ObjectId(id)) {
        return { status: 400, result: { status: 'error', error: ` Invalid ticket ID.`,},};
      }
      const ticket = await ticketsDAO.getById(id);
      if (!ticket) {
        return { status: 404, result: { status: 'error', error: ` Ticket not found.`,},};
      }
      return { status: 200, result: { status: 'success', payload: ticket },
      };
    } catch (error) {
      console.log(error);
      return { status: 500, result: { status: 'error', msg: 'Internal Server Error', payload: {} },};
    }
  }
}

export default ServiceTickets;
