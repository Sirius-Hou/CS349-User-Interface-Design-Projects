
//local imports
import { Model, SquareProps } from "./model";
import { Square } from "./shape";
import { EditShapeView, Validator } from "./editShapeView";

export class EditSquareView extends EditShapeView {
  //#region observer pattern

  update(): void {
    if (!this.model.editShape) return;

    const props = this.model.editShape.props as SquareProps;

    if (this.hueValidator.isValid) {
      const hue = props.hue || 0;

      this.shape = new Square(this.model.editShape?.id, this.shapeCanvas.getContext('2d')!, `hsl(${hue}, 100%, 50%)`);
      this.shape.draw();
    }
  }

  //#endregion

  shape: Square;

  shapeCanvas: HTMLCanvasElement;

  hueField: HTMLInputElement;

  constructor(model: Model) {
    super(model);

    this.shapeCanvas = document.createElement("canvas");
    this.shapeCanvas.id = "shapeCanvas";
    this.shapeCanvas.width = 100;
    this.shapeCanvas.height = 100;
    this.shapeDisplay.appendChild(this.shapeCanvas);

    const gc = this.shapeCanvas.getContext('2d')!;

    const props = this.model.editShape?.props as SquareProps;
    this.shape = new Square(this.model.editShape?.id, gc, `hsl(${props.hue}, 100%, 50%)`);
    this.shape.draw();


    this.hueField = document.createElement("input");
    this.hueField.id = "hueField";
    this.hueField.type = "number";
    this.hueField.min = "0";
    this.hueField.max = "360";
    this.hueField.value = props.hue?.toString() || "0";
    const row = this.makeFormRow("Hue", this.hueField);
    this.form.appendChild(row);


    // hue controller
    this.hueField.addEventListener("input", () => {
      const t = this.hueField.value;
      if (this.hueValidator.validate(t)) {
        this.hueField.style.outline = "";
        this.model.setEditShapeProps({
          hue: parseInt(t),
          type: "square",
        });
      } else {
        this.hueField.style.outline = "2px solid red";
      }
    });

    // register with the model when we're ready
    this.model.addObserver(this);
  }

  // form validation
  hueValidator = new Validator(0, 360);
}
