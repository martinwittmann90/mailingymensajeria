import express from 'express';
import ServiceProducts from "../services/products.service.js"
import ProductModel from '../DAO/models/product.model.js';
import ServiceCarts from "../services/carts.service.js";
import { isUser } from "../middleware/auth.js";

import { viewsController } from "../controller/views.controller.js";

const newProductManager = new ServiceProducts;
const viewsRouter = express.Router();

viewsRouter.get("/", viewsController.getLoginHome);
viewsRouter.get('/products', viewsController.getAll);
viewsRouter.get('/realtimeproducts',  viewsController.realTimeProducts);
viewsRouter.get("/products/:pid", viewsController.getProductById);
viewsRouter.get("/carts/:cid", viewsController.getCardbyId)

export default viewsRouter;