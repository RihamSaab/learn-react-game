# Learn React with Me

An interactive, scroll-driven tutorial that teaches the five core rules of React through mini-games set inside an animated 3D space-station scene.

## What it covers

Each level introduces one React concept, paired with a small playable game so the idea sticks:

1. **Components** — composing UI from reusable building blocks
2. **Props** — passing read-only data from parent to child
3. **State** — data a component owns and updates via a setter
4. **Effects & cleanup** — `useEffect` for side effects, and how to undo them
5. **Rules of Hooks** — why hooks must live at the top level of a component

The journey ends with a finale section that ties the five rules together.

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **React Three Fiber** / **drei** / **postprocessing** — 3D scene, companion robot, and station layout
- **Motion** (Framer Motion successor) — scroll-linked animations and UI transitions
- **styled-components** — component-scoped styling
- **ESLint** — linting

## Getting started

```bash
# install dependencies
pnpm install

# run the dev server
pnpm dev

# type-check and build for production
pnpm build

# preview the production build
pnpm preview

# lint
pnpm lint
```

Then open the URL Vite prints (usually `http://localhost:5173`) and scroll.

## Project structure

```
src/
  sections/       one folder per level (config, component, styles)
  three/          3D scene, companion robot, station layout
  ui/             shared UI pieces (progress rail, level wrapper, code block)
  hooks/          custom hooks (e.g. useScrollProgress)
  App.tsx         composes the levels and the 3D scene
public/models/    glTF assets for the 3D scene
```
