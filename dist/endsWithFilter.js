"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndsWithFilter = void 0;
/** Matches records where a property ends with a specific string. */
class EndsWithFilter {
    constructor(field, value) {
        this.field = field;
        this.value = value;
    }
    toDict() {
        return { field: this.field, op: 'endswith', value: this.value };
    }
}
exports.EndsWithFilter = EndsWithFilter;
//# sourceMappingURL=endsWithFilter.js.map