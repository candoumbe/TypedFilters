# Playground DataFilters

This React playground lets you visually test filter expressions from the DataFilters library.

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

From the repository root:

```bash
npm install
npm run playground:install
```

## Run the playground (development mode)

### Recommended option: from the root

This command builds the library, then starts Vite in the playground folder.

```bash
npm run playground:dev
```

Then open your browser at the displayed URL (usually http://localhost:5173).

### Direct option: from the playground folder

If the library is already built:

```bash
cd playground
npm run dev
```

## Build and preview

### Full build from the root

```bash
npm run playground:build
```

### Preview the build from playground

```bash
cd playground
npm run preview
```

## Useful commands (developer)

From playground:

```bash
npm run typecheck
npm run lint
```

## Quick troubleshooting

- Port already in use: change the Vite port (example: `npm run dev -- --port 5174`).
- `datafilters` package resolution error: make sure the library is built (`npm run build` at the root), since playground depends on `"datafilters": "file:.."`.
- Missing dependencies in playground: run `npm run playground:install` again from the root.
