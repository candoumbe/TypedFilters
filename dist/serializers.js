"use strict";
/**
 * Serialization utilities for DataFilters expressions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDict = toDict;
exports.toJson = toJson;
exports.fromDict = fromDict;
const expressions_1 = require("./expressions");
/** Serialize an IFilter to a plain JavaScript object. */
function toDict(filter) {
    return filter.toDict();
}
/** Serialize an IFilter to a JSON string. */
function toJson(filter, space) {
    return JSON.stringify(toDict(filter), null, space);
}
const OP_MAP = {
    eq: expressions_1.EqualsFilter,
    contains: expressions_1.ContainsFilter,
    startswith: expressions_1.StartsWithFilter,
    endswith: expressions_1.EndsWithFilter,
    gt: expressions_1.GreaterThanFilter,
    gte: expressions_1.GreaterThanOrEqualFilter,
    lt: expressions_1.LessThanFilter,
    lte: expressions_1.LessThanOrEqualFilter,
};
/**
 * Deserialize a plain object into an IFilter.
 *
 * @param data - An object produced by {@link toDict}.
 * @returns The reconstructed IFilter.
 * @throws {Error} If the object does not represent a known filter type.
 */
function fromDict(data) {
    let result;
    if ("logic" in data) {
        const logic = data["logic"];
        if (typeof logic !== "string") {
            throw new Error(`Invalid logic type: expected string, got ${typeof logic}`);
        }
        const filtersData = data["filters"];
        if (!Array.isArray(filtersData)) {
            throw new Error(`Invalid filters type: expected array, got ${typeof filtersData}`);
        }
        const children = filtersData.map(fromDict);
        if (logic === "and") {
            result = new expressions_1.AndFilter(children);
        }
        else if (logic === "or") {
            result =
                children.length === 2
                    ? new expressions_1.OrFilter(children[0], children[1])
                    : new expressions_1.OneOfFilter(children);
        }
        else if (logic === "not") {
            if (children.length === 0) {
                throw new Error("Not filter requires at least one child filter");
            }
            result = new expressions_1.NotFilter(children[0]);
        }
        else {
            throw new Error(`Unknown logic operator: '${logic}'`);
        }
    }
    else {
        const op = data["op"];
        if (typeof op !== "string") {
            throw new Error(`Invalid op type: expected string, got ${typeof op}`);
        }
        const Ctor = OP_MAP[op];
        if (!Ctor) {
            throw new Error(`Unknown filter operator: '${op}'`);
        }
        const field = data["field"];
        if (typeof field !== "string") {
            throw new Error(`Invalid field type: expected string, got ${typeof field}`);
        }
        result = new Ctor(field, data["value"]);
    }
    return result;
}
//# sourceMappingURL=serializers.js.map