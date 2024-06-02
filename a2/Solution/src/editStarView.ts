import { SKTextfield } from "simplekit/imperative-mode";

//local imports
import { Model, StarProps } from "./model";
import { SKStar } from "./shape";
import { EditShapeView, Validator } from "./editShapeView";

export class EditStarView extends EditShapeView {
  //#region observer pattern

  update(): void {
    if (!this.model.editShape) return;

    const props = this.model.editShape.props as StarProps;
    
    if (this.hueValidator.isValid) {
      const hue = props.hue || 0;
      this.shape.props.fill = `hsl(${hue}, 100%, 50%)`;
      this.hueField.text = hue.toString();
    }
    if (this.r2Validator.isValid) {
      const r2 = props.r2 || 0;
      this.shape.props.r2 = r2;
      this.r2Field.text = r2.toString();
    }
    if (this.nValidator.isValid) {
      const n = props.n || 0;
      this.shape.props.n = n;
      this.nField.text = n.toString();
    }
    // update the non-editable r1 too
    const r1 = props.r1 || 0;
    this.shape.props.r1 = r1;
  }

  //#endregion

  shape = new SKStar({ width: 50, height: 50 });
  hueField: SKTextfield = new SKTextfield({ text: "?" });
  r2Field: SKTextfield = new SKTextfield({ text: "?" });
  nField: SKTextfield = new SKTextfield({ text: "?" });

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

    // Hue

    form.addChild(this.makeFormRow("Hue", this.hueField));
    this.hueField.addEventListener("textchanged", () => {
      const t = this.hueField.text;
      if (this.hueValidator.validate(t)) {
        this.model.setEditShapeProps({
          hue: parseInt(t),
          type: "star",
        });
      }
    });

    // Radius

    form.addChild(this.makeFormRow("Radius", this.r2Field));

    this.r2Field.addEventListener("textchanged", () => {
      const t = this.r2Field.text;
      if (this.r2Validator.validate(t)) {
        this.model.setEditShapeProps({
          r2: parseInt(t),
          type: "star",
        });
      }
    });

    // Points

    form.addChild(this.makeFormRow("Points", this.nField));

    this.nField.addEventListener("textchanged", () => {
      const t = this.nField.text;
      if (this.nValidator.validate(t)) {
        this.model.setEditShapeProps({
          n: parseInt(t),
          type: "star",
        });
      }
    });

    // register with the model when we're ready
    this.model.addObserver(this);
  }

  hueValidator = new Validator(0, 360);
  r2Validator = new Validator(20, 45);
  nValidator = new Validator(3, 10);
}




