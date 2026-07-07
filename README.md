# Shopping List App

Frontend:

A shopping list application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **DaisyUI**.

The project uses a **feature-based architecture** with reusable shared components.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- DaisyUI
- Clerk Authentication
- TanStack Router
- TanStack Query
- TanStack Form
- Zod Validation

## Project Structure

```txt
src/
├── assets/
├── context/
│   └── theme/
├── features/
│   ├── auth/
│   │   └── components/
│   ├── dashboard/
│   │   ├── components/
│   │   └── shopping-list/
│   │       └── components/
│   └── home/
│       └── components/
├── routes/
├── shared/
│   ├── components/
│   └── layouts/
├── App.tsx
└── main.tsx
```

## Architecture

### `features`

Contains application-specific business features.

- `auth` handles authentication-related UI and Clerk integration.
- `home` contains the public landing page.
- `dashboard` contains protected user areas.
- `dashboard/shopping-list` belongs to the dashboard and contains the shopping list feature.

### `shared`

Contains reusable code used across multiple features.

Examples:

- Navbar
- Footer
- Buttons
- Inputs
- Layouts

### `routes`

Contains route definitions using **TanStack Router**.

### `context`

Contains global React contexts, such as the theme context.

## Forms and Validation

Forms are built with **TanStack Form**.

Validation is handled with **Zod** schemas to keep form rules type-safe and reusable.

## Data Fetching

Server state and API requests are managed with **TanStack Query**.

## Authentication

Authentication is handled with **Clerk**.

Protected dashboard routes are only available for authenticated users.
