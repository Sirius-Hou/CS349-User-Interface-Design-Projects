
//local imports
import { Model, StarProps } from "./model";
import { Star } from "./shape";
import { EditShapeView, Validator } from "./editShapeView";

export class EditStarView extends EditShapeView {
  //#region observer pattern

  update(): void {
    if (!this.model.editShape) return;

    const props = this.model.editShape.props as StarProps;

    let hue = props.hue || 0;
    let points = props.n || 3;
    let radius = props.r2 || 20;

    if (this.hueValidator.isValid) {
      hue = props.hue || 0;
    }
		if (this.pointsValidator.isValid) {
			points = props.n || 3;
		}
		if (this.radiusValidator.isValid) {
			radius = props.r2 || 20;
		}

		this.shape = new Star(this.model.editShape?.id, this.shapeCanvas.getContext('2d')!, `hsl(${hue}, 100%, 50%)`, 15, radius, points);
		this.shape.draw();
  }

  //#endregion

  shape: Star;

  shapeCanvas: HTMLCanvasElement;

  hueField: HTMLInputElement;
  pointsField: HTMLInputElement;
  radiusField: HTMLInputElement;

  constructor(model: Model) {
    super(model);

    this.shapeCanvas = document.createElement("canvas");
    this.shapeCanvas.id = "shapeCanvas";
    this.shapeCanvas.width = 100;
    this.shapeCanvas.height = 100;
    this.shapeDisplay.appendChild(this.shapeCanvas);

    const gc = this.shapeCanvas.getContext('2d')!;

    const props = this.model.editShape?.props as StarProps;
    this.shape = new Star(this.model.editShape?.id, gc, `hsl(${props.hue}, 100%, 50%)`, props.r1, props.r2, props.n);
    this.shape.draw();


    this.hueField = document.createElement("input");
    this.hueField.id = "hueField";
    this.hueField.type = "number";
    this.hueField.min = "0";
    this.hueField.max = "360";
    this.hueField.value = props.hue?.toString() || "0";
    const row1 = this.makeFormRow("Hue", this.hueField);
    this.form.appendChild(row1);

		this.pointsField = document.createElement("input");
		this.pointsField.id = "pointsField";
		this.pointsField.type = "number";
		this.pointsField.min = "3";
		this.pointsField.max = "10";
		this.pointsField.value = props.n?.toString() || "3";
		const row2 = this.makeFormRow("Points", this.pointsField);
		this.form.appendChild(row2);

		this.radiusField = document.createElement("input");
		this.radiusField.id = "radiusField";
		this.radiusField.type = "number";
		this.radiusField.min = "20";
		this.radiusField.max = "45";
		this.radiusField.value = props.r2?.toString() || "20";
		const row3 = this.makeFormRow("Radius", this.radiusField);
		this.form.appendChild(row3);


    // hue controller
    this.hueField.addEventListener("input", () => {
      const t = this.hueField.value;
      if (this.hueValidator.validate(t)) {
				this.hueField.style.outline = "";
        this.model.setEditShapeProps({
          hue: parseInt(t),
          type: "star",
        });
      } else {
				this.hueField.style.outline = "2px solid red";
			}
    });

		// points controller
		this.pointsField.addEventListener("input", () => {
			const t = this.pointsField.value;
			if (this.pointsValidator.validate(t)) {
				this.pointsField.style.outline = "";
				this.model.setEditShapeProps({
					n: parseInt(t),
					type: "star",
				});
			} else {
				this.pointsField.style.outline = "2px solid red";
			}
		});

		// radius controller
		this.radiusField.addEventListener("input", () => {
			const t = this.radiusField.value;
			if (this.radiusValidator.validate(t)) {
				this.radiusField.style.outline = "";
				this.model.setEditShapeProps({
					r2: parseInt(t),
					type: "star",
				});
			} else {
				this.radiusField.style.outline = "2px solid red";
			}
		});

    // register with the model when we're ready
    this.model.addObserver(this);
  }

  // form validation
  hueValidator = new Validator(0, 360);
  pointsValidator = new Validator(3, 10);
  radiusValidator = new Validator(20, 45);
}
