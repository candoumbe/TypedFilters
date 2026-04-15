import { IFilter } from './iFilter';
/** Matches records where a property equals a specific value. */
export declare class EqualsFilter implements IFilter {
    readonly field: string;
    readonly value: unknown;
    constructor(field: string, value: unknown);
    toDict(): Record<string, unknown>;
}
//# sourceMappingURL=equalsFilter.d.ts.map