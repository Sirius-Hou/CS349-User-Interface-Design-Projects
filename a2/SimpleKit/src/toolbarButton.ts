import { SKButton, SKMouseEvent } from "simplekit/imperative-mode";
import { Style } from "simplekit/imperative-mode";

export class ToolbarButton extends SKButton {
	disabled: boolean = false;

	handleMouseEvent(me: SKMouseEvent) {
		if (this.disabled) {
			return false; // Ignore mouse events when the button is disabled
		}
		return super.handleMouseEvent(me);
	}

	disable() {
		this.disabled = true;
		this.state = "idle";
	}

	enable() {
		this.disabled = false;
	}

	draw(gc: CanvasRenderingContext2D) {
		super.draw(gc);
		if (this.disabled) {
			gc.save();

			const w = this.paddingBox.width;
			const h = this.paddingBox.height;

			gc.translate(this.margin, this.margin);

			// background
			gc.beginPath();
			gc.roundRect(this.x, this.y, w, h, 4);
			gc.fillStyle = "lightgrey";
			gc.strokeStyle = "darkgrey";
			gc.lineWidth = 2;
			gc.fill();
			gc.stroke();

			// button label
			gc.font = Style.font;
			gc.fillStyle = "darkgrey";
			gc.textAlign = "center";
			gc.textBaseline = "middle";
			gc.fillText(this.text, this.x + w / 2, this.y + h / 2);

			gc.restore();
		}
	}
}
