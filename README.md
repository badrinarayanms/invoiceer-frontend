for front end readme:
# Invoicer Dashboard

A modern invoice management dashboard built with Next.js, React, and Tailwind CSS. Easily create, manage, and track invoices and products for your business.

## Features

- Dashboard with quick stats (revenue, invoices, products, customers)
- Product management
- Invoice creation and management
- Responsive sidebar and top navigation
- Toast notifications for actions
- Modern UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

### Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/your-username/invoiceer-frontend.git
   cd invoicer-dashboard
   ```

2. Install dependencies:
   ```sh
   pnpm install
   # or
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` and set `NEXT_PUBLIC_BASE_URL` to your backend API URL.

4. Run the development server:
   ```sh
   pnpm dev
   # or
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend

This dashboard requires the [Invoicer Backend](https://github.com/badrinarayanms/invoiceer-backend).  
See the backend repo for setup instructions and API documentation.

## Project Structure

- `app/` — Next.js app routes and pages
- `components/` — Reusable UI components
- `hooks/` — Custom React hooks
- `lib/` — Utility functions
- `public/` — Static assets
- `styles/` — Global and component styles

## License

MIT

---

**Backend Repo:** [badrinarayanms/invoiceer-backend](https://github.com/badrinarayanms/invoiceer-backend)
