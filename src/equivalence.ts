import { IFilter } from "./iFilter";

type AndLikeFilter = IFilter & { filters: IFilter[] };
type OrLikeFilter = IFilter & { left: IFilter; right: IFilter };
type NotLikeFilter = IFilter & { filter: IFilter };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isFilter = (value: unknown): value is IFilter =>
  isRecord(value) &&
  typeof value["toDict"] === "function" &&
  typeof value["isEquivalentTo"] === "function";

const deepEqual = (left: unknown, right: unknown): boolean => {
  if (Object.is(left, right)) {
    return true;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    return (
      left.length === right.length &&
      left.every((value, index) => deepEqual(value, right[index]))
    );
  }

  if (isRecord(left) && isRecord(right)) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);

    if (leftKeys.length !== rightKeys.length) {
      return false;
    }

    return leftKeys.every(
      (key) => key in right && deepEqual(left[key], right[key]),
    );
  }

  return false;
};

const getAndFilters = (filter: IFilter): IFilter[] | undefined => {
  const dict = filter.toDict();
  if (dict["logic"] !== "and") {
    return undefined;
  }

  const andFilter = filter as Partial<AndLikeFilter>;
  if (!Array.isArray(andFilter.filters) || andFilter.filters.length === 0) {
    return undefined;
  }

  if (!andFilter.filters.every((child) => isFilter(child))) {
    return undefined;
  }

  return andFilter.filters;
};

const getOrFilters = (filter: IFilter): IFilter[] | undefined => {
  const dict = filter.toDict();
  if (dict["logic"] !== "or") {
    return undefined;
  }

  const orFilter = filter as Partial<OrLikeFilter>;
  if (!isFilter(orFilter.left) || !isFilter(orFilter.right)) {
    return undefined;
  }

  return [orFilter.left, orFilter.right];
};

export const areFiltersEquivalent = (
  left: IFilter,
  right: IFilter,
): boolean => {
  if (left === right) {
    return true;
  }

  if (deepEqual(left.toDict(), right.toDict())) {
    return true;
  }

  const leftAndFilters = getAndFilters(left);
  if (leftAndFilters?.every((child) => child.isEquivalentTo(right))) {
    return true;
  }

  const rightAndFilters = getAndFilters(right);
  if (rightAndFilters?.every((child) => child.isEquivalentTo(left))) {
    return true;
  }

  const leftOrFilters = getOrFilters(left);
  if (leftOrFilters?.every((child) => child.isEquivalentTo(right))) {
    return true;
  }

  const rightOrFilters = getOrFilters(right);
  if (rightOrFilters?.every((child) => child.isEquivalentTo(left))) {
    return true;
  }

  // Handle pairs of NOT filters: NOT(NOT(x)) = x
  const leftUnwrapped = unwrapDoubleNotFilters(left);
  const rightUnwrapped = unwrapDoubleNotFilters(right);

  if (leftUnwrapped !== left || rightUnwrapped !== right) {
    return areFiltersEquivalent(leftUnwrapped, rightUnwrapped);
  }

  return false;
};

const getNotFilter = (filter: IFilter): IFilter | undefined => {
  const dict = filter.toDict();
  if (dict["logic"] !== "not") {
    return undefined;
  }

  const notFilter = filter as Partial<NotLikeFilter>;
  if (!isFilter(notFilter.filter)) {
    return undefined;
  }

  return notFilter.filter;
};

/**
 * Unwraps pairs of NotFilter.
 * Since NOT(NOT(x)) = x, this function removes pairs of NOT operations.
 * For example:
 * - NOT(NOT(x)) returns x
 * - NOT(NOT(NOT(x))) returns NOT(x)
 * - x returns x
 */
const unwrapDoubleNotFilters = (filter: IFilter): IFilter => {
  let current = filter;
  let notCount = 0;

  // Count consecutive NOT filters
  while (true) {
    const inner = getNotFilter(current);
    if (inner === undefined) {
      break;
    }
    current = inner;
    notCount++;
  }

  // If even number of NOTs, return the unwrapped filter
  if (notCount % 2 === 0) {
    return current;
  }

  // If odd number of NOTs, return the original filter
  return filter;
};
