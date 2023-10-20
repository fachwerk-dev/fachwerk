/**
 * Generates a sequence of numbers based on a specified length, starting value, and step value.
 *
 * @function
 * @name seq
 * @param {number} length - The number of values to generate. Must be a positive integer.
 * @param {number} [step=1] - The step value by which each subsequent number in the sequence will differ.
 * @param {number} [start=0] - The starting value of the sequence.
 * @returns {number[]} An array of numbers, starting from `start`, incrementing by `step` for each subsequent number, until there are `length` numbers in the array.
 */
export function seq(length, step = 1, start = 0) {
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(start + i * step);
  }
  return result;
}
