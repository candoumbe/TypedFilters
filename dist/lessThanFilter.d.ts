import { IFilter } from './iFilter';
/** Matches records where a property is less than a value. */
export declare class LessThanFilter implements IFilter {
    readonly field: string;
    readonly value: unknown;
    constructor(field: string, value: unknown);
    toDict(): Record<string, unknown>;
}
//# sourceMappingURL=lessThanFilter.d.ts.map