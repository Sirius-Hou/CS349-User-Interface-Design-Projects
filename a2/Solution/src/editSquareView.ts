import { SKTextfield } from "simplekit/imperative-mode";

//local imports
import { Model, SquareProps } from "./model";
import { SKSquare } from "./shape";
import { EditShapeView, Validator } from "./editShapeView";

export class EditSquareView extends EditShapeView {
  //#region observer pattern

  update(): void {
    if (!this.model.editShape) return;

    const props = this.model.editShape.props as SquareProps;

    if (this.hueValidator.isValid) {
      const hue = props.hue || 0;
      this.shape.props.fill = `hsl(${hue}, 100%, 50%)`;
      this.hueField.text = hue.toString();
    }
  }

  //#endregion

  shape = new SKSquare({ width: 49, height: 49 });
  hueField = new SKTextfield({ text: "?" });

  constructor(model: Model) {
    super(model);

    // setup the view

    // the shape
    this.shape.fillWidth = 1;
    this.shape.fillHeight = 2;
    this.shape.inEditor = true;
    this.addChild(this.shape);

    // create the form for editing
    const form = this.makeFormContainer();
    this.addChild(form);

    // add hue form row
    form.addChild(this.makeFormRow("Hue", this.hueField));
    // hue controller
    this.hueField.addEventListener("textchanged", () => {
      const t = this.hueField.text;
      if (this.hueValidator.validate(t)) {
        this.model.setEditShapeProps({
          hue: parseInt(t),
          type: "square",
        });
      }
    });

    // register with the model when we're ready
    this.model.addObserver(this);
  }

  // form validation
  hueValidator = new Validator(0, 360);
}
