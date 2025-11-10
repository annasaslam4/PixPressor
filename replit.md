# Image Compressor & Converter Web App

## Overview

A privacy-first image compression and conversion web application that processes images entirely in the browser. Users can compress, convert, and resize images across multiple formats (JPG, PNG, WEBP, HEIC, AVIF, BMP, SVG, TIFF) without uploading files to any server. The application features smart compression presets, platform-specific resize options (Instagram, Shopify, Etsy), and bulk processing capabilities with ZIP download support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, built using Vite for development and production bundling.

**UI Component System**: Shadcn/ui components with Radix UI primitives, following the "new-york" style variant. All components are co-located in `client/src/components/ui/` and use Tailwind CSS for styling with CSS variables for theming.

**Routing**: Wouter for lightweight client-side routing (single-page application with minimal routes).

**State Management**: 
- React hooks for local component state
- TanStack Query (React Query) for server state management and caching
- No global state management library (Redux/Zustand) - application relies on React's built-in state management

**Styling System**:
- Tailwind CSS with custom design tokens defined in CSS variables
- Dual theme support (light/dark mode) via ThemeProvider
- Typography: Inter for UI/body text, Poppins for headings
- Custom spacing system using Tailwind's spacing scale
- Design follows utility-first approach with premium polish aesthetic

**Image Processing**: 
- Client-side only processing using `browser-image-compression` library
- HEIC conversion via `heic2any`
- File handling with `file-saver` for downloads
- JSZip for bulk ZIP downloads
- No server-side processing - all operations happen in the browser for privacy

**PWA Support** (NEW):
- Progressive Web App capabilities with service worker (`public/sw.js`)
- Offline caching of static assets and processed images
- Installable app experience on mobile and desktop
- Install prompt component with dismissible UI
- App manifest with icons and metadata
- Works offline after first visit

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**API Design**: RESTful API structure with `/api` prefix for all application routes (currently minimal implementation - most logic is client-side)

**Development Setup**:
- Vite middleware integration for hot module replacement in development
- Custom request logging middleware
- JSON body parsing with raw body preservation for webhook support

**Storage Interface**: Abstract storage interface (`IStorage`) with in-memory implementation (`MemStorage`). Designed to be swappable with database-backed storage if needed in the future.

**Build Process**:
- Frontend: Vite build outputs to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Separate dev/production modes with environment-based configuration

### Data Storage Solutions

**Current Implementation**: In-memory storage only (no persistence)

**Database Configuration**: 
- Drizzle ORM configured for PostgreSQL via `@neondatabase/serverless`
- Schema defined in `shared/schema.ts`
- Migration support via `drizzle-kit`
- Database connection expects `DATABASE_URL` environment variable

**Note**: The application is currently configured for database integration but doesn't actively use it. All image processing happens client-side with no data persistence. The database setup appears to be scaffolding for future features (potentially user accounts, saved presets, or processing history).

### Authentication and Authorization

**Current State**: No authentication system implemented. The application is fully client-side and doesn't require user accounts.

**Session Management**: Express session configuration present (connect-pg-simple) but not actively used.

### External Dependencies

**Image Processing Libraries**:
- `browser-image-compression`: Client-side image compression with quality/size controls
- `heic2any`: HEIC to other format conversion in the browser
- `file-saver`: Programmatic file downloads
- `jszip`: Creating ZIP archives for bulk downloads
- `react-compare-slider`: Before/after image comparison UI component

**PWA Libraries**:
- `vite-plugin-pwa`: PWA plugin for Vite (configured but using manual service worker)
- `workbox-window`: Service worker lifecycle management
- Custom service worker for offline caching and asset management

**UI Libraries**:
- Radix UI: Unstyled, accessible component primitives (30+ components)
- Tailwind CSS: Utility-first CSS framework
- class-variance-authority: Type-safe variant styling
- cmdk: Command palette component

**Database & ORM** (configured but not in active use):
- Drizzle ORM: Type-safe SQL query builder
- @neondatabase/serverless: Serverless PostgreSQL driver
- connect-pg-simple: PostgreSQL session store

**Development Tools**:
- Vite: Build tool and dev server
- tsx: TypeScript execution for Node.js
- esbuild: JavaScript bundler for production
- @replit plugins: Development banner, error overlay, cartographer (Replit-specific)

**Fonts**: Google Fonts (Inter, Poppins) loaded via CDN in HTML

**State Management**:
- @tanstack/react-query: Server state management
- react-hook-form: Form state management
- @hookform/resolvers: Form validation with Zod

**Routing**: wouter (lightweight React router alternative)

**Utility Libraries**:
- nanoid: Unique ID generation
- date-fns: Date manipulation
- clsx + tailwind-merge: Conditional class merging