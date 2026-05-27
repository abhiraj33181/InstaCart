import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import { serve } from "inngest/express";
import { inngest, functions } from "./src/inngest/index.js"
import cors from 'cors';
import authRouter from './src/routes/auth.routes.js';
import productRouter from './src/routes/product.routes.js';
import uploadRouter from './src/routes/upload.routes.js';
import orderRouter from './src/routes/order.routes.js';
import addressRouter from './src/routes/address.routes.js';
import adminRouter from './src/routes/admin.routes.js';
import deliveryPartnerRouter from './src/routes/deliveryPartner.routes.js';
import { StripeWebhook } from './src/controllers/webhooks.js';

const app = express();
app.post('/api/stripe', express.raw({ type: 'application/json' }), StripeWebhook)

// Middleware
app.use(cors());
app.use(express.json());


const port = process.env.PORT || 3000;




app.get('/', (req: Request, res: Response) => {
    res.send("Server is Live!")
})

app.use('/api/auth', authRouter)
app.use('/api/products', productRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/orders', orderRouter)
app.use('/api/addresses', addressRouter)
app.use('/api/admin', adminRouter)
app.use('/api/delivery', deliveryPartnerRouter)
app.use("/api/inngest", serve({ client: inngest, functions }));

// Error Handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error(error)
    res.status(500).json({
        message : error.message
    })
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})