
//local imports
import { Model, CatProps } from "./model";
import { Cat } from "./shape";
import { EditShapeView, Validator } from "./editShapeView";

export class EditCatView extends EditShapeView {
  //#region observer pattern

  update(): void {
    if (!this.model.editShape) return;

    const props = this.model.editShape.props as CatProps;

    let hue = props.hue || 0;
    let look = props.look || "centre";

    if (this.hueValidator.isValid) {
      hue = props.hue || 0;
    }

		this.shape = new Cat(this.model.editShape?.id, this.shapeCanvas.getContext('2d')!, `hsl(${hue}, 100%, 50%)`, look);
    this.shape.draw();
  }

  //#endregion

  shape: Cat;

  shapeCanvas: HTMLCanvasElement;

  hueField: HTMLInputElement;
  lookField: HTMLSelectElement;

  constructor(model: Model) {
    super(model);

    this.shapeCanvas = document.createElement("canvas");
    this.shapeCanvas.id = "shapeCanvas";
    this.shapeCanvas.width = 100;
    this.shapeCanvas.height = 100;
    this.shapeDisplay.appendChild(this.shapeCanvas);

    const gc = this.shapeCanvas.getContext('2d')!;

    const props = this.model.editShape?.props as CatProps;
		this.shape = new Cat(this.model.editShape?.id, gc, `hsl(${props.hue}, 100%, 50%)`, props.look);
    this.shape.draw();


    this.hueField = document.createElement("input");
    this.hueField.id = "hueField";
    this.hueField.type = "number";
    this.hueField.min = "0";
    this.hueField.max = "360";
    this.hueField.value = props.hue?.toString() || "0";
    const row1 = this.makeFormRow("Hue", this.hueField);
    this.form.appendChild(row1);



		this.lookField = document.createElement("select");
		this.lookField.id = "lookField";
		// create the option elements
		const options = ["left", "centre", "right"];
		options.forEach(optionValue => {
			const option = document.createElement("option");
			option.value = optionValue;
			option.textContent = optionValue;
			if (optionValue === "Square") {
				option.selected = true;
			}
			this.lookField.appendChild(option);
		});
		this.lookField.value = props.look || "centre";
		const row2 = this.makeFormRow2("Look", this.lookField);
		this.form.appendChild(row2);

    // hue controller
    this.hueField.addEventListener("input", () => {
      const t = this.hueField.value;
      if (this.hueValidator.validate(t)) {
				this.hueField.style.outline = "";
        this.model.setEditShapeProps({
          hue: parseInt(t),
          type: "cat",
        });
      } else {
				this.hueField.style.outline = "2px solid red";
			}
    });

		// look controller
		this.lookField.addEventListener("change", () => {
			const t = this.lookField.value as "left" | "centre" | "right";
			this.model.setEditShapeProps({
				look: t,
				type: "cat",
			});
		});

    // register with the model when we're ready
    this.model.addObserver(this);
  }

  // form validation
  hueValidator = new Validator(0, 360);
}
