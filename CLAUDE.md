# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 19 + TypeScript + Inertia.js v2
- **Styling**: Tailwind CSS v4
- **UI**: Radix UI primitives + shadcn/ui pattern (components in `resources/js/components/ui/`)
- **Icons**: Lucide React + Tabler Icons
- **Build**: Vite 6
- **Database**: MySQL (via XAMPP)

## Commands

### Development
```bash
composer run dev        # Runs PHP server, queue worker, pail logger, and Vite concurrently
npm run dev             # Vite dev server only
```

### Building
```bash
npm run build           # Production frontend build
npm run build:ssr       # SSR build
```

### Code Quality
```bash
npm run lint            # ESLint with auto-fix
npm run format          # Prettier format (resources/ dir)
npm run format:check    # Check formatting without writing
npm run types           # TypeScript type check (no emit)
./vendor/bin/pint       # PHP code style fixer (Laravel Pint)
```

### Testing
```bash
composer test           # Clears config cache, then runs PHPUnit
php artisan test        # Run all tests
php artisan test --filter TestName  # Run single test
```

### Database
```bash
php artisan migrate             # Run pending migrations
php artisan migrate:fresh --seed  # Fresh migration with seeders
php artisan tinker              # Interactive REPL
```

## Architecture

### Multi-tenant Restaurant System

The app is a **multi-tenant POS/billing system** where one user can own or work at multiple restaurants.

- `User` ↔ `Restaurant` is many-to-many via `restaurant_user` pivot table (with `role` and `is_active`)
- The **active restaurant** is stored in session as `session('current_restaurant_id')`
- The **active role** is stored in session as `session('current_role')`
- Users switch restaurants via `POST /restaurant/switch` → `RestaurantSwitchController`
- `AdminOrManagerOnly` middleware restricts certain routes to admin/manager roles

### Inertia.js Data Flow

`HandleInertiaRequests` middleware (`app/Http/Middleware/HandleInertiaRequests.php`) shares global props with every page:
- `auth.user`, `auth.restaurants`, `auth.current_restaurant_id`
- `current_role` — active user role for the current restaurant
- `subscription` — `{ plan_name, status, is_pro }` for feature gating
- `currentRestaurant` — active restaurant details (name, logo, gst_no, etc.)
- `printSettings` — restaurant print config (paper size, header/footer text, etc.)
- `flash.success`, `flash.customer` — session flash data

TypeScript types for shared data live in `resources/js/types/index.d.ts`.

### Route Organization

Routes are split across files and all required in `routes/web.php`:
- `routes/web.php` — main app routes (dashboard, orders, payments, invoices, customers, menu, tables)
- `routes/newbill.php` — POS billing flow (`/newbill/menu/{category}`)
- `routes/settings.php` — profile, store, taxes, staff, print, password settings
- `routes/auth.php` — authentication routes
- `routes/api.php` — minimal API (dining tables)

### Controller Organization

```
app/Http/Controllers/
├── Auth/                  # Authentication (login, register, password reset)
├── Api/                   # API controllers (dining tables JSON)
├── Administator/          # Admin-only (plans)
├── NewBill/               # POS flow: CreateNewBillController, OrderController, PaymentController, InvoiceController, OrderHistoryController
├── Settings/              # Settings: ProfileController, StoreController, TaxController, StaffController, PasswordController, PrintSettingController, RestaurantSwitchController
└── (root)                 # CategoryController, ProductController, DiningTableController, CustomerController, DashboardController, RestaurantController
```

### New Bill / POS Flow

1. `/newbill` → redirects to first category slug for current restaurant
2. `/newbill/menu/{category}` — shows menu items filtered by category (`CreateNewBillController@getItemUsingSlug`)
3. `/newbill/menu/all` — shows all items
4. Layout: `resources/js/layouts/newBill/layout.tsx` with category sidebar nav
5. Page: `resources/js/pages/backend/newbill/createNewBill.tsx` with `CartSidebar` component
6. Order lifecycle: `POST /orders` → `PUT /orders/{order}/update-items` → `PUT /orders/{order}/update-payment-status`

### Key Model Relationships

```
User ↔ Restaurant (many-to-many, pivot: role, is_active)
Restaurant → Category → MenuItem
Restaurant → DiningTable
Restaurant → Customer
Restaurant → Order → OrderItem, OrderTax, Payment
Restaurant → Tax
Restaurant → RestaurantPrintSetting
User → UserSubscription → SubscriptionPlan
```

### Frontend Page Structure

Inertia page components in `resources/js/pages/` mirror the backend routes:
- `pages/backend/newbill/` — POS billing pages and components
- `pages/backend/orders/` — Order management (OrderMain, OrderHistory, AddItemsModal)
- `pages/backend/payments/` — Payment list and modals
- `pages/backend/invoices/` — Invoice download
- `pages/settings/` — Settings pages
- `pages/auth/` — Auth pages

Layouts in `resources/js/layouts/`:
- `newBill/layout.tsx` — Category sidebar for the POS view
- `settings/layout.tsx` — Sidebar nav for settings pages
