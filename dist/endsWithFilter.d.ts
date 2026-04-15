import { IFilter } from './iFilter';
/** Matches records where a property ends with a specific string. */
export declare class EndsWithFilter implements IFilter {
    readonly field: string;
    readonly value: string;
    constructor(field: string, value: string);
    toDict(): Record<string, unknown>;
}
//# sourceMappingURL=endsWithFilter.d.ts.map