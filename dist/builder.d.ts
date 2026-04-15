/**
 * Fluent builder API for constructing DataFilters filter expressions.
 */
import { IFilter } from "./expressions";
/** Internal helper that provides filter-condition methods for a single field. */
export declare class FieldBuilder {
    private readonly parent;
    private readonly field;
    constructor(parent: FilterBuilder, field: string);
    /** Add an equals condition. */
    eq(value: unknown): FilterBuilder;
    /** Add a contains condition. */
    contains(value: string): FilterBuilder;
    /** Add a starts-with condition. */
    startsWith(value: string): FilterBuilder;
    /** Add an ends-with condition. */
    endsWith(value: string): FilterBuilder;
    /** Add a greater-than condition. */
    gt(value: unknown): FilterBuilder;
    /** Add a greater-than-or-equal condition. */
    gte(value: unknown): FilterBuilder;
    /** Add a less-than condition. */
    lt(value: unknown): FilterBuilder;
    /** Add a less-than-or-equal condition. */
    lte(value: unknown): FilterBuilder;
    /** Add a not-equals condition. */
    not(value: unknown): FilterBuilder;
    /** Add a OneOf condition matching any of the given values. */
    oneOf(...values: unknown[]): FilterBuilder;
    /** Add an OR condition matching any of the given values. */
    or(leftValue: unknown, rightValue: unknown): FilterBuilder;
}
/**
 * Fluent builder for constructing compound filter expressions.
 *
 * @example
 * ```ts
 * const filter = new FilterBuilder()
 *   .where('name').contains('bat')
 *   .andWhere('age').gte(18)
 *   .build();
 * ```
 */
export declare class FilterBuilder {
    private readonly filters;
    /** @internal */
    addFilter(filter: IFilter): FilterBuilder;
    /**
     * Start a filter condition for the given field.
     * @param field - The name of the field to filter on.
     */
    where(field: string): FieldBuilder;
    /**
     * Chain an additional AND condition on a new field.
     * @param field - The name of the field for the next condition.
     */
    andWhere(field: string): FieldBuilder;
    /**
     * Construct and return the final IFilter.
     *
     * @returns A single IFilter or an AndFilterExpression combining all accumulated conditions.
     * @throws {Error} If no conditions have been added.
     */
    build(): IFilter;
}
//# sourceMappingURL=builder.d.ts.map