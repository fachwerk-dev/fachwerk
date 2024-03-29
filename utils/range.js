/**
 * Generates an array of numbers in the specified range.
 *
 * @param {number} start - The start of the range. If `end` is not provided, `start` defaults to 0.
 * @param {number} [end] - The end of the range (exclusive).
 * @param {number} [step=1] - The difference between each successive number in the range.
 * @returns {number[]} An array of numbers in the specified range.
 */
export function range(start, end, step = 1) {
  if (end === undefined) {
    end = start;
    start = 0;
  }

  const arr = [];
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      arr.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      arr.push(i);
    }
  }

  return arr;
}
