import { IFilter } from './iFilter';
/** Matches records where a property is less than or equal to a value. */
export declare class LessThanOrEqualFilter implements IFilter {
    readonly field: string;
    readonly value: unknown;
    constructor(field: string, value: unknown);
    toDict(): Record<string, unknown>;
}
//# sourceMappingURL=lessThanOrEqualFilter.d.ts.map