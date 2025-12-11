# ClubSphere Client

## Overview
ClubSphere is a modern web application that helps users discover, join, and manage clubs and events. This repository contains the **client** side built with **React**, **Vite**, and **Tailwind CSS**. It provides a responsive UI, authentication via Firebase, and integration with a backend API for club data.

## Project Theme
ClubSphere aims to create a vibrant community platform where people can easily find clubs that match their interests, manage memberships, and participate in events. The design focuses on clean aesthetics, intuitive navigation, and a premium feel.

## Highlighted Features
- **Club Discovery**: Browse clubs by category, location, and popularity.
- **Event Management**: View upcoming events, register, and pay for paid events.
- **Membership System**: Free and paid tiers with Stripe integration.
- **Role‑Based Dashboards**: Separate views for Admin, Club Manager, and Member.
- **Real‑time Updates**: Data fetching and caching with TanStack Query.
- **Animations**: Smooth UI animations using Framer Motion.
- **Responsive Design**: Mobile‑first layout with Tailwind utilities.
- **Secure Auth**: Firebase Email/Password and Google sign‑in.

## Tech Stack
- **React 19** – UI library
- **Vite** – Fast dev server & bundler
- **Tailwind CSS** – Utility‑first styling
- **DaisyUI** – Tailwind component library
- **Firebase** – Authentication & optional Firestore
- **React Query (TanStack)** – Data fetching & caching
- **Framer Motion** – Animations
- **Axios** – HTTP client
- **ESLint + Prettier** – Code quality & formatting

## Prerequisites
- Node.js (>=18) and npm (or Yarn)
- Git

## Getting Started
```bash
# Clone the repository
git clone this repo link
cd ClubSphere/client

# Install dependencies
npm install
```

## Development
```bash
npm run dev   # Starts Vite dev server at http://localhost:5173
```
Open the URL in your browser. Hot‑module replacement updates the UI instantly.

## Build for Production
```bash
npm run build   # Generates optimized static assets in the dist/ folder
npm run preview # Serves the built app locally for a quick sanity check
```

## Linting & Formatting
```bash
npm run lint    # Runs ESLint
npm run format  # (If configured) runs Prettier
```

## Project Structure
```
client/
├─ public/                # Static assets (favicon, etc.)
├─ src/
│  ├─ assets/            # Images, icons
│  ├─ components/        # Reusable UI components
│  ├─ layouts/           # Page layout components
│  ├─ pages/             # Route‑level pages (public, protected)
│  │   └─ public/        # Public pages like Home, Register, Login, Clubs
│  ├─ providers/         # Context providers (React Query, Auth)
│  ├─ routes/            # React Router configuration
│  ├─ utils/             # Helper functions & API wrappers
│  ├─ App.jsx            # Root component
│  ├─ main.jsx           # Entry point (ReactDOM.render)
│  └─ index.css          # Global Tailwind imports
├─ .env.example          # Example environment variables
├─ vite.config.js        # Vite configuration (plugins, alias)
├─ tailwind.config.js   # Tailwind configuration
├─ postcss.config.js    # PostCSS configuration
└─ README.md             # This file
```

## Environment Variables
Create a `.env` file based on `.env.example`. Typical variables include:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_BACKEND_URL`











## Deployment Checklist
- Verify CORS is correctly configured.
- Ensure the live URL loads without errors.
- Confirm authentication state persists after page reloads.
- Test on multiple browsers and devices for responsiveness.

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes with clear messages
4. Open a Pull Request describing the changes

## License
This project is licensed under the MIT License – see the `LICENSE` file for details.

---

