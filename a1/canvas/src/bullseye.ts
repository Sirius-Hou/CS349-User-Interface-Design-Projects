import { Pattern } from "./pattern";

export class Bullseye extends Pattern {
	private colors: string[];
	private radii: number[];

	constructor(
		colors: string[] = ["#FF3B00", "#1F86FF", "#FF3B00"],
		radii: number[] = [30, 20, 10],
		public outlineColor = "black"
	) {
		super();
		
		this.colors = colors;
		this.radii = radii.map(radius => radius);
	}

	draw(gc: CanvasRenderingContext2D) {
		gc.save();
		gc.scale(0.6, 0.6);

		gc.lineWidth = 2;
		gc.strokeStyle = this.outlineColor;
		
		gc.beginPath();
		for (let i = 0; i < this.radii.length; i++) {
			gc.arc(0, 0, this.radii[i], 0, Math.PI * 2);
			gc.fillStyle = this.colors[i];
			gc.fill();
			gc.stroke();
			gc.beginPath(); // Begin a new path for the next circle
		}
		gc.restore();
	}
}


export class Bullseye1 extends Bullseye { // Red, Blue, Red
	constructor() {
		super(["#FF3B00", "#1F86FF", "#FF3B00"], [50, 33, 16], "black");
	}
}


export class Bullseye2 extends Bullseye { // Black, Black, Black, Black
	constructor() {
		super(["black", "black", "black", "black"], [50, 36, 22, 8], "white");
	}
}

export class Bullseye3 extends Bullseye { // Blue, Red, Blue, Red, Blue
	constructor() {
		super(["#1D91FF", "#FF0001", "#1D91FF", "#FF0001", "#1D91FF"], [50, 39.5, 29, 18.5, 8], "black");
	}
}

export class Bullseye4 extends Bullseye { // Orange, Yellow, Orange, Yellow
	constructor() {
		super(["#FF8C00", "#FDFF04", "#FF8C00", "#FDFF04"], [50, 36, 22, 8], "black");
	}
}

export class Bullseye5 extends Bullseye { // Green, Yellow, Green, Yellow, Green
	constructor() {
		super(["#017F01", "#FDFF04", "#017F01"], [50, 33, 16], "black");
	}
}
