import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import authRouter from './src/routes/auth.routes.js';
import productRouter from './src/routes/product.routes.js';
import uploadRouter from './src/routes/upload.routes.js';

const app = express();

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