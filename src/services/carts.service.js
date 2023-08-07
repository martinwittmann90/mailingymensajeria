import CartsDAO from '../DAO/classes/cart.dao.js';
import ProductsDAO from '../DAO/classes/product.dao.js'; 
import ProductModel from '../DAO/models/product.model.js'
import CartModel from '../DAO/models/cart.model.js';

const cartsDAO = new CartsDAO();
const productsDAO = new ProductsDAO();
class ServiceCarts {
  async createOne() {
    const cartCreated = await cartsDAO.createCart({});
    return { status: 200, result: { status: "success", payload: cartCreated }};
  }

  async getCartService(cartId) {
    const cart = await cartsDAO.getCart(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }
    return cart;
  }

  async addProductToCartService(cartId, productId) {
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

  async updateCartService() {
    try {
      const cart = await cartsDAO.updateCart();
      return cart;
  } catch (error) {
      throw new Error('Error updating cart in database');
  }
}

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartsDAO.getCart(cartId);
      const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);
      if (productIndex === -1) {
          throw new Error('Product not found in cart');
      }
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return cart;
  } catch (error) {
      throw new Error('Error updating product quantity in cart');
  }
}

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await cartsDAO.getCart(cartId);
      const productIndex = cart.products.findIndex
        ((p) => p.product.toString() === productId);
        if (productIndex === -1) {
            throw new Error('Product not found in cart');
        }
        cart.products.splice(productIndex, 1);
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error('Error removing product from cart');
    }
}
  async clearCartService(cartId) {
    try {
      const cart = await cartsDAO.getCart(cartId);
      cart.products = [];
      await cart.save();
  } catch (error) {
      throw new Error('Error clearing cart');
  }
}
/*   async checkoutCart(cartId) {
    try {
        const cart = await cartsDAO.getCart(cartId);
        let totalAmount = 0;
        for (const product of cart.products) {
            totalAmount += product.quantity * product.product.price;
        }
        const ticket = await ticketService.createTicket(
            generateUniqueTicketCode(),
            totalAmount,
            cart.user
            );

            cart.products = [];
            await cart.save();
            return ticket;
    } catch (error) {
        throw new Error('Error checking out cart: ' + error.message);
    }
}
  async processPurchase(cart) {
    const productsNotProcessed = [];
    for (const cartProduct of cart.products) {
        const product = await productsDAO.getProduct(cartProduct.productId);
        if (product.stock >= cartProduct.quantity) {
            product.stock -= cartProduct.quantity;
            await product.save();
        } else {
            productsNotProcessed.push(cartProduct.productId);
        }
    }
    return productsNotProcessed;
  }
  calculateTotalAmount(cart) {
    return cart.products.reduce((total, cartProduct) => {
        const product = cartProduct.productId;
        return total + product.price * cartProduct.quantity;
    }, 0);
  }
  async removeProcessedProducts(cart, productsNotProcessed) {
    cart.products = cart.products.filter(
        (cartProduct) => !productsNotProcessed.includes(cartProduct.productId)
    );
    await cart.save();
  } */
} 

export default ServiceCarts;
