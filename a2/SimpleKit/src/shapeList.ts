import {
	SKContainer,
	Layout,
	SKMouseEvent,
} from "simplekit/imperative-mode";
import { Observer } from "./observer";
import { Model } from "./model";

export class ShapeList extends SKContainer implements Observer {
	update(): void {
		this.clearChildren();

		// add the shapes
		this.model.shapes.forEach((shape) => {
			this.addChild(shape);
		});

		this.model.shapes.forEach((shape) => {
			shape.selected = this.model.selectedShapes.includes(shape);
		});

		this.layoutMethod = Layout.makeWrapRowLayout({ gap: 20 });
	}

	handleMouseEvent(me: SKMouseEvent) {
    switch (me.type) {
      case "click":
				this.model.deselectAllShapes();
				return true;
    }
    return false;
  }

	constructor(private model: Model) {
		super();
		this.id = "shapeList";
		this.fill = "white";
		this.fillWidth = 1;
		this.fillHeight = 1;
		this.padding = 20; // 20px gap from the left and top of the shape list area
		this.layoutMethod = Layout.makeWrapRowLayout({ gap: 20 }); // 20px gap between squares
		this.model.addObserver(this);
	}
}

