# Naka ERP - Price List & Management System

A modern, hybrid ERP application built with Next.js, Tailwind CSS, and Capacitor. This platform features a public-facing Price List for guests and a secure management dashboard for internal operations.

## Features

-   **Public Price List**: A beautiful, real-time catalog of available units.
-   **Live Search**: Instant filtering by model, brand, or SKU.
-   **Hybrid Support**: Optimized for both Web and Android (via Capacitor).
-   **Inventory Management**: Comprehensive tracking of tech assets.
-   **Modern UI**: Sleek, responsive design with dark mode support.

## Tech Stack

-   **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion
-   **Database**: PostgreSQL with Drizzle ORM
-   **Icons**: Material Symbols, Lucide React
-   **Mobile**: @capacitor/android

## Getting Started

### Prerequisites

-   Node.js 18+
-   PostgreSQL database

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up your `.env` file with your `DATABASE_URL`.
4.  Run the development server:
    ```bash
    npm run dev
    ```

### Production Build

```bash
npm run build
npm start
```

## Deployment

This app is ready to be deployed on **Vercel**, **Railway**, or any Node.js hosting platform. Ensure you set up the Environment Variables in your hosting dashboard.
