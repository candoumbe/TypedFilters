# Getting Started

## Installation

```bash
npm install datafilters-typescript
```

## Usage

```typescript
import {
  parse,
  toJson,
  FilterLogic,
  FilterOptions,
} from "datafilters-typescript";

// Parse a filter expression
const options = new FilterOptions({ logic: FilterLogic.And });
const result = parse("name=*bat*&age=[18 TO *[", options);
const json = toJson(result, 2);
console.log(json);
```

## Local React Playground

The repository includes a React playground (Vite + TypeScript) to test the parser locally.

From the repository root:

```bash
npm run playground:dev
```

This script:

- Builds the TypeScript library
- Installs playground dependencies
- Launches Vite in development mode

Build the playground for production:

```bash
npm run playground:build
```

The development server runs on `http://localhost:5173/`

## API Reference

### `parse(expression: string, options?: FilterOptions)`

Parses a filter expression string and returns a filter object.

**Example:**

```typescript
const filter = parse("status=active|pending&country=FR");
```

### `toJson(filter: FilterLogic | IFilter, indent?: number): string`

Serializes a filter object to JSON string.

**Example:**

```typescript
const json = toJson(filter, 2);
console.log(json);
```

### `FilterOptions`

Configuration for the parser.

- `logic: FilterLogic` - Default logic for combining fields (AND or OR)

### `FilterLogic`

Enum with values: `And`, `Or`
