import { Pattern } from "./pattern";


type EyesPosition = "center" | "left" | "right";

export class Cat extends Pattern {
  public eyesPosition: EyesPosition = "center" // "center" / "left" / "right"
  public color: string;

  constructor(
    color = "gold", // "gold" / "red" / "blue" / "green" / "grey"
  ) {
    super();
    this.color = color;

    // if color is gold, green or grey, eyes position is center;
    // if color is red, eyes position is left;
    // if color is blue, eyes position is right;
    if (this.color == "gold" || this.color == "green" || this.color == "grey") {
      this.eyesPosition = "center";
    } else if (this.color == "red") {
      this.eyesPosition = "left";
    } else if (this.color == "blue") {
      this.eyesPosition = "right";
    }

  }


  draw(gc: CanvasRenderingContext2D) {
    gc.save();
    gc.scale(0.7, 0.7);

    if (this.color == "gold") {
      gc.fillStyle = "#CEA242";
    } else if (this.color == "red") {
      gc.fillStyle = "#FF4500";
    } else if (this.color == "blue") {
      gc.fillStyle = "#1D90FF";
    } else if (this.color == "green") {
      gc.fillStyle = "#2F4F4F";
    } else if (this.color == "grey") {
      gc.fillStyle = "#808080";
    }

    gc.strokeStyle = "white";
    gc.lineWidth = 8;

    // head white outline
    gc.beginPath();
    gc.arc(0, 0, 40, 0, 2 * Math.PI);
    gc.stroke();

    // ears
    gc.beginPath();
    // left
    gc.moveTo(-40, -48);
    gc.lineTo(-8, -36);
    gc.lineTo(-35, -14);
    gc.closePath();
    // right
    gc.moveTo(40, -48);
    gc.lineTo(8, -36);
    gc.lineTo(35, -14);
    gc.closePath();
    gc.stroke();
    gc.fill();

    // head
    gc.beginPath();
    gc.arc(0, 0, 40, 0, 2 * Math.PI);
    gc.fill();

    // whites of eyes
    gc.strokeStyle = "black";
    gc.fillStyle = "white";
    gc.lineWidth = 1;
    gc.beginPath();
    // left
    gc.ellipse(-16, -9, 8, 14, 0, 0, Math.PI * 2);
    gc.fill();
    gc.stroke();
    // right
    gc.beginPath();
    gc.ellipse(16, -9, 8, 14, 0, 0, Math.PI * 2);
    gc.fill();
    gc.stroke();

    // eyeballs
    gc.fillStyle = "black";

    const eyesPositions = {
      "center": [-16, 16],
      "left": [-19, 13],
      "right": [-13, 19]
    };

    // left
    gc.beginPath();
    gc.arc(eyesPositions[this.eyesPosition][0], -9, 5, 0, Math.PI * 2);
    gc.fill();

    // right
    gc.beginPath();
    gc.arc(eyesPositions[this.eyesPosition][1], -9, 5, 0, Math.PI * 2);
    gc.fill();

    gc.restore();
  }
}



export class RedCat extends Cat {
  constructor() { 
    super("red");
  }
}

export class BlueCat extends Cat {
  constructor() {
    super("blue");
  }
}

export class GreenCat extends Cat {
  constructor() {
    super("green");
  }
}

export class GreyCat extends Cat {
  constructor() {
    super("grey");
  }
}

export class GoldCat extends Cat {
  constructor() {
    super("gold");
  }
}
