type SquareProp = {
  fill?: string;
};


export function square(
  gc: CanvasRenderingContext2D,
  { fill = "red" }: SquareProp = {}
) {
  gc.clearRect(0, 0, 100, 100);
    gc.save();

  // draw a rectangle that is the same size as the canvas
  gc.beginPath();
  gc.rect(-50, -50, 100, 100);

  gc.lineWidth = 2;
  gc.strokeStyle = "black";
  gc.fillStyle = fill || "";
  gc.fill();
  gc.stroke();

  gc.restore();
}


// parameters to draw variations
type StarProps = {
  n?: number;
  r1?: number;
  r2?: number;
  fill?: string;
};

/**
 * Draw N pointed star centered at 0,0
 * @param gc
 * @param props
 */
export function star(
  gc: CanvasRenderingContext2D, 
  { n = 5, r1 = 12, r2 = 30, fill = "yellow" }: StarProps = {}
) {

  gc.save();

  gc.fillStyle = fill;
  gc.strokeStyle = "black";
  gc.lineWidth = 2;

  const s = (2 * Math.PI) / n;

  gc.beginPath();
  gc.moveTo(0, -r2);
  for (let i = 0; i < n; i++) {
    const angle = i * s;
    gc.lineTo(r2 * Math.sin(angle), -r2 * Math.cos(angle));
    gc.lineTo(
      r1 * Math.sin(angle + s / 2),
      -r1 * Math.cos(angle + s / 2)
    );
  }
  gc.closePath();
  gc.fill();
  gc.stroke();
  gc.restore();
}


// parameters to draw variations
type CatProps = {
  fill?: string;
  look?: "left" | "right" | "centre";
};

/**
 * Draw a cat face centered at 0,0
 * @param gc
 * @param props
 */

export function cat(
  gc: CanvasRenderingContext2D,
  { fill = "red", look = "centre" }: CatProps = {}
) {
  gc.save();

  // tweak position and scale to be centered in 80x80 card area
  gc.translate(0, 4);
  gc.scale(0.8, 0.8);

  // head with outline
  gc.fillStyle = fill;
  gc.strokeStyle = "white";
  gc.lineWidth = 8;
  gc.beginPath();
  gc.arc(0, 0, 40, 0, 2 * Math.PI);
  gc.stroke();

  // ears
  gc.beginPath();
  // left ear
  gc.moveTo(-40, -48);
  gc.lineTo(-8, -36);
  gc.lineTo(-35, -14);
  gc.closePath();
  // right ear
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
  gc.ellipse(-16, -9, 8, 14, 0, 0, 2 * Math.PI);
  gc.fill();
  gc.stroke();
  // right
  gc.beginPath();
  gc.ellipse(16, -9, 8, 14, 0, 0, 2 * Math.PI);
  gc.fill();
  gc.stroke();

  // eyeballs

  // adjust looking direction from parameter
  let lookOffset = 0;
  switch (look) {
    case "left":
      lookOffset = -4;
      break;
    case "right":
      lookOffset = 4;
      break;
    default:
      0;
  }

  gc.fillStyle = "black";
  gc.beginPath();
  // left
  gc.arc(-16 + lookOffset, -9, 5, 0, 2 * Math.PI);
  gc.fill();
  // right
  gc.beginPath();
  gc.arc(16 + lookOffset, -9, 5, 0, 2 * Math.PI);
  gc.fill();

  gc.restore();
}




// parameters to draw variations
type BullseyeProps = {
  fill1?: string;
  fill2?: string;
  rings?: number;
};


/**
 * Draw a bullseye centered at 0,0
 * @param gc
 * @param props
 */

export function bullseye(
  gc: CanvasRenderingContext2D,
  { fill1 = "red", fill2= "blue", rings = 5 }: BullseyeProps = {}
) {

  gc.save();
  gc.scale(0.9, 0.9);

  gc.lineWidth = 2;
  gc.strokeStyle = "black";
  
  gc.beginPath();

  const radii = Array.from({ length: rings }, (_, i) => 50 - 50 / rings * i);

  const colors = Array.from({ length: rings }, (_, i) => i % 2 === 0 ? fill1 : fill2);

  for (let i = 0; i < rings; i++) {
    gc.arc(0, 0, radii[i], 0, Math.PI * 2);
    gc.fillStyle = colors[rings - i - 1];
    gc.fill();
    gc.stroke();
    gc.beginPath(); // Begin a new path for the next circle
  }
  gc.restore();
  
}
