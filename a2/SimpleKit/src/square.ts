import { Model } from "./model";
import { SKShape } from "./shape";

export class SKSquare extends SKShape {
  constructor(
    public hue: number,
    public model: Model,
    public display?: boolean
    ) {
    super(hue, model, display);
  }

  drawShape(gc: CanvasRenderingContext2D): void {
    // normal square background
    gc.fillStyle = this.color;
    gc.fillRect(-25, -25, 50, 50);

    // black border
    gc.strokeStyle = 'black';
    gc.lineWidth = 1;
    gc.strokeRect(-25, -25, 50, 50);
  }
}

