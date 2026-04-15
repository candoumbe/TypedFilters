"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainsFilter = void 0;
/** Matches records where a property contains a substring. */
class ContainsFilter {
    constructor(field, value) {
        this.field = field;
        this.value = value;
    }
    toDict() {
        return { field: this.field, op: "contains", value: this.value };
    }
    /**
     * Creates a ContainsFilter from a dictionary.
     * @param dict The dictionary to create the filter from. Must have "field", "op", and "value" keys.
     * @returns A new ContainsFilter instance.
     * @throws Error if the dictionary does not have the correct keys or types.
     */
    static fromDict(dict) {
        if (dict["op"] !== "contains") {
            throw new Error(`Invalid operator for ContainsFilter: ${dict["op"]}`);
        }
        if (typeof dict["field"] !== "string" ||
            typeof dict["value"] !== "string") {
            throw new Error("Invalid field or value type for ContainsFilter");
        }
        return new ContainsFilter(dict["field"], dict["value"]);
    }
}
exports.ContainsFilter = ContainsFilter;
//# sourceMappingURL=containsFilter.js.map