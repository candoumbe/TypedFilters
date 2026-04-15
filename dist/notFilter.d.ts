import { IFilter } from "./iFilter";
/** Negates a filter expression. */
export declare class NotFilter implements IFilter {
    readonly filter: IFilter;
    constructor(filter: IFilter);
    toDict(): Record<string, unknown>;
}
//# sourceMappingURL=notFilter.d.ts.map