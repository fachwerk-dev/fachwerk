/**
 * Generates an array of numbers within a specified range.
 *
 * @param {number} start - The start of the range.
 * @param {number} end - The end of the range. If not provided, the function generates numbers from 0 to `start - 1`.
 * @param {number} [step=1] - The step between numbers in the range.
 * @returns {number[]} An array of numbers within the specified range.
 */
export function range(start, end, step = 1) {
  if (end === undefined) {
    end = start;
    start = 0;
  }

  const result = [];
  for (let i = start; step > 0 ? i < end : i > end; i += step) {
    result.push(i);
  }

  return result;
}
