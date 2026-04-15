import { IFilter } from './iFilter';
/** Matches records where a property is greater than or equal to a value. */
export declare class GreaterThanOrEqualFilter implements IFilter {
    readonly field: string;
    readonly value: unknown;
    constructor(field: string, value: unknown);
    toDict(): Record<string, unknown>;
}
//# sourceMappingURL=greaterThanOrEqualFilter.d.ts.map