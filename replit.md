# Overview

This is a full-stack web application for "Stupid Simple Apps," a custom app development agency that specializes in building simple, tailored applications without unnecessary complexity. The project is built as a modern React frontend with an Express.js backend, featuring a marketing website with contact form functionality and specialized pages for HubSpot dashboard services.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for Home, HubSpot Dashboard, and 404
- **UI Components**: Custom component library built with Radix UI primitives and styled with Tailwind CSS
- **State Management**: React Query (TanStack Query) for server state management and React Hook Form for form handling
- **Styling**: Tailwind CSS with shadcn/ui component system and theme customization via JSON configuration

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API with `/api` prefix for all routes
- **Data Storage**: Dual storage implementation with memory storage for development and PostgreSQL integration via Drizzle ORM for production
- **Schema Management**: Type-safe database schemas using Drizzle ORM with Zod validation
- **Development Setup**: Hot reloading with Vite integration for development mode

## Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL dialect
- **Tables**: 
  - `users` table with id, username, password fields
  - `contact_submissions` table for storing form submissions with name, email, message, and timestamp
- **Migrations**: Automated migration system with schema changes tracked in `/migrations`
- **Connection**: Neon Database serverless PostgreSQL connection

## SEO and Marketing Features
- **Meta Tags**: Comprehensive SEO component with Open Graph and Twitter Card support
- **Sitemap**: Automated sitemap generation for search engine indexing
- **Analytics**: Structured for conversion tracking with Calendly and Tally form integrations
- **Performance**: Optimized images, font loading, and lazy loading strategies

## Development Workflow
- **Build Process**: Vite for frontend bundling, esbuild for server-side compilation
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Path Aliases**: Configured aliases for clean imports (`@/` for client, `@shared/` for shared code)
- **Hot Reloading**: Development server with automatic reload on file changes

## Content Management
- **Static Assets**: Public directory structure with optimized images and icons
- **Contact Forms**: Integration with external form services (Tally) and internal API endpoints
- **Appointment Scheduling**: Calendly integration for consultation booking

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle Kit**: Database migration and schema management tools

## Frontend Libraries
- **Radix UI**: Headless component primitives for accessibility and behavior
- **Tailwind CSS**: Utility-first CSS framework with custom theme configuration
- **React Query**: Server state management and caching layer
- **React Hook Form**: Form handling with validation
- **Zod**: Runtime type validation and schema definition

## Backend Services
- **Express.js**: Web application framework for Node.js
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking across the entire codebase
- **ESBuild**: Fast JavaScript bundler for production builds

## Third-Party Integrations
- **Calendly**: Appointment scheduling for consultation calls
- **Tally**: Form builder for lead capture and contact forms
- **Google Fonts**: Web font loading for Inter font family

## Deployment Infrastructure
- **Replit**: Development and hosting platform with custom Vite plugins
- **Environment Variables**: Configuration management for database connections and external service URLs