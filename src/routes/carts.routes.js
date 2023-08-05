import express from 'express';
import { cartController } from "../controller/carts.controller.js";
const cartsRouter = express.Router()

cartsRouter.post("/", cartController.createCart);
cartsRouter.get("/:cid", cartController.getById);
cartsRouter.post("/:cid/product/:pid", cartController.addProductToCart);
cartsRouter.put("/:cid", cartController.updateCart);
cartsRouter.delete("/:cid/products/:pid", cartController.deletOneProductbyCart);
cartsRouter.delete("/:cid", cartController.clearCart);

export default cartsRouter;