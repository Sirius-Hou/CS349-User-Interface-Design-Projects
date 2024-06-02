
//local imports
import { Model, BullseyeProps } from "./model";
import { Bullseye } from "./shape";
import { EditShapeView, Validator } from "./editShapeView";

export class EditBullseyeView extends EditShapeView {
  //#region observer pattern

  update(): void {
    if (!this.model.editShape) return;

    const props = this.model.editShape.props as BullseyeProps;

    let hue1 = props.hue1 || 0;
    let hue2 = props.hue2 || 0;
    let rings = props.rings || 3;

    if (this.hue1Validator.isValid) {
      hue1 = props.hue1 || 0;
    }
		if (this.hue2Validator.isValid) {
			hue2 = props.hue2 || 0;
		}
		if (this.ringsValidator.isValid) {
			rings = props.rings || 3;
		}

		this.shape = new Bullseye(this.model.editShape?.id, this.shapeCanvas.getContext('2d')!, `hsl(${hue1}, 100%, 50%)`, `hsl(${hue2}, 100%, 50%)`, rings);
		this.shape.draw();
  }

  //#endregion

  shape: Bullseye;

  shapeCanvas: HTMLCanvasElement;

  hue1Field: HTMLInputElement;
	hue2Field: HTMLInputElement;
	ringsField: HTMLInputElement;

  constructor(model: Model) {
    super(model);

    this.shapeCanvas = document.createElement("canvas");
    this.shapeCanvas.id = "shapeCanvas";
    this.shapeCanvas.width = 100;
    this.shapeCanvas.height = 100;
    this.shapeDisplay.appendChild(this.shapeCanvas);

    const gc = this.shapeCanvas.getContext('2d')!;

    const props = this.model.editShape?.props as BullseyeProps;
		this.shape = new Bullseye(this.model.editShape?.id, gc, `hsl(${props.hue1}, 100%, 50%)`, `hsl(${props.hue2}, 100%, 50%)`, props.rings);
    this.shape.draw();


    this.hue1Field = document.createElement("input");
    this.hue1Field.id = "hue1Field";
    this.hue1Field.type = "number";
    this.hue1Field.min = "0";
    this.hue1Field.max = "360";
    this.hue1Field.value = props.hue1?.toString() || "0";
    const row1 = this.makeFormRow("Hue1", this.hue1Field);
    this.form.appendChild(row1);

		this.hue2Field = document.createElement("input");
		this.hue2Field.id = "hue2Field";
		this.hue2Field.type = "number";
		this.hue2Field.min = "0";
		this.hue2Field.max = "360";
		this.hue2Field.value = props.hue2?.toString() || "0";
		const row2 = this.makeFormRow("Hue2", this.hue2Field);
		this.form.appendChild(row2);


		this.ringsField = document.createElement("input");
		this.ringsField.id = "ringsField";
		this.ringsField.type = "number";
		this.ringsField.min = "2";
		this.ringsField.max = "5";
		this.ringsField.value = props.rings?.toString() || "22";
		const row3 = this.makeFormRow("Rings", this.ringsField);
		this.form.appendChild(row3);


    // hue1 controller
    this.hue1Field.addEventListener("input", () => {
      const t = this.hue1Field.value;
      if (this.hue1Validator.validate(t)) {
				this.hue1Field.style.outline = "";
        this.model.setEditShapeProps({
          hue1: parseInt(t),
          type: "bullseye",
        });
      } else {
				this.hue1Field.style.outline = "2px solid red";
			}
    });

		// hue2 controller
		this.hue2Field.addEventListener("input", () => {
			const t = this.hue2Field.value;
			if (this.hue2Validator.validate(t)) {
				this.hue2Field.style.outline = "";
				this.model.setEditShapeProps({
					hue2: parseInt(t),
					type: "bullseye",
				});
			} else {
				this.hue2Field.style.outline = "2px solid red";
			}
		});

		// rings controller
		this.ringsField.addEventListener("input", () => {
			const t = this.ringsField.value;
			if (this.ringsValidator.validate(t)) {
				this.ringsField.style.outline = "";
				this.model.setEditShapeProps({
					rings: parseInt(t),
					type: "bullseye",
				});
			} else {
				this.ringsField.style.outline = "2px solid red";
			}
		});

    // register with the model when we're ready
    this.model.addObserver(this);
  }

  // form validation
  hue1Validator = new Validator(0, 360);
  hue2Validator = new Validator(0, 360);
  ringsValidator = new Validator(2, 5);
}
