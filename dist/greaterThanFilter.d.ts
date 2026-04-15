import { IFilter } from './iFilter';
/** Matches records where a property is greater than a value. */
export declare class GreaterThanFilter implements IFilter {
    readonly field: string;
    readonly value: unknown;
    constructor(field: string, value: unknown);
    toDict(): Record<string, unknown>;
}
//# sourceMappingURL=greaterThanFilter.d.ts.map