namespace mathUtils {
  export const PI = 3.1415926535;

  export function round(num: number, decimalPlaces: number) {
    var multiplier = 10 ** decimalPlaces;
    return ((num >= 0 ? 1 : -1) * parseInt(((num >= 0 ? num : -num) * multiplier + 0.5).toString())) / multiplier;
  }

  export function abs(x: number) {
    return x < 0 ? -x : x;
  }

  export function sin(x: number) {
    let term = x;
    let sum = term;
    let prev = 0;
    const precision = 1e-15;

    for (let i = 1; abs(sum - prev) > precision; i++) {
      term *= (-1 * x * x) / (2 * i * (2 * i + 1));
      prev = sum;
      sum += term;
    }

    return sum;
  }

  export function cos(x: number) {
    let term = 1;
    let sum = term;
    let prev = 0;
    const precision = 1e-15;

    for (let i = 1; abs(sum - prev) > precision; i++) {
      term *= (-1 * x * x) / ((2 * i - 1) * (2 * i));
      prev = sum;
      sum += term;
    }

    return sum;
  }

  // Degree to radian conversion
  export function degreeToRadian(degree: number) {
    return (degree * PI) / 180;
  }
}

export default mathUtils;
