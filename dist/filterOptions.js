"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterOptions = exports.FilterLogic = void 0;
/**
 * Logic applied when combining multiple filter criteria.
 * Mirrors the C# `FilterLogic` enum.
 */
var FilterLogic;
(function (FilterLogic) {
    FilterLogic["And"] = "and";
    FilterLogic["Or"] = "or";
})(FilterLogic || (exports.FilterLogic = FilterLogic = {}));
/**
 * Options for customizing filter parsing behaviour.
 * Allows specifying how multiple criteria separated by `&` should be combined (AND vs OR).
 *
 * @example
 * ```typescript
 * // comma-separated parts will be combined with OR instead of AND
 * const options = new FilterOptions({ logic: FilterLogic.Or });
 * const filter = parse("name=Batman&age=30", options);
 * // → OrFilter([EqualsFilter("name","Batman"), EqualsFilter("age","30")])
 * ```
 */
class FilterOptions {
    constructor({ logic = FilterLogic.And } = {}) {
        this.logic = logic;
    }
}
exports.FilterOptions = FilterOptions;
//# sourceMappingURL=filterOptions.js.map