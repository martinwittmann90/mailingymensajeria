import CartModel from "../models/cart.model.js";

class CartsDAO {
  async createCart(){
    const cart = await CartModel.create({});
    return cart;
};
async getCart(cartId){
    const cart = await CartModel.findById(cartId).populate("products.product").lean();
    const cartProducts = cart.products;      
    return { cartProducts, cart };
}
async updateCart(cartId, products){
    const cart = await CartModel.findByIdAndUpdate(cartId,
      { products },
      { new: true }
    );
    return cart;
}
  async delete(id) {
    try {
      const cartDeleted = await CartModel.deleteOne(/* { _id: id } */);
      return cartDeleted;
    } catch (error) {
      console.log(error);
    }
  }
};

export default CartsDAO;