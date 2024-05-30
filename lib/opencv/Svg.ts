import Point from "./Point";

namespace Svg {
  export const from = (points: Point[]) => {
    let pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }
    pathData += " Z"; // Close the path

    return `<path d="${pathData}" />`;
  };
}

export default Svg;