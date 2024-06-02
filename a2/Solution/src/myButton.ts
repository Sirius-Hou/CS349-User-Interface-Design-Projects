import {
  SKButton,
  SKButtonProps,
  Style,
} from "simplekit/imperative-mode";

/**
 * A button that can be enabled or disabled
 */
export class MySKButton extends SKButton {
  constructor(props?: SKButtonProps) {
    super(props);
  }

  protected _enabled = true;
  get enabled(): boolean {
    return this._enabled;
  }
  set enabled(e: boolean) {
    this._enabled = e;
    if (!e) {
      this.state = "idle";
    }
  }

  // override hit-test to prevent it if button is disabled
  hitTest(mx: number, my: number): boolean {
    if (this.enabled) return super.hitTest(mx, my);
    return false;
  }

  draw(gc: CanvasRenderingContext2D) {
    if (this._enabled) {
      super.draw(gc);
    } else {
      // when disabled, draw a greyed out button
      // NOTE: Draw code is copied from SKButton, I just changed stroke and fill
      // to be gray, I don't think there's a better way to do this in Simplekit.

      gc.save();

      const w = this.paddingBox.width;
      const h = this.paddingBox.height;

      gc.translate(this.margin, this.margin);

      // normal background
      gc.beginPath();
      gc.roundRect(this.x, this.y, w, h, 4);
      gc.fillStyle = "lightgray";
      gc.strokeStyle = "grey";
      // change fill to show down state
      gc.lineWidth = this.state === "down" ? 4 : 2;
      gc.fill();
      gc.stroke();
      gc.clip(); // clip text if it's wider than text area

      // button label
      gc.font = Style.font;
      gc.fillStyle = "grey";
      gc.textAlign = "center";
      gc.textBaseline = "middle";
      gc.fillText(this.text, this.x + w / 2, this.y + h / 2);
      gc.restore();
    }
  }
}