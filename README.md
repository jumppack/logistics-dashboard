# Real-Time Logistics Dashboard

A high-performance logistics monitoring dashboard built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Zustand**. 

The dashboard is specifically architected to demonstrate advanced Frontend System Design patterns. It explicitly handles updating 1,000+ localized data points alongside a high-frequency (2-second interval) global polling environment without triggering React's concurrent render cascading, dropping frames, or blocking the V8 main thread.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react)

## Core Features
1. **Normalized Grid State Store**: A Zustand state implementation completely bypassing flat-arrays in favor of a `Record<string, Order>` dictionary setup to achieve atomic component reactivity (O(1) lookups).
2. **Infinite DOM Windowing**: Utilization of `react-window` to cut standard DOM node allocations by 98% (reducing 1000 items down to ~15 active nodes in bounds).
3. **Memoized Reference Stability**: Heavily isolated React Fiber tree preservations via `React.memo` and strictly curried `useCallback` tracking to abort global diff checks.
4. **Decoupled Simulation Scoping**: High-frequency intervals (the 2s driver simulation) are purely partitioned by localized `useInterval` hooks to secure garbage-collection against V8 macro-tasks and safely circumvent memory leaks.

## Deep Dive Architecture
For a comprehensive analysis of the architectural patterns utilized within the dashboard, please view the internal documentation:
- [📖 Performance & Memory Architecture Specification](./docs/performance-and-memory-architecture.md)

## Development

### Prerequisites
- Node.js >= 18
- NPM / Yarn

### Installation

1. Copy the repository components:
```bash
git clone https://github.com/jumppack/logistics-dashboard.git
```
2. Navigate to the project directory:
```bash
cd logistics-dashboard
```
3. Install dependencies:
```bash
npm install
```
4. Start the Vite dev server:
```bash
npm run dev
```

## Contributing
Standard Vite configuration bounds apply. Pull requests are welcomed for expanding polling constraints or enhancing state tracking logic.
