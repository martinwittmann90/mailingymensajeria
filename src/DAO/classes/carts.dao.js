import { CartModel } from "../models/carts.model.js";
class CartsDao {
    async createCart() {
        return await CartModel.create({ products: [] });
    }
    async updateCart(cartID, cart) {
        await CartModel.updateOne({ _id: cartID }, cart);
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