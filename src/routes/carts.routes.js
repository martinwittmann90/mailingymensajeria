import express from 'express';
import { cartController } from "../controller/carts.controller.js";
import { isCartOwner } from "../middleware/auth.js";
const cartsRouter = express.Router()

cartsRouter.post("/", cartController.createCart);
cartsRouter.get("/:cid", cartController.getCartById);
cartsRouter.post("/:cid/product/:pid", cartController.addProductToCart);
cartsRouter.put("/:cid", cartController.updateCart);
cartsRouter.delete("/:cid/products/:pid", cartController.deletOneProductbyCart);
cartsRouter.delete("/:cid", cartController.clearCart);

cartsRouter.post("/:cid/purchase", isCartOwner, cartController.purchase);

export default cartsRouter;