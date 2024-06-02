import { SKContainer, Layout } from "simplekit/imperative-mode";
import { Observer } from "./observer";
import { Model } from "./model";
import { ToolbarButton } from "./toolbarButton";

export class ToolBar extends SKContainer implements Observer {
	// Toolbar buttons
	private addButton = new ToolbarButton({ text: "Add", height: 30, width: 80 });;
	private addStarButton = new ToolbarButton({ text: "Add Star", height: 30, width: 80 });
	private deleteButton = new ToolbarButton({ text: "Delete", height: 30, width: 80 });
	private clearButton = new ToolbarButton({ text: "Clear", height: 30, width: 80 });


	update(): void {
		// If there are 20 shapes, disable the Add & Add Star buttons
		if (this.model.shapes.length >= 20) {
			this.addButton.disable();
			this.addStarButton.disable();
		} else {
			this.addButton.enable();
			this.addStarButton.enable();
		}

		// If there are no selected shapes, disable the Delete button
		if (this.model.selectedShapes.length === 0) {
			this.deleteButton.disable();
		} else {
			this.deleteButton.enable();
		}

		// If there are no shapes, disable the Clear button
		if (this.model.shapes.length === 0) {
			this.clearButton.disable();
		} else {
			this.clearButton.enable();
		}
	}


	constructor(private model: Model) {
		super();

		// add the buttons
		this.addChild(this.addButton);
		this.addChild(this.addStarButton);
		this.addChild(this.deleteButton);
		this.addChild(this.clearButton);

		// setup the view
		this.id = "toolbar";
		this.fill = "lightgrey";
		this.height = 50;
		this.fillWidth = 1;
		this.padding = 10; // vertically centred
		this.layoutMethod = Layout.makeFillRowLayout({ gap: 10 });

		this.addButton.addEventListener("action", () => {
			this.model.addSquare();
		});

		this.addStarButton.addEventListener("action", () => {
      this.model.addStar();
		});

		this.deleteButton.addEventListener("action", () => {
			this.model.deleteSelectedShapes();
		});

		this.clearButton.addEventListener("action", () => {
			this.model.clearShapes();
		});

		this.model.addObserver(this);
	}
}
		