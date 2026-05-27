import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const StripeWebhook = async (request: Request, response: Response) => {
    let event;
    if (!endpointSecret) {
        return response.status(500).json({ message: "Stripe webhook secret not configured" });
    }

    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
        event = stripe.webhooks.constructEvent(
            request.body,
            signature as string,
            endpointSecret
        );
    } catch (err: any) {
        console.log(`⚠️ Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
    }

    const markOrderPaid = async (orderId: string) => {
        const paidOrder = await prisma.order.update({
            where: { id: orderId },
            data: { isPaid: true }
        })

        const orderItems = (Array.isArray(paidOrder.items)) ? paidOrder.items : [] as any[]
        for (const item of orderItems) {
            await prisma.product.update({
                where: { id: item.product },
                data: { stock: { decrement: item.quantity } }
            })
        }

        await inngest.send({
            name: 'order/placed',
            data: { orderId }
        })

        for (const item of orderItems) {
            await inngest.send({ name: 'inventory/stock.updated', data: { productId: item.product } })
        }
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderId = session.metadata?.orderId;
            if (!orderId) break;
            await markOrderPaid(orderId);
            break;
        }
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const paymentIntentId = paymentIntent.id;

            const sessions = await stripe.checkout.sessions.list({
                payment_intent: paymentIntentId
            })

            const orderId = sessions.data[0]?.metadata?.orderId;
            if (!orderId) break;
            await markOrderPaid(orderId);
            break;
        }
        case 'payment_intent.canceled':
        case 'payment_intent.payment_failed': {
            const paymentIntentFailure = event.data.object as Stripe.PaymentIntent;
            const paymentIntentFailureId = paymentIntentFailure.id

            const sessionFailure = await stripe.checkout.sessions.list({
                payment_intent: paymentIntentFailureId
            })

            const failureOrderId = sessionFailure.data[0]?.metadata?.orderId;
            if (failureOrderId) {
                await prisma.order.delete({ where: { id: failureOrderId } })
            }
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
}