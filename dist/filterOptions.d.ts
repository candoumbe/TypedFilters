/**
 * Logic applied when combining multiple filter criteria.
 * Mirrors the C# `FilterLogic` enum.
 */
export declare enum FilterLogic {
    And = "and",
    Or = "or"
}
/**
 * Options for customizing filter parsing behaviour.
 * Allows specifying how multiple criteria separated by `&` should be combined (AND vs OR).
 *
 * @example
 * ```typescript
 * // comma-separated parts will be combined with OR instead of AND
 * const options = new FilterOptions({ logic: FilterLogic.Or });
 * const filter = parse("name=Batman&age=30", options);
 * // → OrFilter([EqualsFilter("name","Batman"), EqualsFilter("age","30")])
 * ```
 */
export declare class FilterOptions {
    /**
     * Logic to apply when combining multiple filter criteria separated by `&` delimiter.
     *
     * Defaults to `FilterLogic.And`.
     */
    readonly logic: FilterLogic;
    constructor({ logic }?: {
        logic?: FilterLogic;
    });
}
//# sourceMappingURL=filterOptions.d.ts.map