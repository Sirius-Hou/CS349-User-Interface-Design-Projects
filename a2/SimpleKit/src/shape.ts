import { SKElement, Style, SKMouseEvent } from "simplekit/imperative-mode";
import { Model } from "./model";

export class SKShape extends SKElement {
  color: string;
  scale: number = 1;
  constructor(
    public hue: number,
    public model: Model,
    public display?: boolean
    ) {
    super();
    this.calculateBasis();
    this.doLayout();
    if (display) this.state = "display";
    this.color = `hsl(${hue}, 100%, 50%)`; // saturation and luminance set to 100% and 50%
  }
  public selected: boolean = false;
  state: "display" | "idle" | "hover" = "idle";

  handleMouseEvent(me: SKMouseEvent) {
    // If the square is only for display, don't handle any events
    if (this.state === "display") return false;

    switch (me.type) {
      case "click":
        this.model.selectShape(this);
        return true;
      case "mouseenter":
        this.state = "hover";
        return true;
      case "mouseexit":
        this.state = "idle";
        return true;
    }
    return false;
  }

  drawShape(gc: CanvasRenderingContext2D): void {}

  calculateTranslateAndScale(gc: CanvasRenderingContext2D) {
    gc.translate(this.x + this.widthLayout / 2, this.y + this.heightLayout / 2);

    if (this.state === "display") {
      gc.translate(0, 5);
      const scaleFactor = Math.min(
        gc.canvas.width / 3 - 25,
        (gc.canvas.height - 25) * 2/3 - 35
      ) / 50;

      gc.scale(scaleFactor, scaleFactor);
    }
  }

  draw(gc: CanvasRenderingContext2D) {
    gc.save();
    this.calculateTranslateAndScale(gc);
    
    // thick highlight rect
    if (this.state == "hover") {
      gc.beginPath();
      gc.rect(-25, -25, 50, 50);
      gc.strokeStyle = Style.highlightColour;
      gc.lineWidth = 8;
      gc.stroke();
    }

    // thin, offset outline for selected square
    if (this.selected) {
      gc.beginPath();
      gc.rect(-28, -28, 56, 56); // A thin outline slightly offset from the square
      gc.strokeStyle = Style.focusColour;
      gc.lineWidth = 2;
      gc.stroke();
    }
      
    this.drawShape(gc);
    
    gc.restore();

    super.draw(gc);
  }
}

