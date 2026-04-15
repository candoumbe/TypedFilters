"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreaterThanOrEqualFilter = void 0;
/** Matches records where a property is greater than or equal to a value. */
class GreaterThanOrEqualFilter {
    constructor(field, value) {
        this.field = field;
        this.value = value;
    }
    toDict() {
        return { field: this.field, op: 'gte', value: this.value };
    }
}
exports.GreaterThanOrEqualFilter = GreaterThanOrEqualFilter;
//# sourceMappingURL=greaterThanOrEqualFilter.js.map