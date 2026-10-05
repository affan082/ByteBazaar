# ByteBazaar

A full-stack multi-vendor e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

ByteBazaar supports a multi-role workflow where customers can browse, filter, review, and purchase products with Stripe checkout, while sellers and administrators manage catalogs, order statuses, user roles, and platform analytics.

---

## Tech Stack

### Frontend

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling & UI:** Bootstrap 5, React-Bootstrap, PrimeReact, SCSS
- **Icons & Visuals:** Lucide React, React Icons, Recharts (for analytics graphs)
- **Forms & State:** React Final Form, Context API

### Backend

- **Runtime:** Node.js
- **Server Framework:** Express 4
- **Database:** MongoDB with Mongoose ODM
- **Sessions & Auth:** `express-session` with `connect-mongo`, JSON Web Tokens (JWT), BCrypt
- **Payments:** Stripe API
- **File Uploads:** Multer
- **Email:** Nodemailer / SMTP

---

## Key Features

- **Storefront & Catalog:** Product search, category filtering, detailed product views, and customer reviews.
- **Cart & Wishlist:** Persistent shopping cart and wishlist management per user.
- **Checkout & Payments:** Card payments integrated via Stripe checkout sessions.
- **Order Tracking:** Customers can view past orders; sellers can monitor and update order fulfillment status.
- **Seller Management:** Add, edit, and categorize products with multi-image gallery support.
- **Admin Dashboard:** Platform metrics, sales data visualization via Recharts, category control, and user role management.
- **Auto-Provisioned Admin:** Automatically creates a root administrator role and user on the first backend run if configured in `.env`.

---

## Project Structure

```text
ByteBazaar/
├── bytebazaar-backend/          # Express API server
│   ├── config/                  # Server configuration
│   ├── controllers/             # Request handlers (auth, orders, products, etc.)
│   ├── models/                  # Mongoose schemas (User, Product, Order, etc.)
│   ├── routes/                  # Express route definitions
│   ├── uploads/                 # Uploaded product and user images
│   ├── utils/                   # Helper scripts (admin seed, email sender)
│   ├── .env.example             # Example environment configuration
│   ├── package.json
│   └── server.js                # Server entry point
│
├── bytebazaar-frontend/         # Vite + React client
│   ├── src/
│   │   ├── admin/               # Admin panel views and dashboards
│   │   ├── components/          # Reusable UI components (Navbar, Cards, Modals)
│   │   ├── config/              # Frontend endpoints (global-info.json)
│   │   ├── pages/               # Page routes (Home, Shop, Cart, Profile, etc.)
│   │   ├── services/            # API call helpers (Axios)
│   │   └── templates/           # Layout wrappers
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [MongoDB](https://www.mongodb.com/) (either a free MongoDB Atlas cloud cluster or a local MongoDB server instance)
- A [Stripe](https://stripe.com/) account for testing card payments (optional for browsing, required for checkout)

---

### 1. Backend Setup

1. Open your terminal and navigate to the backend folder:

   ```bash
   cd bytebazaar-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your `.env` configuration file from the template:

   ```bash
   cp .env.example .env
   ```

4. Open `.env` and fill in your values:
   - Set `MDB_URL` and `SESSION_DB_URL` to your MongoDB connection string (Atlas or `mongodb://127.0.0.1:27017/ByteBazaar`).
   - Set `JWT_SECRET_KEY` and `SESSION_SECRET_KEY` to secure random strings.
   - Configure your admin login credentials (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).
   - (Optional) Add your `STRIPE_TEST_KEY` for checkout testing.

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   _The backend runs by default at `http://localhost:5669`._

---

### 2. Frontend Setup

1. Open a new terminal tab and navigate to the frontend folder:

   ```bash
   cd bytebazaar-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Verify backend connection:
   The frontend references the backend API URL defined in `src/config/global-info.json` under `server.uri` (defaults to `http://127.0.0.1:5669/`). If your backend runs on a different port, update that value.

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   _The frontend will typically run at `http://localhost:5173`._

---

## Important Configuration Notes

### Database Connection Strings

In `bytebazaar-backend/.env`, you have two database parameters:

- `MDB_URL`: The primary connection used by Mongoose for application data.
- `SESSION_DB_URL`: The connection used by `connect-mongo` to store Express sessions.

If you are using **MongoDB Atlas**, make sure your connection string includes the database name:

```env
MDB_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ByteBazaar?retryWrites=true&w=majority"
SESSION_DB_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/Sessions?retryWrites=true&w=majority"
```

If you are running **MongoDB locally**:

```env
MDB_URL="mongodb://127.0.0.1:27017/ByteBazaar"
SESSION_DB_URL="mongodb://127.0.0.1:27017/ByteBazaar"
```

### Initial Administrator Account

When the backend starts up, `utils/init_admin.js` runs automatically. If no account exists with the email specified in `ADMIN_EMAIL`, it creates a default administrator user with the password from `ADMIN_PASSWORD`. You can use these credentials to log in to the admin panel.

---

## Scripts

### Backend (`bytebazaar-backend/`)

- `npm run dev` - Starts the backend server with `nodemon` for auto-reloading.
- `npm test` - Runs the server once using `node server.js`.

### Frontend (`bytebazaar-frontend/`)

- `npm run dev` - Starts the Vite development server.
- `npm run build` - Type-checks with `tsc` and builds the production bundle.
- `npm run preview` - Locally previews the production build.
- `npm run lint` - Runs ESLint.

---

## License

This project is licensed under the MIT License.
