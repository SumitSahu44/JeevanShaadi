## FOG - Full Stack Shop App

React + Vite frontend and Express + MongoDB backend. Mobile-first, fully responsive UI with Tailwind CSS v4.

### Table of Contents
- Overview
- Architecture
- Getting Started
- Environment Variables
- Scripts
- API Reference
- UI/Features
- Responsiveness
- Development Notes
- Troubleshooting

### Overview
- Monorepo with `frontend` and `Backend` folders.
- Products can be listed, filtered, sorted, paginated, created, updated, and deleted.

### Architecture
- Frontend: React 19 + Vite 7, Tailwind CSS 4, lucide-react, react-icons
- Backend: Node.js, Express 5, Mongoose 8 (MongoDB)

### Getting Started
1) Frontend
```bash
cd frontend
npm install
npm run dev
```
Open the dev server URL printed in the terminal.

2) Backend
```bash
cd Backend
npm install
npm run start
```
API base URL defaults to `https://fog-backend-k9mm.onrender.com`.

### Environment Variables
Create `Backend/.env`:
```
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
```

### Scripts
Frontend (inside `frontend`):
- `npm run dev`: start dev server
- `npm run build`: build production assets
- `npm run preview`: preview production build

Backend (inside `Backend`):
- `npm run start`: start server with nodemon

### API Reference
Base URL: `https://fog-backend-k9mm.onrender.com/api/products`

- GET `/test`
  - Response: `{ message, timestamp }` – health check

- GET `/`
  - Query params: `page`, `limit`, `sortBy` (brand|price|...), `sortOrder` (asc|desc),
    `brand`, `category`, `minPrice`, `maxPrice`, `minNewPrice`, `maxNewPrice`
  - Response: `{ products, total, page, totalPages, limit, brands, categories, hasNextPage, hasPrevPage }`

- POST `/add`
  - Body JSON: `{ name, brand, category?, description?, oldPrice?, newPrice, price, image?, discount?, isNew? }`
  - Response: created product

- PUT `/:id`
  - Body JSON: same as POST (partial update allowed)
  - Response: updated product or 404

- DELETE `/:id`
  - Response: `{ message, deletedProduct }` or 404

Product Model fields:
```
name (string, required)
brand (string, required)
category (string)
description (string)
oldPrice (number)
newPrice (number, required)
price (number, required)
image (string)
discount (number, default 0)
isNew (boolean, default true)
```

### UI/Features
- Header: sticky, desktop nav + mobile menu
- Hero: banner with overlay and breadcrumb
- ProductGrid: fetches from API with sort/filter/pagination controls
- ProductCard: price display, discount/new badges, mobile action row
- AddProductPopup / UpdateProductPopup: validated forms, loading/error states
- Footer: feature highlights grid

### Responsiveness
- Grid: 1 column (mobile), 2 (sm), 3 (lg), 4 (xl)
- Controls and typography scale by breakpoint; popups switch to one-column forms on small screens and scroll within modal to avoid viewport overflow
- Images use `object-cover` and fixed height per breakpoint (`h-48 sm:h-64 lg:h-72`)

### Development Notes
- Tailwind v4 is enabled via `src/index.css` with `@import "tailwindcss";`
- Default images are in `frontend/public`
- If backend host changes, update fetch URLs in `src/ProductGrid.jsx`, `components/AddProductPopup.jsx`, and `components/UpdateProductPopup.jsx`

### Troubleshooting
- Backend not reachable: verify `PORT`, CORS, and server logs
- No products returned: check MongoDB connection string and collection contents
- CORS issues: ensure `cors()` is enabled in backend and origins are allowed
- UI not styled: ensure Tailwind is installed and Vite restarted after changes
