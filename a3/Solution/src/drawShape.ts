import { ShapePropsType } from "./model";

import * as Drawing from "./drawings";

export function drawShape(
  gc: CanvasRenderingContext2D,
  props: ShapePropsType
) {
  // clear canvas (in case re-rendering into same canvas)
  gc.clearRect(0, 0, gc.canvas.width, gc.canvas.height);
  gc.save();
  // move 0,0 to canvas centre (easier for drawing)
  gc.translate(gc.canvas.width / 2, gc.canvas.height / 2);
  // call the right shape drawing function with props
  switch (props.type) {
    case "square":
      Drawing.square(gc, {
        fill: `hsl(${props.hue}, 100%, 50%)`,
      });
      break;
    case "star":
      Drawing.star(gc, {
        fill: `hsl(${props.hue}, 100%, 50%)`,
        r1: props.r1,
        r2: props.r2,
        n: props.n,
      });
      break;
    case "bullseye":
      Drawing.bullseye(gc, {
        fill1: `hsl(${props.hue}, 100%, 50%)`,
        fill2: `hsl(${props.hue2}, 100%, 50%)`,
        rings: props.rings,
      });
      break;
    case "cat":
      Drawing.cat(gc, {
        fill: `hsl(${props.hue}, 100%, 50%)`,
        look: props.look,
      });
      break;
  }
  gc.restore();
}
