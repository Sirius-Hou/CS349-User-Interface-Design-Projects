import {
  SKElement,
  SKElementProps,
  SKEvent,
  SKMouseEvent,
  Style,
} from "simplekit/imperative-mode";

/**
 * Generic Shape widget
 */

export type SKShapeProps = SKElementProps & { id?: number };

export class SKShape extends SKElement {
  constructor({ id = -1, ...elementProps }: SKShapeProps = {}) {
    super(elementProps);
    this.shapeId = id;
  }

  // unique shape ID from model
  shapeId: number;

  state: "idle" | "hover" = "idle";

  // if this widget is selected
  isSelected = false;
  // if this widget is in the editor
  inEditor = false;

  // the reference size to define the shape
  referenceSize = 100;
  protected get scaleFactor() {
    const min = Math.min(
      this.contentBox.width,
      this.contentBox.height
    );
    return min / this.referenceSize;
  }

  handleMouseEvent(me: SKMouseEvent) {
    switch (me.type) {
      case "click":
        return this.sendEvent({
          source: this,
          timeStamp: me.timeStamp,
          type: "click",
        } as SKEvent);
        break;
      case "mouseenter":
        this.state = "hover";
        return true;
        break;
      case "mouseexit":
        this.state = "idle";
        return true;
        break;
      case "doubleclick":
        return this.sendEvent({
          source: this,
          timeStamp: me.timeStamp,
          type: "edit",
        } as SKEvent);
        break;
    }
    return false;
  }

  draw(gc: CanvasRenderingContext2D) {
    super.draw(gc);

    // add a bit of padding
    const p = 3;

    if (this.state === "hover" && !this.inEditor) {
      gc.save();
      gc.translate(
        this.x - p + this.margin,
        this.y - p + this.margin
      );
      gc.strokeStyle = Style.highlightColour;
      gc.lineWidth = 4;
      gc.strokeRect(
        0,
        0,
        this.contentBox.width + 2 * p,
        this.contentBox.height + 2 * p
      );
      gc.restore();
    }

    if (this.isSelected && !this.inEditor) {
      gc.save();
      gc.translate(
        this.x - p + this.margin,
        this.y - p + this.margin
      );
      gc.strokeStyle = Style.focusColour;
      gc.lineWidth = 1;
      gc.strokeRect(
        0,
        0,
        this.contentBox.width + 2 * p,
        this.contentBox.height + 2 * p
      );
      gc.restore();
    }

    if (!this.inEditor) {
      gc.save();
      gc.translate(this.x + this.margin, this.y + this.margin);
      gc.beginPath();
      gc.rect(0, 0, this.contentBox.width, this.contentBox.height);
      gc.strokeStyle = "gray";
      gc.lineWidth = 1;
      gc.stroke();
      gc.restore();
    }
  }
}

/**
 * Square Widget
 */

type SkSquareProps = SKShapeProps & {
  fill?: string;
};

export class SKSquare extends SKShape {
  constructor({ fill = "blue", ...shapeProps }: SkSquareProps = {}) {
    super(shapeProps);
    this.props = { fill };
  }

  props: SkSquareProps;

  draw(gc: CanvasRenderingContext2D) {
    super.draw(gc);

    gc.save();
    gc.translate(
      this.x + this.widthLayout / 2,
      this.y + this.heightLayout / 2
    );

    // scale to fit the content box
    gc.scale(this.scaleFactor, this.scaleFactor);

    gc.beginPath();
    gc.rect(
      -this.referenceSize / 2,
      -this.referenceSize / 2,
      this.referenceSize,
      this.referenceSize
    );
    gc.lineWidth = 2;
    gc.strokeStyle = "black";
    gc.fillStyle = this.props.fill || "";
    gc.fill();
    gc.stroke();

    gc.restore();
  }
}

/**
 * Star Widget
 */

import { star } from "./drawings";

export type SkStarProps = SKShapeProps & {
  n?: number;
  r1?: number;
  r2?: number;
  fill?: string;
};

export class SKStar extends SKShape {
  constructor({
    n = 5,
    r1 = 20,
    r2 = 50,
    fill = "yellow",
    ...shapeProps
  }: SkStarProps = {}) {
    super(shapeProps);
    this.props = { n, r1, r2, fill };
  }

  props: SkStarProps;

  draw(gc: CanvasRenderingContext2D) {
    super.draw(gc);

    gc.save();
    gc.translate(
      this.x + this.widthLayout / 2,
      this.y + this.heightLayout / 2
    );

    // scale the star to fit the content box
    gc.scale(this.scaleFactor, this.scaleFactor);

    star(gc, this.props);

    gc.restore();
  }
}
