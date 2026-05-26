import express from 'express'
import auth from '../middlewares/auth.js';
import { createOrder, getAllOrders, getOrder, getOrderLocation, getUserOrders, updateOrderStatus } from '../controllers/order.controller.js';
import admin from '../middlewares/admin.js';

const orderRouter = express.Router();

orderRouter.post('/', auth, createOrder)
orderRouter.get('/', auth, getUserOrders)
orderRouter.get('/all', auth, admin, getAllOrders)
orderRouter.get('/:id', auth, getOrder)
orderRouter.put('/:id/status', auth, admin, updateOrderStatus)
orderRouter.get('/:id/location', auth, getOrderLocation)


export default orderRouter;