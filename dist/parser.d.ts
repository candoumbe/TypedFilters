/**
 * Parser for DataFilters query syntax strings.
 *
 * Uses Chevrotain for lexer and parser implementation,
 * mirroring the C# FilterTokenParser grammar.
 *
 * Supported syntax:
 *   - `field=value`            → EqualsFilter
 *   - `field=value*`           → StartsWithFilter
 *   - `field=*value`           → EndsWithFilter
 *   - `field=*value*`          → ContainsFilter
 *   - `field=!value`           → NotFilter(EqualsFilter)
 *   - `field=[min TO max]`     → AndFilter(gte, lte)
 *   - `field=[min TO *[`       → GreaterThanOrEqualFilter
 *   - `field=]* TO max]`       → LessThanOrEqualFilter
 *   - `field=]min TO max[`     → AndFilter(gt, lt)
 *   - `field=expr1,expr2`      → AndFilter (same field)
 *   - `field=expr1|expr2`      → OrFilter
 *   - `field1=v1&field2=v2`    → AndFilter or OrFilter based on options
 */
import { IFilter } from "./expressions";
import { FilterOptions } from "./filterOptions";
/**
 * Parse a DataFilters query string into an IFilter.
 *
 * @param expression - A filter expression string, e.g. "name=*bat*" or
 *   "name=*bat*&age=[18 TO *[".
 * @param options - Optional parsing options that control how multiple
 *   criteria from different fields are combined.
 * @returns An IFilter representing the parsed expression.
 * @throws {Error} If the expression cannot be parsed.
 */
export declare function parse(expression: string, options?: FilterOptions): IFilter;
//# sourceMappingURL=parser.d.ts.map