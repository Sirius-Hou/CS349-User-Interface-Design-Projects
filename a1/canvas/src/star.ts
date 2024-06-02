import { Pattern } from "./pattern";

export class Star extends Pattern{
  public color: string = "#FDFF04";

  constructor(
    public spikes = 5,
  ) {
	super();

	switch (this.spikes) {
		case 4:
		this.color = "#FFD700";
		break;
		case 5:
		this.color = "#FDFF04";
		break;
		case 6:
		this.color = "#FF8C00";
		break;
		case 7:
		this.color = "#FDFF04";
		break;
		case 10:
		this.color = "#FDFF04";
		break;
  }
}

	draw(gc: CanvasRenderingContext2D) {
		// REFACTORING
		gc.save();
		gc.scale(0.6, 0.6);
		
		const outerRadius = 40;
		const innerRadius = 15;

		let rot = Math.PI / 2 * 3;
		const step = Math.PI / this.spikes;

		gc.beginPath();
		gc.moveTo(0, -outerRadius);
		for(let i = 0; i < this.spikes; i++) {
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


export class Star4 extends Star {
  constructor() {
    super(4);
  }
}

export class Star5 extends Star {
  constructor() {
		super(5);
  }
}

export class Star6 extends Star {
  constructor() {
    super(6);
  }
}

export class Star7 extends Star {
  constructor() {
  	super(7);
  }
}

export class Star10 extends Star {
  constructor() {
    super(10);
  }
}

