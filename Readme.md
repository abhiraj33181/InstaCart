## Grocery Delivery Platform

Full-stack grocery delivery app with customer shopping, admin management, and delivery partner workflows.

## Features

### Customer Web App
- Browse products with category, price, and organic filters
- Search, flash deals, and product detail pages with related items
- Cart with quantity updates and persistent storage
- Multi-step checkout (address, payment, review)
- Card payments via Stripe Checkout or cash on delivery
- Address book with geolocation and default address selection
- Orders list and detailed tracking timeline
- Live delivery map with delivery partner location
- Delivery OTP display for secure handoff

### Admin Console
- Dashboard stats (orders, users, products, low stock)
- Product management (create, edit, mark out of stock)
- Image uploads via Cloudinary
- Order management and status updates
- Assign delivery partners to orders
- Delivery partner onboarding and activation control

### Delivery Partner Portal
- Partner login with role-based token
- Active and completed delivery lists
- Status updates (packed, out for delivery)
- OTP-based delivery completion
- Delivery cancelation with reason
- Live location sharing to customer tracking page

### Server + Automation
- JWT auth for users and delivery partners
- Prisma + Neon adapter for PostgreSQL
- Stripe webhook handling for paid orders
- Low-stock alerts and monthly deals email via Inngest + SMTP
- Auto-assign delivery partner on new orders

## Tech Stack

**Client**: React 19, Vite, TypeScript, React Router, Tailwind CSS, React Leaflet

**Server**: Express, TypeScript, Prisma, PostgreSQL, Stripe, Cloudinary, Inngest, Nodemailer

## Project Structure

```
client/   # React app
server/   # Express + Prisma API
```

## Getting Started

### Prerequisites
- Node.js 18+ (recommended)
- PostgreSQL database (Neon or self-hosted)

### 1) Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 2) Environment variables

Create the following files:

#### client/.env

```bash
VITE_BASE_URL=http://localhost:3000/api
VITE_CURRENCY_SYMBOL=Rs.
```

#### server/.env

```bash
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
JWT_SECRET=your_jwt_secret
ADMIN_EMAILS=admin1@example.com,admin2@example.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# SMTP (Brevo relay)
SMTP_USER=...
SMTP_PASS=...
SENDER_EMAIl=no-reply@example.com

# Email links
CLIENT_URL=http://localhost:5173
```

### 3) Database setup

```bash
cd server
npx prisma migrate dev
npm run seed
```

### 4) Run the app

```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```

The client runs on http://localhost:5173 and the API on http://localhost:3000.

## Scripts

### Client
- `npm run dev` - Start Vite dev server
- `npm run build` - TypeScript build + Vite build
- `npm run preview` - Preview production build
- `npm run lint` - ESLint

### Server
- `npm run dev` - Start server with nodemon
- `npm run start` - Start server with tsx
- `npm run build` - TypeScript build
- `npm run seed` - Seed sample products

## API Overview

Base URL: `/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Products
- `GET /products`
- `GET /products/flash-deals`
- `GET /products/:id`
- `POST /products` (admin)
- `PUT /products/:id` (admin)
- `DELETE /products/:id` (admin, marks out of stock)

### Uploads
- `POST /upload` (admin, Cloudinary)

### Addresses
- `GET /addresses`
- `POST /addresses`
- `PUT /addresses/:id`
- `DELETE /addresses/:id`

### Orders
- `POST /orders`
- `GET /orders`
- `GET /orders/:id`
- `GET /orders/:id/location`
- `GET /orders/all` (admin)
- `PUT /orders/:id/status` (admin)

### Admin
- `GET /admin/stats`
- `GET /admin/delivery-partners`
- `POST /admin/delivery-partners`
- `PUT /admin/delivery-partners/:id`
- `PUT /admin/orders/:id/assign`

### Delivery Partners
- `POST /delivery/login`
- `GET /delivery/my-deliveries`
- `GET /delivery/my-deliveries/:id`
- `PUT /delivery/my-deliveries/:id/status`
- `PUT /delivery/my-deliveries/:id/location`
- `PUT /delivery/my-deliveries/:id/complete`
- `PUT /delivery/my-deliveries/:id/cancel`

### Stripe Webhook
- `POST /stripe` (raw body required)

### Inngest
- `POST /inngest`

## Notes

- Admin access is determined by `ADMIN_EMAILS` during login.
- Stripe payments complete through webhook; unpaid card orders are not shown.
- Location features require browser geolocation permissions.
- Live tracking uses OpenStreetMap tiles through React Leaflet.

## Deployment

- Both client and server include `vercel.json` for Vercel deployment.
- Ensure environment variables are configured in your hosting provider.
