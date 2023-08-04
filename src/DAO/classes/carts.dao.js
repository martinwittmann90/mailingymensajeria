import { CartModel } from "../models/carts.model.js";
class CartsDao {
    async createCart() {
        return await CartModel.create({ products: [] });
    }
    async updateCart(cartId, cart) {
        await CartModel.updateOne({ _id: cartId }, cart);
    }
    async findCart(id) {
        return (await CartModel.findById(id));
    }
    async findCartFull(id) {
        return (await CartModel.findById(id).populate("products.product").lean());
    }
}
const cartsDao = new CartsDao();
export default cartsDao;