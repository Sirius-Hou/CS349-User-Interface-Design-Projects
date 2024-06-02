/**
 * returns a random number between a and b, or between 0 and a
 * @param a if b is undefined, a is the upper bound
 * @param b upper bound
 * @returns
 */
export function random(a: number, b?: number): number {
  if (b != undefined) {
    return a + Math.random() * (b - a);
  } else {
    return Math.random() * a;
  }
}