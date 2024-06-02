import {
	SKContainer,
	SKLabel,
	Layout,
} from "simplekit/imperative-mode";
import { Observer } from "./observer";
import { Model } from "./model";

export class StatusBar extends SKContainer implements Observer {

	update(): void {
		this.clearChildren();

		const statusLabel = new SKLabel();
		let shapeCount = this.model.shapes.length;
		statusLabel.text = `${shapeCount} ${shapeCount === 1 ? 'shape' : 'shapes'}`;
		statusLabel.align = "left";
		statusLabel.height = 30;
		statusLabel.fillWidth = 1;
		this.addChild(statusLabel);

		// if shift key is pressed
		if (this.model.shift_pressed) {
			const shiftLabel = new SKLabel();
			shiftLabel.text = "SHIFT";
			shiftLabel.align = "right";
			shiftLabel.height = 30;
			shiftLabel.fillWidth = 2;
			this.addChild(shiftLabel);
		}

		if (this.model.selectedShapes.length > 0) {
			const selectedLabel = new SKLabel();
			selectedLabel.text = `selected ${this.model.selectedShapes.length}`;
			selectedLabel.align = "right";
			selectedLabel.height = 30;
			selectedLabel.fillWidth = 1;
			this.addChild(selectedLabel);
		}

		this.layoutMethod = Layout.makeFillRowLayout();
	}


	constructor(private model: Model) {
		super();

		// setup the view
		this.id = "statusbar";
		this.fill = "lightgrey";
		this.height = 50;
		this.fillWidth = 1;
		this.padding = 12; // vertically centred

		this.model.addObserver(this);		
	}
}
		