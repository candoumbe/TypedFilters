import { IFilter } from './iFilter';
/** Matches records where a property starts with a specific string. */
export declare class StartsWithFilter implements IFilter {
    readonly field: string;
    readonly value: string;
    constructor(field: string, value: string);
    toDict(): Record<string, unknown>;
}
//# sourceMappingURL=startsWithFilter.d.ts.map