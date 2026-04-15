"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreaterThanFilter = void 0;
/** Matches records where a property is greater than a value. */
class GreaterThanFilter {
    constructor(field, value) {
        this.field = field;
        this.value = value;
    }
    toDict() {
        return { field: this.field, op: 'gt', value: this.value };
    }
}
exports.GreaterThanFilter = GreaterThanFilter;
//# sourceMappingURL=greaterThanFilter.js.map