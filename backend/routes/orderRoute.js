import express from 'express'
import { placeOrder, VerifyOrder, userOrders} from '../controllers/orderController.js'
import authMiddleware from '../middleware/auth.js'

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",VerifyOrder);
orderRouter.post("/userorders",authMiddleware,userOrders);


export default orderRouter;