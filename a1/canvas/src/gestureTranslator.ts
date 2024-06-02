import { distance } from "simplekit/utility";

// simulated UI Toolkit events
import {
	FundamentalEvent,
  SKMouseEvent,
} from "simplekit/canvas-mode";


export const gestureTranslator = {
  state: "IDLE",
  movementThreshold: 50,
	xDifferenceThreshold: 20,
  startX: 0,
  startY: 0,
	maxX: undefined as number | undefined,
  minX: undefined as number | undefined,
	currY: undefined as number | undefined,


  // returns a gesture event if found
  update(fe: FundamentalEvent): SKMouseEvent | undefined {
    switch (this.state) {
      case "IDLE":
        if (fe.type == "mousedown") {
          this.state = "DOWN";
          this.startX = fe.x || 0;
          this.startY = fe.y || 0;
					this.maxX = this.startX;
					this.minX = this.startX;
					this.currY = this.startY;
        }
        break;

      case "DOWN":
				if (fe.type == "mouseup") {
					this.state = "IDLE";
				} else if (
					fe.type == "mousemove" &&
					fe.x &&
					fe.y &&
					distance(fe.x, fe.y, this.startX, this.startY) > this.movementThreshold
				) {
					this.state = "GESTURE";
					// update the max and min x values
					this.updateMaxMinX(fe);
					if (!this.currY) {
						this.currY = fe.y;
					}
				}
				break;

			case "GESTURE":
				if (fe.type == "mousemove") {
					// update the max and min x values
					this.updateMaxMinX(fe);
					if (this.currY && fe.y && fe.y > this.currY) {
						// Not a general upward straight line => Not a gesture
						this.state = "IDLE";
					} else {
						this.currY = fe.y;
					}
				}

        else if (fe.type == "mouseup") {
          this.state = "IDLE";
					if (
						this.maxX !== undefined &&
						this.minX !== undefined &&
						this.maxX - this.minX <= this.xDifferenceThreshold
						) {
						return new SKMouseEvent(
							"gesture",
							fe.timeStamp,
							fe.x || 0,
							fe.y || 0
						);
					}
				}
        break;
    }
    return;
  },


	updateMaxMinX(fe: FundamentalEvent) {
		if (fe.x && fe.x) {
			if (fe.x > (this.maxX ?? -Infinity)) {
				this.maxX = fe.x;
			}
			if (fe.x < (this.minX ?? Infinity)) {
				this.minX = fe.x;
			}
		}
	},

};

