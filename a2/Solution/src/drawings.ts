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