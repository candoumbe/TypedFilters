"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessThanFilter = void 0;
/** Matches records where a property is less than a value. */
class LessThanFilter {
    constructor(field, value) {
        this.field = field;
        this.value = value;
    }
    toDict() {
        return { field: this.field, op: 'lt', value: this.value };
    }
}
exports.LessThanFilter = LessThanFilter;
//# sourceMappingURL=lessThanFilter.js.map