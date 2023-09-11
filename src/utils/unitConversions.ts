import mathUtils from './mathUtils';

namespace UnitConversions {
  export function rgbaScaleFromFigmaToCss({ r, g, b, a }: { r: number; g: number; b: number; a: number }): {
    r: number;
    g: number;
    b: number;
    a: number;
  } {
    return {
      r: mathUtils.round(r * 255, 0),
      g: mathUtils.round(g * 255, 0),
      b: mathUtils.round(b * 255, 0),
      a: mathUtils.round(a, 2),
    };
  }

  export function figmaRgbaToCssRgbaString({ r, g, b, a }: { r: number; g: number; b: number; a: number }): string {
    const cssRgba = rgbaScaleFromFigmaToCss({ r, g, b, a });
    return `rgba(${cssRgba.r}, ${cssRgba.g}, ${cssRgba.b}, ${cssRgba.a})`;
  }
}

export default UnitConversions;
