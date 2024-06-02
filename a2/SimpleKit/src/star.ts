import { Model } from "./model";
import { SKShape } from "./shape";

export class SKStar extends SKShape {
  constructor(
    public hue: number,
    public model: Model,
    public display?: boolean,
    public radius: number = 30,
    public points: number = 5,
    ) {
    super(hue, model, display);
  }

  drawShape(gc: CanvasRenderingContext2D): void {
    gc.save();

    if (this.state !== "display") {
      gc.strokeStyle = 'grey';
      gc.lineWidth = 2;
      gc.strokeRect(-25, -25, 50, 50);
    }

    gc.scale(0.45, 0.45);

		const outerRadius = this.radius;
		const innerRadius = 15;

		let rot = Math.PI / 2 * 3;
		const step = Math.PI / this.points;

		gc.beginPath();
		gc.moveTo(0, -outerRadius);
		for(let i = 0; i < this.points; i++) {
			let x = Math.cos(rot) * outerRadius;
			let y = Math.sin(rot) * outerRadius;
			gc.lineTo(x, y);
			rot += step;

			x = Math.cos(rot) * innerRadius;
			y = Math.sin(rot) * innerRadius;
			gc.lineTo(x, y);
			rot += step;
		}
		gc.lineTo(0, -outerRadius);
		gc.closePath();
		gc.lineWidth = 4;
		gc.strokeStyle = 'black';
		gc.stroke();
		gc.fillStyle = this.color;
		gc.fill();

    gc.restore();
  }
}

