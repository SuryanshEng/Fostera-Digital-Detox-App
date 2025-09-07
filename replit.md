# Screen Time Management App

## Overview

This is a comprehensive digital wellness application built to help users monitor and manage their screen time usage. The app provides real-time tracking of device usage, focus session management, wellness tips, and achievement systems to promote healthier digital habits. It features a modern React frontend with Express.js backend, using PostgreSQL for data persistence and offering both desktop and mobile-responsive interfaces.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Radix UI primitives for accessible, unstyled components

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful APIs with JSON responses
- **Session Management**: Express sessions with PostgreSQL session store
- **Development**: Hot module replacement with Vite integration in development mode

### Data Storage Solutions
- **Database**: PostgreSQL as the primary relational database
- **ORM**: Drizzle ORM for type-safe database queries and schema management
- **Schema**: Comprehensive data model covering users, screen time entries, app usage, focus sessions, daily quotes, achievements, and user settings
- **Migrations**: Drizzle Kit for database schema migrations and management

### Authentication and Authorization
- **User Management**: Basic user system with profile management
- **Session Handling**: Server-side sessions stored in PostgreSQL
- **Security**: Input validation using Zod schemas for data integrity

### Component Architecture
- **Layout System**: Responsive design with separate mobile and desktop navigation
- **Page Structure**: Modular page components for Dashboard, Screen Time, Focus Mode, Wellness, Achievements, and Settings
- **Component Library**: Reusable UI components following atomic design principles
- **State Patterns**: Custom hooks for real-time updates and mobile detection

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **express**: Web application framework for the backend API

### UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating component variants
- **clsx**: Conditional className utility

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **tsx**: TypeScript execution for Node.js

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **wouter**: Lightweight React router
- **react-hook-form**: Form handling with validation
- **zod**: Schema validation for type-safe data handling

### Monitoring and Analytics
- **embla-carousel-react**: Carousel component for data visualization
- **cmdk**: Command palette interface for enhanced user experience