import express from 'express';
import { isAdmin } from "../middleware/auth.js";
import { viewsController } from "../controller/views.controller.js";

const viewsRouter = express.Router();

viewsRouter.get("/", viewsController.getLoginHome);
viewsRouter.get('/products', viewsController.getAll);
viewsRouter.get('/realtimeproducts', isAdmin, viewsController.realTimeProducts);
viewsRouter.get("/products/:pid", viewsController.getProductById);
viewsRouter.get("/carts/:cid", viewsController.getCardbyId)

export default viewsRouter;