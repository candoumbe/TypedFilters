# DataFilters

DataFilters is a TypeScript port of the original [candoumbe/DataFilters](https://github.com/candoumbe/DataFilters) project. It helps you build and parse filter expressions with a compact query-string-like syntax, then serialize them into plain objects or JSON.

This repository contains:

- a TypeScript library published as `datafilters`
- a Chevrotain-based parser for filter expressions
- a fluent builder API for programmatic filter creation
- a React playground for trying expressions interactively

## Installation

Install the package from npm:

```bash
npm install datafilters
```

For local development in this repository:

```bash
npm install
npm run playground:install
```

## Quick Start

### Parse a string expression

```ts
import { parse, toJson } from "datafilters";

const filter = parse("name=*bat*&age=[18 TO *[");

console.log(toJson(filter, 2));
```

### Build filters programmatically

```ts
import { FilterBuilder } from "datafilters";

const filter = new FilterBuilder()
  .where("name").contains("bat")
  .andWhere("age").gte(18)
  .build();
```

## Public API

The package root exports:

- `parse(expression, options?)`
- `FilterBuilder` and `FieldBuilder`
- `FilterLogic` and `FilterOptions`
- `toDict(filter)`, `toJson(filter, space?)`, and `fromDict(data)`
- `IFilter`
- `EqualsFilter`
- `ContainsFilter`
- `StartsWithFilter`
- `EndsWithFilter`
- `GreaterThanFilter`
- `GreaterThanOrEqualFilter`
- `LessThanFilter`
- `LessThanOrEqualFilter`
- `AndFilter`
- `OrFilter`
- `NotFilter`

Note that `OneOfFilter` exists internally and is used by the builder and parser for some OR combinations, but it is not exported from the package root.

## Filter Syntax

The parser accepts expressions shaped like `field=value`.

- `field` is the property name to filter on
- `value` is the expression applied to that property
- multiple top-level criteria are commonly separated with `&`
- the parser also accepts a leading `?` and will normalize URL query strings before parsing

Example:

```text
name=*bat*&age=[18 TO *[
```

### Equals

Use plain text for exact equality.

```text
name=Batman
status=active
age=30
```

Builder equivalent:

```ts
new FilterBuilder().where("name").eq("Batman").build();
```

### Contains

Wrap the value with `*` on both sides.

```text
name=*bat*
```

This produces a `ContainsFilter`.

Builder equivalent:

```ts
new FilterBuilder().where("name").contains("bat").build();
```

### Starts With

Add `*` at the end of the value.

```text
name=Bat*
```

This produces a `StartsWithFilter`.

Builder equivalent:

```ts
new FilterBuilder().where("name").startsWith("Bat").build();
```

### Ends With

Add `*` at the beginning of the value.

```text
name=*man
```

This produces an `EndsWithFilter`.

Builder equivalent:

```ts
new FilterBuilder().where("name").endsWith("man").build();
```

### Not

Prefix a single expression with `!`.

```text
name=!Batman
name=!Bat*
```

Important: in this TypeScript parser, `!` negates the next single expression, not an entire grouped expression.

For example:

```text
status=!active|pending
```

means:

```text
(NOT status=active) OR status=pending
```

Builder equivalent for not-equals:

```ts
new FilterBuilder().where("name").not("Batman").build();
```

### Greater Than

Use an exclusive lower bound and an unbounded upper side.

```text
age=]18 TO *[
```

This produces a `GreaterThanFilter`.

Builder equivalent:

```ts
new FilterBuilder().where("age").gt(18).build();
```

### Greater Than Or Equal

Use an inclusive lower bound and an unbounded upper side.

```text
age=[18 TO *[
```

This produces a `GreaterThanOrEqualFilter`.

Builder equivalent:

```ts
new FilterBuilder().where("age").gte(18).build();
```

### Less Than

Use an unbounded lower side and an exclusive upper bound.

```text
age=]* TO 65[
```

This produces a `LessThanFilter`.

Builder equivalent:

```ts
new FilterBuilder().where("age").lt(65).build();
```

### Less Than Or Equal

Use an unbounded lower side and an inclusive upper bound.

```text
age=]* TO 65]
```

This produces a `LessThanOrEqualFilter`.

Builder equivalent:

```ts
new FilterBuilder().where("age").lte(65).build();
```

### Between Ranges

The parser also supports bounded ranges and turns them into an `AndFilter` of two comparisons.

Inclusive range:

```text
age=[18 TO 65]
```

Exclusive range:

```text
age=]18 TO 65[
```

Mixed bounds are also supported:

```text
age=[18 TO 65[
age=]18 TO 65]
```

## Logical Composition

### AND

There are two common AND forms.

Across multiple fields:

```text
name=*bat*&age=[18 TO *[
```

On the same field, using inherited field syntax after a comma:

```text
name=*an,bat*
```

That second example means both expressions apply to `name`.

Builder equivalent:

```ts
new FilterBuilder()
  .where("name").contains("bat")
  .andWhere("age").gte(18)
  .build();
```

### OR

Use `|` between alternatives on the same field.

```text
status=active|pending
name=Bat*|*man
```

Two alternatives produce an `OrFilter`.

Three or more alternatives are represented internally as an OR-style composite and serialize as:

```json
{
  "logic": "or",
  "filters": [
    { "field": "status", "op": "eq", "value": "active" },
    { "field": "status", "op": "eq", "value": "pending" },
    { "field": "status", "op": "eq", "value": "archived" }
  ]
}
```

### One Of

This TypeScript port does not expose the curly-brace any-of syntax documented in the original C# repository.

Instead, use one of these supported forms:

1. Pipe-separated parser syntax for three or more alternatives:

```text
status=active|pending|archived
```

1. The builder helper:

```ts
const filter = new FilterBuilder()
  .where("status")
  .oneOf("active", "pending", "archived")
  .build();
```

Both forms serialize to the same OR-style structure.

## Escaping and Special Characters

The parser reserves these characters in expressions:

```text
\ = , | ! * [ ]
```

Escape them with a backslash when you want a literal value.

Examples:

```text
name=Bat\*
status=active\|pending
name=foo\,bar
name=foo\&bar
name=\!abc
name=foo\\bar
```

Literal spaces must also be escaped if you want to preserve them in parsed values:

```text
name=Bruce\ Wayne
```

## URL-Encoded Input

The parser normalizes query-string-like input before parsing.

Supported behaviors:

- a leading `?` is ignored
- top-level `&` separators split field-value pairs
- percent-encoded reserved characters are decoded before parsing
- escaped ampersands such as `\&` remain part of the value

Example:

```ts
parse("?name=*bat*&age=[18 TO *[");
parse("name=%2Abat%2A&age=%5B18%20TO%20*%5B");
```

Important: once decoded, whitespace is skipped by the lexer unless it is escaped. That means `%20` inside a value does not preserve a literal space by itself.

## FilterOptions

`FilterOptions` controls how top-level criteria from different fields are combined after normalization.

Default behavior:

```ts
import { parse } from "datafilters";

parse("name=Batman&age=30");
```

This returns an `AndFilter`.

Override with OR:

```ts
import { FilterLogic, FilterOptions, parse } from "datafilters";

const options = new FilterOptions({ logic: FilterLogic.Or });
const filter = parse("name=Batman&age=30", options);
```

This returns an `OrFilter` for two top-level groups, or an OR-style composite for more than two.

Important:

- `FilterOptions` affects top-level groups
- `,` still means AND inside a field sequence
- `|` still means OR inside a field expression

## Parsing Notes

- Parsed values remain textual. For example, `parse("age=30")` produces a filter whose value is the string `"30"`.
- Builder methods keep the value type you pass in, such as `18`, `true`, or a `Date` object.
- This implementation does not document parenthesized expressions or nested grouped logic in the parser.

## Serialization

Use the serializer helpers to inspect or persist filters.

```ts
import { fromDict, parse, toDict, toJson } from "datafilters";

const filter = parse("name=*bat*&age=[18 TO *[");

const asObject = toDict(filter);
const asJson = toJson(filter, 2);
const restored = fromDict(asObject);
```

## Development Commands

Build the library:

```bash
npm run build
```

Run tests:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

Install playground dependencies:

```bash
npm run playground:install
```

Prepare the playground after a fresh clone:

```bash
npm run playground:prepare
```

Start the playground in development mode:

```bash
npm run playground:dev
```

Build the playground:

```bash
npm run playground:build
```

## Playground

The repository includes a Vite + React playground in `playground/` so you can try expressions and inspect the resulting JSON visually.

When the dev server is running, open:

```text
http://localhost:5173
```

## Status

The current package version is `0.1.0`. The API is still young and may evolve as the TypeScript port grows closer to the original DataFilters feature set.

## License

MIT
