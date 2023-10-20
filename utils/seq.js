/**
 * Generates a sequence of numbers based on a specified length, starting value, and step value.
 *
 * @function
 * @name seq
 * @param {number} length - The number of values to generate. Must be a positive integer.
 * @param {number} [start=0] - The starting value of the sequence.
 * @param {number} [step=1] - The step value by which each subsequent number in the sequence will differ.
 * @returns {number[]} An array of numbers, starting from `start`, incrementing by `step` for each subsequent number, until there are `length` numbers in the array.
 */
export function seq(x, y = 0, z = 1) {
  const result = [];
  for (let i = 0; i < x; i++) {
    result.push(y + i * z);
  }
  return result;
}
