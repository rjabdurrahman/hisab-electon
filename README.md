# Electron + React 19 + Tailwind 4 Boilerplate

**Electron • React • Tailwind • SQLite • TypeORM**

A professional, high-performance **Electron Boilerplate** designed for scalable desktop applications. This repository provides a production-ready starter-kit utilizing the latest **React 19**, **Vite 7**, and **Tailwind CSS 4** ecosystem, with a built-in **SQLite** persistence layer managed by **TypeORM**.

> [!NOTE]  
> This is a **Boilerplate App**, not a dedicated Inventory Manager. The included "Simple Inventory" module serves as a **Reference Implementation** to demonstrate the architecture and database patterns.

## 🚀 Key Architecture Features

- **Unified Service-Action Pattern**: A centralized IPC gateway (`api-invoke`) to route renderer actions to main-process services, ensuring a "Thin UI" and secure database access.
- **SQLite Persistence**: Industrial-grade data tracking via `better-sqlite3` and `TypeORM` (0.3+), utilizing the Data Source API.
- **Tailwind CSS 4 (v4.0+)**: "CSS-first" configuration with custom `@theme` and `@custom-variant` directives for advanced theme management.
- **Modern React 19 Stack**: Fast-refresh, lightweight renderer utilizing Vite 7.
- **Theme Engine**: Robust Light/Dark mode toggling with instant transition-aware CSS variables.

## 🛠 Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/)
- **Frontend**: [React 19](https://react.dev/), [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [SQLite](https://www.sqlite.org/) via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3)
- **ORM**: [TypeORM 0.3+](https://typeorm.io/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS)
- [pnpm](https://pnpm.io/) (Recommended)

### Installation
```bash
# Install dependencies
pnpm install
```

### Development
```bash
# Start the app in development mode
pnpm dev
```

### Production Build
```bash
# Build for Windows (.exe)
pnpm run build:win
```

## 📁 Project Structure
- **`src/main`**: Main-process business logic and IPC Service-Action gateway.
- **`src/renderer`**: The React application (Vite-powered).
- **`src/preload`**: Secure ContextBridge API exposing only specific invoke channels.

## 🔒 Security
- **Context Isolation**: Enabled to protect against Node-level vulnerabilities.
- **Sandbox Mode**: Enabled for maximum renderer security.
- **IPC Gateway**: Only validated `action` strings are processed by the main process.

## 📜 License
MIT License. Crafted by Antigravity for the Electron Developer Community.
