/**
 * Generic Shape widget
 */

export abstract class Shape {
  // unique shape ID from model
  shapeId: number;
  gc: CanvasRenderingContext2D;
  
  constructor(id = -1, gc: CanvasRenderingContext2D) {
    this.shapeId = id;
    this.gc = gc;
  }

  // abstract draw method, to be implemented in derived classes
  abstract draw(): void;
}


export class Square extends Shape {
  fill?: string;

  constructor(id = -1, gc: CanvasRenderingContext2D, fill = "blue") {
    super(id, gc);
    this.fill = fill;
  }

  draw() {
    this.gc.clearRect(0, 0, 100, 100);
    this.gc.save();

    // draw a rectangle that is the same size as the canvas
    this.gc.beginPath();
    this.gc.rect(0, 0, 100, 100);

    this.gc.lineWidth = 2;
    this.gc.strokeStyle = "black";
    this.gc.fillStyle = this.fill || "";
    this.gc.fill();
    this.gc.stroke();

    this.gc.restore();
  }
}



import { star } from "./drawings";

export class Star extends Shape {
  fill?: string;
  points?: number;
  innerRadius?: number;
  outerRadius?: number;

  constructor(
    id: number = -1,
    gc: CanvasRenderingContext2D,
    fill?: string,
    r1?: number,
    r2?: number,
    n?: number
  ) {
    super(id, gc);
    this.fill = fill;
    this.innerRadius = r1;
    this.outerRadius = r2;
    this.points = n;
  }


  draw() {
    this.gc.clearRect(0, 0, 100, 100);
    this.gc.save();
    this.gc.translate(50, 50);

    star(this.gc, {
      n: this.points,
      r1: this.innerRadius,
      r2: this.outerRadius,
      fill: this.fill
    });

    this.gc.restore();
  }
}

import { cat } from "./drawings";

export class Cat extends Shape {
  fill?: string;
  look?: "left" | "right" | "centre";

  constructor(
    id: number = -1,
    gc: CanvasRenderingContext2D,
    fill?: string,
    look?: "left" | "right" | "centre"
  ) {
    super(id, gc);
    this.fill = fill;
    this.look = look;
  }

  draw() {
    this.gc.clearRect(0, 0, 100, 100);
    this.gc.save();

    this.gc.translate(50, 50);

    cat(this.gc, {
      fill: this.fill,
      look: this.look
    });

    this.gc.restore();
  }
}

import { bullseye } from "./drawings";

export class Bullseye extends Shape {
  color1?: string;
  color2?: string;
  rings?: number;

  constructor(
    id: number = -1,
    gc: CanvasRenderingContext2D,
    color1?: string,
    color2?: string,
    rings?: number
  ) {
    super(id, gc);
    this.color1 = color1;
    this.color2 = color2;
    this.rings = rings;
  }

  draw() {
    this.gc.clearRect(0, 0, 100, 100);
    this.gc.save();

    this.gc.translate(50, 50);

    bullseye(this.gc, {
      color1: this.color1,
      color2: this.color2,
      rings: this.rings
    });

    this.gc.restore();
  }
}
