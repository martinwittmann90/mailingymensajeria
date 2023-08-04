import ServiceCarts from "../services/carts.service.js";
const dbCarts = new ServiceCarts();

class CartController{
    async createCart (req, res)  {
        try {
            const newCart = await dbCarts.createOne();
            res.status(201).json(newCart);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
        };
    async getCartById  (req, res)  {
        try {
            const cartId = req.params.cid;
            const cart = await dbCarts.get(cartId);
            res.status(200).json(cart);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
        };
    async addProductToCart (req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const cart = await dbCarts.addProductToCart(cid, pid, quantity );
            res.status(200).json(cart);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
        };
    async deletOneProductbyCart  (req, res)  {
        try {
        const { cid, pid } = req.params;
        const cart = await dbCarts.removeProductFromCart(cid, pid);
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
        const cart = await dbCarts.updateCart(cid, products);
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
            await dbCarts.clearCart(cid);
            res
            .status(200)
            .json({ status: "success", message: "Cart cleared successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "error", message: "Internal server error" });
        }
        };
    async purchase(req, res) {
        const cartID = req.params.cid;
        const response = await ServiceCarts.purchase(req.session.user?.email, cartID);
        return res.status(response.code).json(response.result);
    }
}
export const cartController = new CartController();