import  CartModel from '../DAO/models/carts.model.js';
import ProductModel from '../DAO/models/products.model.js';
import { cartsDao, productsDao, ticketsDao } from "../DAO/factory.js";

class ServiceCarts {
  async createOne() {
    const cartCreated = await CartModel.create({});
    return { status: 200, result: { status: "success", payload: cartCreated }};
  }

  async get(cartId) {
    const cart = await CartModel.findById(cartId).populate("products.product").lean()
    if (!cart) {
      throw new Error("Cart not found");
    }
    return cart;
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      const product = await ProductModel.findById(productId);
      if (!cart) {
        throw new Error("Cart not found");
      }
      if (!product) {
        throw new Error("Product not found");
      }
      const existingProductIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ product: product._id, quantity: 1 });
      }
      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products },
        { new: true }
      );
      return cart;
    } catch (error) {
      throw new Error("Error updating cart in database");
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await CartModel.findById(cartId);
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (productIndex === -1) {
        throw new Error("Product not found in cart");
      }
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error updating product quantity in cart");
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (productIndex === -1) {
        throw new Error("Product not found in cart");
      }
      cart.products.splice(productIndex, 1);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error removing product from cart");
    }
  }  

  async clearCart(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }
      cart.products = [];
      await cart.save();
    } catch (error) {
      throw new Error("Error clearing cart");
    }
  }
  async purchase(purchaser, cartID) {
    try {
        const cart = await cartsDao.findCart(cartID);
        if (cart.products.length < 1)
            return { code: 404, result: { status: "empty", message: "Cart is empty" } };
        let totalAmount = 0;
        for (const cartProduct of cart.products) {
            const productInDB = await productsDao.findProduct(cartProduct.product.toString());
            if (productInDB.stock < cartProduct.quantity) {
                return {
                    code: 404,
                    result: {
                        status: "nostock",
                        message: `Not enough stock for product ${productInDB.title}`,
                        payload: productInDB,
                    },
                };
            }
            totalAmount += productInDB.price * cartProduct.quantity;
            productInDB.stock -= cartProduct.quantity;
            await productsDao.updateProduct(productInDB._id, productInDB);
            await this.deleteProductFromCart(cartID, cartProduct.product.toString());
        }
        const ticket = await ticketsDao.createTicket(purchaser, totalAmount);
        return { code: 200, result: { status: "success", message: "Purchase successful", payload: ticket } };
    }
    catch (error) {
        console.log(error);
        return { code: 500, result: { status: "error", message: "Couldn't purchase products." } };
    }
  }
};

export default ServiceCarts;
