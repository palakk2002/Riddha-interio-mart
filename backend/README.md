# Riddha Mart Backend

This is the backend for Riddha Mart, built with Node.js, Express, and MongoDB following the MVC (Model-View-Controller) architecture.

## Folder Structure

```
backend/
├── src/
│   ├── config/         # Configuration (DB connection, etc.)
│   ├── controllers/    # Business logic for each route
│   ├── middleware/     # Custom express middleware (auth, error handling)
│   ├── models/         # Mongoose schemas (Product, User, etc.)
│   ├── routes/         # API route definitions
│   ├── utils/          # Helper functions/utilities
│   └── app.js          # Entry point of the application
├── uploads/            # Local storage for uploaded files
├── .env                # Environment variables (Internal use only)
├── package.json        # Dependencies and scripts
└── README.md           # Backend documentation
```

## Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root of the `backend` directory (one has been created for you with defaults).

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Run Production Server**:
    ```bash
    npm start
    ```

## API Endpoints (Example)

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product (Admin)
