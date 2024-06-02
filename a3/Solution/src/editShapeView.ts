// local imports
import View from "./view";
import { Model } from "./model";

import "./editShapeView.css";

import { ShapePropsType, ShapeType, SquareProps, StarProps, BullseyeProps, CatProps } from "./model";
import { drawShape } from "./drawShape";







export class EditShapeView implements View {


	update() {
		const editShape = this.model.editShape;
		if (!editShape) return;
	
		const gc = this.shapeCanvas.getContext("2d");

		if (!gc) {
			console.error("Could not get 2d context for shapeCanvas");
			return;
		}

		// get the shape props
		const shapeType = editShape.props.type;
		let props: ShapePropsType;
		switch (shapeType) {
			case "square": 
				props = editShape.props as SquareProps;
				this.fields.hue.value = props.hue?.toString() || "";
				break;
			case "star":
				props = editShape.props as StarProps;
				this.fields.hue.value = props.hue?.toString() || "";
				this.fields.n.value = props.n?.toString() || "";
				this.fields.r2.value = props.r2?.toString() || "";
				break;
			case "bullseye":
				props = editShape.props as BullseyeProps;
				this.fields.hue.value = props.hue?.toString() || "";
				this.fields.hue2.value = props.hue2?.toString() || "";
				this.fields.rings.value = props.rings?.toString() || "";
				break;
			case "cat":
				props = editShape.props as CatProps;
				this.fields.hue.value = props.hue?.toString() || "";
				this.fields.look.value = props.look || "";
				break;
		}

		// redraw the shape with the updated props
		drawShape(gc, props);
	}

	//#endregion
	
	// the view root container
	private container: HTMLDivElement;
	get root(): HTMLDivElement {
		return this.container;
	}

	private shapeCanvas = document.createElement("canvas");

	// save all fields in this object
	private fields: {
			[key: string]: HTMLInputElement | HTMLSelectElement;
	} = {};

	constructor(private model: Model, shapeType: ShapeType) {
		// setup the view root container
		this.container = document.createElement("div");
		this.container.id = "edit-shape";

		const div = document.createElement("div");
		div.id = "shape";
		this.container.appendChild(div);
		this.shapeCanvas.width = 100;
		this.shapeCanvas.height = 100;
		div.appendChild(this.shapeCanvas);

		// setup the form
		const form = document.createElement("form");
		form.setAttribute("onsubmit", "return false;");

		function makeRow(label: string, input: HTMLElement) {
			const row = document.createElement("div");
			row.classList.add("form-row");

			const labelElement = document.createElement("label");
			labelElement.htmlFor = input.id;
			labelElement.innerText = label;

			row.appendChild(labelElement);
			row.appendChild(input);

			return row;
		}
		
		// add the fields needed for the shape
		switch (shapeType) {
			case "square": 
				this.fields.hue = this.makeInput(shapeType, "hue", 0, 360);
				form.appendChild(makeRow("Hue", this.fields.hue));
				break;

			case "star":
				this.fields.hue = this.makeInput(shapeType, "hue", 0, 360);
				form.appendChild(makeRow("Hue", this.fields.hue));
				this.fields.n = this.makeInput(shapeType, "n", 3, 10);
				form.appendChild(makeRow("Points", this.fields.n));
				this.fields.r2 = this.makeInput(shapeType, "r2", 20, 45);
				form.appendChild(makeRow("Radius", this.fields.r2));
				break;

			case "bullseye":
				this.fields.hue = this.makeInput(shapeType, "hue", 0, 360);
				form.appendChild(makeRow("Hue1", this.fields.hue));
				this.fields.hue2 = this.makeInput(shapeType, "hue2", 0, 360);
				form.appendChild(makeRow("Hue2", this.fields.hue2));
				this.fields.rings = this.makeInput(shapeType, "rings", 2, 5);
				form.appendChild(makeRow("Rings", this.fields.rings));
				break;

			case "cat":
				this.fields.hue = this.makeInput(shapeType, "hue", 0, 360);
				form.appendChild(makeRow("Hue", this.fields.hue));
				// TODO makeInput should be more generic
				this.fields.look = this.makeSelect(shapeType, [
						"left",
						"centre",
						"right"
				]);
				form.appendChild(makeRow("Look", this.fields.look));
				break;
		}

		this.container.appendChild(form);

		// register with the model 
		this.model.addObserver(this);
	}

	// Used for all the shapes
	makeInput(
		shapeType: ShapeType,
		name: "hue" | "r2" | "n" | "rings" | "hue2" | "look",
		min: number,
		max: number
	) {
		// create input
		const input = document.createElement("input");
		input.id = name;
		input.name = name;
		input.required = true;
		input.type = "number";
		input.min = min.toString();
		input.max = max.toString();

		input.addEventListener("input", () => {
				if (input.checkValidity() && input.value !== "") {
						switch (name) {
								case "hue":
										this.model.setEditShapeProps({ 
												hue: parseInt(input.value), 
												type: shapeType,
										});
										break;
								case "hue2":
										this.model.setEditShapeProps({ 
												hue2: parseInt(input.value), 
												type: shapeType,
										});
										break;
								case "r2":
										this.model.setEditShapeProps({ 
												r2: parseInt(input.value), 
												type: shapeType,
										});
										break;
								case "n":
										this.model.setEditShapeProps({ 
												n: parseInt(input.value),
												type: shapeType,
										});
										break;
								case "rings":
										this.model.setEditShapeProps({ 
												rings: parseInt(input.value),
												type: shapeType,
										});
										break;
						}
				}
		});

		return input;
	}

	// Only used for the cat
	makeSelect(shapeType: ShapeType, options: string[]) {
		const select = document.createElement("select");
		select.id = "look";
		options.forEach((option) => {
				const optionElement = document.createElement("option");
				optionElement.value = option;
				optionElement.innerText = option;
				select.appendChild(optionElement);
		});

		select.addEventListener("change", () => {
				this.model.setEditShapeProps({ 
						look: select.value as "left" | "centre" | "right",
						type: shapeType,
				});
		});

		return select;
	}
}