"use strict";
/**
 * Fluent builder API for constructing DataFilters filter expressions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterBuilder = exports.FieldBuilder = void 0;
const expressions_1 = require("./expressions");
/** Internal helper that provides filter-condition methods for a single field. */
class FieldBuilder {
    constructor(parent, field) {
        this.parent = parent;
        this.field = field;
    }
    /** Add an equals condition. */
    eq(value) {
        return this.parent.addFilter(new expressions_1.EqualsFilter(this.field, value));
    }
    /** Add a contains condition. */
    contains(value) {
        return this.parent.addFilter(new expressions_1.ContainsFilter(this.field, value));
    }
    /** Add a starts-with condition. */
    startsWith(value) {
        return this.parent.addFilter(new expressions_1.StartsWithFilter(this.field, value));
    }
    /** Add an ends-with condition. */
    endsWith(value) {
        return this.parent.addFilter(new expressions_1.EndsWithFilter(this.field, value));
    }
    /** Add a greater-than condition. */
    gt(value) {
        return this.parent.addFilter(new expressions_1.GreaterThanFilter(this.field, value));
    }
    /** Add a greater-than-or-equal condition. */
    gte(value) {
        return this.parent.addFilter(new expressions_1.GreaterThanOrEqualFilter(this.field, value));
    }
    /** Add a less-than condition. */
    lt(value) {
        return this.parent.addFilter(new expressions_1.LessThanFilter(this.field, value));
    }
    /** Add a less-than-or-equal condition. */
    lte(value) {
        return this.parent.addFilter(new expressions_1.LessThanOrEqualFilter(this.field, value));
    }
    /** Add a not-equals condition. */
    not(value) {
        return this.parent.addFilter(new expressions_1.NotFilter(new expressions_1.EqualsFilter(this.field, value)));
    }
    /** Add a OneOf condition matching any of the given values. */
    oneOf(...values) {
        const orFilters = values.map((v) => new expressions_1.EqualsFilter(this.field, v));
        return this.parent.addFilter(new expressions_1.OneOfFilter(orFilters));
    }
    /** Add an OR condition matching any of the given values. */
    or(leftValue, rightValue) {
        const left = new expressions_1.EqualsFilter(this.field, leftValue);
        const right = new expressions_1.EqualsFilter(this.field, rightValue);
        return this.parent.addFilter(new expressions_1.OrFilter(left, right));
    }
}
exports.FieldBuilder = FieldBuilder;
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
class FilterBuilder {
    constructor() {
        this.filters = [];
    }
    /** @internal */
    addFilter(filter) {
        this.filters.push(filter);
        return this;
    }
    /**
     * Start a filter condition for the given field.
     * @param field - The name of the field to filter on.
     */
    where(field) {
        return new FieldBuilder(this, field);
    }
    /**
     * Chain an additional AND condition on a new field.
     * @param field - The name of the field for the next condition.
     */
    andWhere(field) {
        return new FieldBuilder(this, field);
    }
    /**
     * Construct and return the final IFilter.
     *
     * @returns A single IFilter or an AndFilterExpression combining all accumulated conditions.
     * @throws {Error} If no conditions have been added.
     */
    build() {
        if (this.filters.length === 0) {
            throw new Error("No filter conditions have been added.");
        }
        const result = this.filters.length === 1 ? this.filters[0] : new expressions_1.AndFilter(this.filters);
        return result;
    }
}
exports.FilterBuilder = FilterBuilder;
//# sourceMappingURL=builder.js.map