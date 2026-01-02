# Artist Portal - Copilot Instructions

## Project Overview
Artist Portal is a full-stack demo of a music services agency dashboard built with Nuxt 4, Vue 3, Tailwind CSS, and SQLite.

## Tech Stack
- **Framework**: Nuxt 4 with Vue 3
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide Icons
- **Database**: SQLite with Drizzle ORM
- **API**: Nitro server routes
- **Animations**: @vueuse/motion
- **Charts**: Chart.js
- **Validation**: Zod
- **Package Manager**: Yarn

## Project Structure
```
/
├── app/                    # Nuxt app directory
│   ├── components/         # Vue components
│   │   ├── ui/            # Base UI components (shadcn-vue style)
│   │   ├── layout/        # Layout components
│   │   └── features/      # Feature-specific components
│   ├── composables/       # Vue composables
│   ├── layouts/           # Nuxt layouts
│   ├── pages/             # File-based routing
│   ├── middleware/        # Route middleware
│   └── assets/            # Static assets
├── server/                # Nitro server
│   ├── api/              # API routes
│   ├── db/               # Database files
│   │   ├── schema.ts     # Drizzle schema
│   │   ├── index.ts      # DB connection
│   │   └── dev.sqlite    # SQLite database
│   ├── utils/            # Server utilities
│   └── middleware/       # Server middleware
├── shared/               # Shared types and utilities
└── public/               # Public static files
```

## Design System
- **Theme**: Dark mode by default with light mode toggle
- **Colors**: Electric violet primary, cyan accents
- **Style**: Card-heavy, glassy panels, 2xl rounded corners
- **Typography**: Clean, strong spacing

## Key Commands
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn db:seed` - Seed database with demo data
- `yarn db:reset` - Reset and reseed database

## Demo Users
- **Artist Demo**: artist@demo.com (role: artist)
- **Admin Demo**: admin@demo.com (role: admin)
- **Demo Passcode**: DEMO2026

## API Conventions
- All API routes under `/api/`
- Auth routes: `/api/auth/*`
- Admin routes: `/api/admin/*`
- Use Zod for request validation
- Return consistent JSON responses
