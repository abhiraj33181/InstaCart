import express from 'express'
import auth from '../middlewares/auth.js';
import { createOrder, getAllOrders, getOrder, getOrderLocation, getUserOrders, updateOrderStatus } from '../controllers/order.controller.js';
import admin from '../middlewares/admin.js';

const orderRouter = express.Router();

orderRouter.post('/', auth, createOrder)
orderRouter.get('/', auth, admin, getUserOrders)
orderRouter.get('/all', auth, getAllOrders)
orderRouter.get('/:id', auth, getOrder)
orderRouter.put('/all', auth, admin, updateOrderStatus)
orderRouter.get('/:id/location', auth, getOrderLocation)


export default orderRouter;