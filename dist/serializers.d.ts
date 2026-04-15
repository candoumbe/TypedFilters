/**
 * Serialization utilities for DataFilters expressions.
 */
import { IFilter } from "./expressions";
/** Serialize an IFilter to a plain JavaScript object. */
export declare function toDict(filter: IFilter): Record<string, unknown>;
/** Serialize an IFilter to a JSON string. */
export declare function toJson(filter: IFilter, space?: number): string;
/**
 * Deserialize a plain object into an IFilter.
 *
 * @param data - An object produced by {@link toDict}.
 * @returns The reconstructed IFilter.
 * @throws {Error} If the object does not represent a known filter type.
 */
export declare function fromDict(data: Record<string, unknown>): IFilter;
//# sourceMappingURL=serializers.d.ts.map